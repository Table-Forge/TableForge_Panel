import { useAuth } from "@/src/context/auth";
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
            Você realmente deseja deslogar da sua conta?
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
    <header className="flex items-center justify-between border-b border-white/10 bg-primary/45 px-5 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-grays-100">
          Sessão ativa
        </p>
        <p className="text-sm font-semibold text-white">
          {user?.nickname ?? user?.username ?? "Aventureiro"}
        </p>
      </div>

      <Button
        type="button"
        buttonStyle="secondary"
        className="!h-10 !px-3 !py-2"
        onClick={handleSignOut}
      >
        <LogOut size={16} />
        Sair
      </Button>
    </header>
  );
};
