import type { ReactNode } from "react";

interface IModalFooterProps {
  children: ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<IModalFooterProps> = ({
  children,
  className = "",
}) => {
  return (
    <footer
      className={`sticky -bottom-5 z-10 -mx-6 -mb-5 mt-auto flex items-center justify-end gap-3 border-t border-white/10 bg-primary px-6 py-4 max-[992px]:-mx-4 max-[992px]:-mb-3 max-[992px]:px-4 max-[992px]:py-3 ${className}`}
    >
      {children}
    </footer>
  );
};
