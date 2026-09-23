import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background p-6 text-white">
          <div className="flex max-w-md flex-col items-center chamfer-md border border-white/10 bg-card p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center chamfer-sm border border-secondary/40 bg-secondary/15 text-secondary mb-4">
              <AlertTriangle size={28} />
            </div>
            <h1 className="font-display text-lg font-bold uppercase tracking-[0.04em] text-white">
              Ocorreu um Erro Inesperado
            </h1>
            <p className="mt-2 text-xs text-grays-100 leading-relaxed">
              Desculpe, ocorreu uma falha ao renderizar a página. Tente recarregar para restaurar o estado.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 chamfer-sm border border-secondary/50 bg-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-accent shadow-forged transition-all hover:brightness-110"
            >
              <RefreshCw size={14} /> Recarregar Página
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
