export interface IModalCropImageProps {
  imageSrc: string;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
  onCropComplete: (croppedDataUrl: string) => void;
}
