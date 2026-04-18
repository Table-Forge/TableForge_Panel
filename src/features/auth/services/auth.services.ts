import { api } from "@/src/features/api";
import {
  LoginResponseSchema,
  type ILoginRequest,
  type ILoginResponse,
} from "@/src/features/auth/schemas/auth.schema";

const ENDPOINT = "/users";

export const AuthService = {
  login: async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    const { data } = await api.post(`${ENDPOINT}/authenticate`, null, {
      params: credentials,
    });

    return LoginResponseSchema.parse(data);
  },

  sendRecoveryCode: async (email: string) => {
    const { data } = await api.put(`${ENDPOINT}/recovery/${email}/send-code`);
    return data;
  },
  validateRecoveryCode: async (email: string, code: string) => {
    const { data } = await api.put(
      `${ENDPOINT}/recovery/${email}/validate-code`,
      null,
      {
        params: { code, email },
      },
    );
    return data;
  },
  updateRecoveryPassword: async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    const { data } = await api.put(
      `${ENDPOINT}/recovery/${email}/password`,
      null,
      {
        params: { code, email, newPassword },
      },
    );
    return data;
  },
};
