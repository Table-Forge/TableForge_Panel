import { Button } from "@/src/components/button/button";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { useSpaceBookingMutations } from "@/src/features/spaces/hooks/use-spaces-mutations";
import { useBookingMessages } from "@/src/features/spaces/hooks/use-spaces-queries";
import { useAuth } from "@/src/context/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import { z } from "zod";
import { formatDate } from "@/src/utils/format";

interface IProps {
  bookingId: number;
}

const chatSchema = z.object({
  content: z.string().min(1, "A mensagem não pode estar vazia"),
});

type IChatForm = z.infer<typeof chatSchema>;

export function ChatBox({ bookingId }: IProps) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useBookingMessages(bookingId);
  const { sendMessageMutation } = useSpaceBookingMutations();

  const bottomRef = useRef<HTMLDivElement>(null);

  const form = useForm<IChatForm>({
    defaultValues: { content: "" },
    resolver: zodResolver(chatSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = handleSubmit((data) => {
    sendMessageMutation.mutate(
      { bookingId, content: data.content },
      {
        onSuccess: () => reset(),
      }
    );
  });

  return (
    <div className="flex h-[400px] flex-col rounded-lg border border-white/10 bg-secondary/30">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p className="text-center text-sm text-grays-100">Carregando histórico...</p>
        ) : messages?.length ? (
          messages.map((msg) => {
            const isMe = msg.userId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <span className="mb-1 text-xs text-grays-100">
                  {msg.username} • {formatDate(msg.createdAt, true)}
                </span>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isMe
                      ? "bg-primary text-white"
                      : "bg-secondary text-grays-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-grays-100">
            Nenhuma mensagem neste chat ainda.
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={onSubmit}
        className="flex items-start gap-2 border-t border-white/10 bg-secondary p-3"
      >
        <div className="flex-1">
          <ControlledInput
            hookForm={form}
            name="content"
            placeholder="Digite uma mensagem..."
            error={errors.content?.message}
          />
        </div>
        <Button
          type="submit"
          buttonStyle="primary"
          className="mt-1"
          isLoading={sendMessageMutation.isPending}
          disabled={sendMessageMutation.isPending}
        >
          <MdSend />
        </Button>
      </form>
    </div>
  );
}
