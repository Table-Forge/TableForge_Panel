import { ENV } from "@/src/config/env";
import { useAuth } from "@/src/context/use-auth";
import { USER_FEEDBACKS_KEYS } from "@/src/features/user-feedbacks/hooks/query-keys";
import type {
  IUserFeedback,
  IUserFeedbackMessage,
} from "@/src/features/user-feedbacks/interfaces";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type PropsWithChildren } from "react";

export function SignalRProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { authData } = useAuth();

  const token = authData?.token?.value;

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${ENV.API_URL}/hubs/chat`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveFeedbackMessage", (message: IUserFeedbackMessage) => {
      if (!message?.feedbackId) return;

      queryClient.setQueryData<IUserFeedback>(
        USER_FEEDBACKS_KEYS.detail(message.feedbackId),
        (oldData) => {
          if (!oldData) return oldData;

          const exists = oldData.messages?.some((m) => m.id === message.id);
          if (exists) return oldData;

          return {
            ...oldData,
            messages: [...(oldData.messages || []), message],
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: USER_FEEDBACKS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_FEEDBACKS_KEYS.summaries() });
    });

    const started = connection
      .start()
      .catch((error) => console.error("SignalR Connection Error: ", error));

    return () => {
      void started.then(() => connection.stop());
    };
  }, [queryClient, token]);

  return children;
}
