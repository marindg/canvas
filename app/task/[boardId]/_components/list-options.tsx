"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { List } from "@/types/taskBoard";

import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { FormSubmit } from "./form-submit";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({
  data,
  onAddCard,
}: ListOptionsProps) => {
  const handleRemoveList = useMutation(
    api.tasks.removeList
  );

  const onDelete = async (formData: FormData) => {
    const id = formData.get("id") as Id<"taskBoardList">;
    // const boardId = formData.get("boardId") as Id<"boards">;

    await handleRemoveList({
      listId: id,
    })
      .then((id) => {
        toast.success("List removed");
      })
      .catch((e) => {
        toast.error("Failed to remove list");
      });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="h-auto w-auto p-2"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 pt-3 pb-3"
        side="bottom"
        align="start"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4 " />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card
        </Button>
        <form>
          <input
            hidden
            id="id"
            name="id"
            value={data._id}
          />
          <input
            hidden
            id="boardId"
            name="boardId"
            value={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input
            hidden
            id="id"
            name="id"
            value={data._id}
          />
          <input
            hidden
            id="boardId"
            name="boardId"
            value={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
