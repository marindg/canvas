"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SelectCanvaDialog } from "./select-type-new-canvas";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const EmptyBoards = ({
  orgId,
  disabled,
}: NewBoardButtonProps) => {
  const router = useRouter();

  const { organization } = useOrganization();
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
      .catch((e) => {
        toast.error("Failed to create task board");
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/note.svg"
        alt="Empty"
        height={110}
        width={110}
      />
      <h2 className="text-2xl font-semibold mt-6">
        Create your first board !
      </h2>
      <p className="text-muted-foreground textg-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" disabled={pending}>
              <div />

              <p className="text-xs text-white font-light ">
                New board
              </p>
            </Button>
          </DialogTrigger>
          <SelectCanvaDialog
            handleBoard={handleBoard}
            handleTask={handleTask}
            disabled={disabled}
          />
        </Dialog>
      </div>
    </div>
  );
};
