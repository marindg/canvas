"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";

interface ButtonSelectCanvaProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const ButtonSelectCanva = ({
  name,
  icon,
  onClick,
  disabled,
}: ButtonSelectCanvaProps) => {
  const { pending } = useApiMutation(api.board.create);

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 group aspect-[100/127] rounded-lg bg-blue-600 hover:bg-blue-800 flex flex-col items-center justify-center py-8",
        (pending || disabled) &&
          "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}
    >
      {icon}
      <p className="text-xl font-semibold text-white ">
        {name}
      </p>
    </button>
  );
};
