import { useState, useEffect } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/src/components/button/button";
import { ModalFooter } from "../modal-footer";
import { useBoundStore } from "@/src/store/use-bound-store";
import { getCroppedImg } from "@/src/utils/crop-image";
import { Check, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import type { IModalCropImageProps } from "./modal-crop-image.interfaces";

export function ModalCropImage({
  imageSrc,
  aspectRatio,
  cropShape = "rect",
  onCropComplete,
}: IModalCropImageProps) {
  const closeModal = useBoundStore((state) => state.closeModal);
  const addToast = useBoundStore((state) => state.addToast);

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [naturalAspect, setNaturalAspect] = useState<number | undefined>(undefined);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setNaturalAspect(undefined);
  }, [imageSrc]);

  const resolvedAspect =
    cropShape === "round" ? 1 : (aspectRatio ?? naturalAspect ?? 4 / 3);

  const handleResetCrop = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handleApplyCrop = async () => {
    if (isApplying || !croppedAreaPixels) return;

    try {
      setIsApplying(true);
      const croppedDataUrl = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        "image/webp",
        true,
      );
      onCropComplete(croppedDataUrl);
      closeModal();
    } catch (err) {
      console.error("Erro ao cortar imagem:", err);
      addToast("error", "Não foi possível cortar a imagem.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/90">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={resolvedAspect}
          cropShape={cropShape}
          showGrid={cropShape === "rect"}
          zoomWithScroll={true}
          minZoom={1}
          maxZoom={3}
          restrictPosition={true}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onMediaLoaded={(mediaSize) => {
            setNaturalAspect(mediaSize.naturalWidth / mediaSize.naturalHeight);
          }}
          onCropComplete={(_croppedArea, croppedAreaPixelsParam) => {
            setCroppedAreaPixels(croppedAreaPixelsParam);
          }}
        />
      </div>

      <div className="flex items-center gap-3 px-2">
        <button
          type="button"
          onClick={() =>
            setZoom((prev) => Math.max(1, Number((prev - 0.1).toFixed(2))))
          }
          className="text-white/60 transition-colors hover:text-white"
          aria-label="Diminuir zoom"
        >
          <ZoomOut size={16} />
        </button>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-secondary"
          aria-label="Controle de zoom"
        />
        <button
          type="button"
          onClick={() =>
            setZoom((prev) => Math.min(3, Number((prev + 0.1).toFixed(2))))
          }
          className="text-white/60 transition-colors hover:text-white"
          aria-label="Aumentar zoom"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-white/60">
        <span>
          Arraste a imagem para ajustar. Use o scroll do mouse ou os botões para controlar o zoom.
        </span>
        <Button
          type="button"
          buttonStyle="hollow"
          size="sm"
          onClick={handleResetCrop}
          disabled={isApplying}
        >
          <RotateCcw size={14} />
          Resetar
        </Button>
      </div>

      <ModalFooter>
        <Button
          type="button"
          buttonStyle="hollow"
          onClick={closeModal}
          disabled={isApplying}
        >
          Cancelar
        </Button>

        <Button
          type="button"
          onClick={handleApplyCrop}
          buttonStyle="primary"
          isLoading={isApplying}
          disabled={isApplying || !croppedAreaPixels}
        >
          <Check size={16} />
          Aplicar corte
        </Button>
      </ModalFooter>
    </div>
  );
}
