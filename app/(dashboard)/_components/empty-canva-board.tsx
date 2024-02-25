import Image from "next/image";

export const EmptyCanvaBoard = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-favorites.svg"
        alt="Empty"
        height={140}
        width={140}
      />
      <h2 className="text-2xl font-semibold mt-6">
        No Canva boards !
      </h2>
      <p className="text-muted-foreground textg-sm mt-2">
        Try add a board
      </p>
    </div>
  );
};
