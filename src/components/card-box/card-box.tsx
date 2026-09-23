import { Card } from "@/src/components/card/card";
import { KeystoneIcon } from "@/src/components/icons/icons";
import type { ICardBox } from "./card-box.interfaces";
import Masonry from "react-masonry-css";

type TCardBoxComponentProps = {
  children: React.ReactNode;
  className?: string;
};

export const CardBox: React.FC<ICardBox> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <Card as="section" className={`w-full ${className}`}>
      {title ? (
        <header className="mb-4 border-b border-white/10 pb-3.5 flex items-center justify-between">
          {typeof title === "string" ? (
            <h3 className="flex items-center gap-2.5 font-display text-sm font-bold uppercase tracking-[0.06em] text-white">
              <KeystoneIcon className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
              {title}
            </h3>
          ) : (
            title
          )}
        </header>
      ) : null}

      <div className="text-sm text-white/90 flex flex-col gap-2">
        {children}
      </div>
    </Card>
  );
};

export const CardsGrid: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => (
  <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${className}`}>
    {children}
  </div>
);

export const InfoBox: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => (
  <div
    className={`chamfer-sm border border-white/10 bg-white/5 p-4 flex gap-1.5 flex-col transition-colors duration-200 hover:border-white/20 hover:bg-white/10 ${className}`}
  >
    {children}
  </div>
);

export const CardLabel: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => (
  <span
    className={`text-[11px] font-semibold uppercase tracking-[0.2em] text-grays-200 ${className}`}
  >
    {children}
  </span>
);

export const CardValue: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => (
  <span className={`text-sm font-bold text-white leading-snug ${className}`}>
    {children}
  </span>
);

export const GridBox: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => (
  <div
    className={`grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
  >
    {children}
  </div>
);

export const FlexBox: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => (
  <div className={`flex flex-wrap gap-3 ${className}`}>{children}</div>
);

export const CardsBlock: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => <div className={`flex flex-col gap-4 ${className}`}>{children}</div>;

export const CardsMasonry: React.FC<{
  children: React.ReactNode;
  className?: string;
  breakpoints?: Record<number | "default", number>;
}> = ({
  children,
  className = "",
  breakpoints = {
    default: 2,
    992: 1,
  },
}) => (
  <Masonry
    breakpointCols={breakpoints}
    className={`tf-masonry-grid ${className}`}
    columnClassName="tf-masonry-grid-column"
  >
    {children}
  </Masonry>
);
