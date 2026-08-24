import { useState, useEffect, useCallback } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface ICarouselImage {
  id?: number | string;
  url: string;
  alt?: string;
}

interface IModalImageCarouselProps {
  images: ICarouselImage[];
  initialIndex?: number;
}

export function ModalImageCarousel({ images, initialIndex = 0 }: IModalImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 p-2">
      <div className="relative flex items-center justify-center w-full max-h-[70vh] min-h-[300px] overflow-hidden rounded-lg bg-grays-900 border border-grays-700">
        <img
          src={currentImage.url}
          alt={currentImage.alt || `Anexo ${currentIndex + 1}`}
          className="max-h-[70vh] max-w-full object-contain select-none"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer"
              aria-label="Imagem anterior"
            >
              <MdChevronLeft className="h-7 w-7" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer"
              aria-label="Próxima imagem"
            >
              <MdChevronRight className="h-7 w-7" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-col items-center gap-3 w-full">
          <span className="text-xs font-semibold text-grays-300">
            {currentIndex + 1} / {images.length}
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-full overflow-x-auto p-1">
            {images.map((img, index) => (
              <button
                key={img.id ?? index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-14 w-14 overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
                  index === currentIndex
                    ? "border-accent scale-105"
                    : "border-grays-700 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt || `Miniatura ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
