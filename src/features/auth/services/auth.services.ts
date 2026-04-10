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
};
