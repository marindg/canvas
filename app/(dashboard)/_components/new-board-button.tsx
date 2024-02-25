"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import {
  LayoutList,
  Plus,
  Presentation,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ButtonSelectCanva } from "./button-select-canva";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({
  orgId,
  disabled,
}: NewBoardButtonProps) => {
  const router = useRouter();

  const { mutate, pending } = useApiMutation(
    api.board.create
  );

  const handleBoard = () => {
    mutate({
      orgId,
      title: "Untitle",
    })
      .then((id) => {
        toast.success("Board created");
        router.push(`/board/${id}`);
      })
      .catch(() => {
        toast.error("Failed to create board");
      });
  };

  const handleTask = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6">
          <div />
          <Plus className="h-12 w-12 text-white stroke" />
          <p className="text-xs text-white font-light ">
            New board
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Which type of canva ?</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-6">
          <ButtonSelectCanva
            name="Board"
            icon={
              <Presentation className="h-12 w-12 text-white" />
            }
            onClick={handleBoard}
            disabled={disabled}
          />
          <ButtonSelectCanva
            name="Task"
            icon={
              <LayoutList className="h-12 w-12 text-white stroke" />
            }
            onClick={handleTask}
            disabled={disabled}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
