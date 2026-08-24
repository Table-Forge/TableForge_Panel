import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "@/src/components/button/button";
import { ModalFooter } from "../modal-footer";
import { useBoundStore } from "@/src/store/use-bound-store";
import { getCroppedImg } from "@/src/utils/crop-image";
import { ZoomIn, ZoomOut, Check } from "lucide-react";
import type { IModalCropImageProps } from "./modal-crop-image.interfaces";

export function ModalCropImage({
  imageSrc,
  aspectRatio,
  cropShape = "rect",
  onCropComplete,
}: IModalCropImageProps) {
  const closeModal = useBoundStore((state) => state.closeModal);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const onCropChangeHandler = useCallback((newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  }, []);

  const onZoomChangeHandler = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropCompleteHandler = useCallback(
    (_croppedArea: Area, croppedAreaPixelsParam: Area) => {
      setCroppedAreaPixels(croppedAreaPixelsParam);
    },
    [],
  );

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || isApplying) return;

    try {
      setIsApplying(true);
      const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedDataUrl);
      closeModal();
    } catch (err) {
      console.error("Erro ao cortar imagem:", err);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          cropShape={cropShape}
          onCropChange={onCropChangeHandler}
          onZoomChange={onZoomChangeHandler}
          onCropComplete={onCropCompleteHandler}
        />
      </div>

      <div className="flex items-center gap-3 px-2">
        <ZoomOut size={16} className="text-white/60" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-secondary"
          aria-label="Controle de zoom"
        />
        <ZoomIn size={16} className="text-white/60" />
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
