import { useAuth } from "@/src/context/use-auth";
import { useBoundStore } from "@/src/store/use-bound-store";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../button/button";

export const Header = () => {
  const { user, signOut } = useAuth();
  const openModal = useBoundStore((state) => state.openModal);
  const closeModal = useBoundStore((state) => state.closeModal);
  const navigate = useNavigate();

  const confirmSignOut = async () => {
    closeModal();
    await signOut();
    navigate("/login", { replace: true });
  };

  const handleSignOut = () => {
    openModal({
      title: "Confirmar saída",
      size: "sm",
      content: (
        <div className="space-y-5">
          <p className="text-sm text-grays-100">
            Você realmente deseja sair da sua conta?
          </p>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              buttonStyle="hollow"
              className="!h-10 !px-4 !py-2"
              onClick={closeModal}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              buttonStyle="danger"
              className="!h-10 !px-4 !py-2"
              onClick={confirmSignOut}
            >
              Sair
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-primary/60 px-6 py-3.5 backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-secondary/40 bg-secondary/15 text-xs font-bold text-white shadow-inner">
          {(user?.nickname ?? user?.username ?? "A")[0]?.toUpperCase()}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-grays-200">
            Sessão ativa
          </p>
          <p className="text-sm font-bold text-white">
            {user?.nickname ?? user?.username ?? "Aventureiro"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        buttonStyle="soft"
        className="!h-9 !px-4 !py-2 !rounded-2xl border-secondary/30 hover:border-secondary/60 hover:bg-secondary/20 transition-all"
        onClick={handleSignOut}
      >
        <LogOut size={15} />
        Sair
      </Button>
    </header>
  );
};
