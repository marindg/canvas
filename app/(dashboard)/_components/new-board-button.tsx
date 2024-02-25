"use client";

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SelectCanvaDialog } from "./select-type-new-canvas";

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
      type: "board",
    })
      .then((id) => {
        toast.success("Board created");
        router.push(`/board/${id}`);
      })
      .catch(() => {
        toast.error("Failed to create board");
      });
  };

  const handleTask = () => {
    mutate({
      orgId,
      title: "Untitle",
      type: "task",
    })
      .then((id) => {
        toast.success("Task board created");
        router.push(`/task/${id}`);
      })
      .catch(() => {
        toast.error("Failed to create task board");
      });
  };

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
      <SelectCanvaDialog
        handleBoard={handleBoard}
        handleTask={handleTask}
        disabled={disabled}
      />
    </Dialog>
  );
};
