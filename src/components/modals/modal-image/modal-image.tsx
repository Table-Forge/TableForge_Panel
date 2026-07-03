interface IModalImageProps {
  alt: string;
  src: string;
}

export const ModalImage = ({ alt, src }: IModalImageProps) => {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <img
        src={src}
        alt={alt}
        className="max-h-[80vh] w-auto max-w-full rounded-md object-contain shadow-lg"
      />
    </div>
  );
};
