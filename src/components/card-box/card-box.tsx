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
    <section
      className={`relative w-full rounded-2xl border border-secondary/25 bg-primary/80 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.25)] ${className}`}
    >
      {title ? (
        <header className="mb-4 border-b border-white/10 pb-3">
          {typeof title === "string" ? (
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
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
    </section>
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
    className={`rounded-xl border border-white/10 bg-background/30 p-3 flex gap-2 flex-col ${className}`}
  >
    {children}
  </div>
);

export const CardLabel: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => (
  <span
    className={`text-[10px] font-bold uppercase tracking-widest text-grays-100 ${className}`}
  >
    {children}
  </span>
);

export const CardValue: React.FC<TCardBoxComponentProps> = ({
  children,
  className = "",
}) => (
  <span className={`text-sm font-semibold text-white ${className}`}>
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
