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
import { ElementRef, useRef } from "react";
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
  const closeRef = useRef<ElementRef<"button">>(null);

  const handleRemoveList = useMutation(
    api.tasks.removeList
  );
  const handleCopyList = useMutation(api.tasks.copyList);

  const onDelete = async (formData: FormData) => {
    const id = formData.get("id") as Id<"taskBoardList">;

    await handleRemoveList({
      listId: id,
    })
      .then((id) => {
        toast.success("List removed");
        closeRef.current?.click();
      })
      .catch((e) => {
        toast.error("Failed to remove list");
      });
  };

  const onCopyList = async (formData: FormData) => {
    const id = formData.get("id") as Id<"taskBoardList">;
    const boardId = formData.get("boardId") as Id<"boards">;

    await handleCopyList({
      listId: id,
      boardId,
    })
      .then((id) => {
        toast.success("List duplicated");
        closeRef.current?.click();
      })
      .catch((e) => {
        toast.error("Failed to copy list");
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
        className="px-0 pt-3 pb-1"
        side="bottom"
        align="start"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>
        <PopoverClose asChild ref={closeRef}>
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
        <form action={onCopyList}>
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
