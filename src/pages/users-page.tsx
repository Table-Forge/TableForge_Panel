import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { UserService } from "@/src/features/users/services/users.services";

export function UsersPage() {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getAll(),
  });

  const errorDetail = (() => {
    if (!usersQuery.error) return null;

    if (isAxiosError(usersQuery.error)) {
      return usersQuery.error.response?.data?.Message ?? usersQuery.error.message;
    }

    if (usersQuery.error instanceof Error) {
      return usersQuery.error.message;
    }

    return "Erro inesperado ao carregar usuários.";
  })();

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-secondary/20 bg-primary/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Gestão</p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Usuários</h2>
        <p className="mt-2 text-sm text-grays-100">
          Consulta rápida de usuários vindos da API para administração do app.
        </p>
      </header>

      {usersQuery.isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-primary/55 p-6 text-sm text-grays-100">
          Carregando usuários...
        </div>
      ) : null}

      {usersQuery.isError ? (
        <div className="rounded-2xl border border-danger/50 bg-danger/10 p-6 text-sm text-white">
          Não foi possível carregar os usuários agora.
          {errorDetail ? <p className="mt-2 text-xs text-white/80">{errorDetail}</p> : null}
        </div>
      ) : null}

      {usersQuery.data && usersQuery.data.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-primary/80">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-secondary/20 text-xs uppercase tracking-[0.16em] text-grays-100">
              <tr>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Nickname</th>
                <th className="px-4 py-3">E-mail</th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.data.map((user) => (
                <tr key={user.id ?? user.email} className="border-t border-white/8">
                  <td className="px-4 py-3 text-white">{user.username || "-"}</td>
                  <td className="px-4 py-3 text-white/90">{user.nickname || "-"}</td>
                  <td className="px-4 py-3 text-grays-100">{user.email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {usersQuery.data && usersQuery.data.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-primary/55 p-6 text-sm text-grays-100">
          Nenhum usuário encontrado.
        </div>
      ) : null}
    </div>
  );
}
