"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Plus, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { ListWrapper } from "./list-wrapper";

interface ListFormProps {
  boardId: string;
  numberOfLists: number;
}

export const ListForm = ({
  boardId,
  numberOfLists,
}: ListFormProps) => {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const { mutate, pending } = useApiMutation(
    api.tasks.createList
  );
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;

    if (title) {
      await mutate({
        boardId,
        title,
        numberOfLists,
      })
        .then((id) => {
          toast.success("List created");
        })
        .catch(() => {
          toast.error("Failed to create list");
        });
      disableEditing();
    }
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
          action={onSubmit}
        >
          <FormInput
            ref={inputRef}
            id="title"
            className="text-sm px-2 py-2 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title"
          />
          <input hidden value={boardId} name="boardId" />
          <div className="flex items-center gap-x-1">
            <FormSubmit
              variant="primary"
              className="bg-blue-500/80"
            >
              Add list
            </FormSubmit>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="shadow-md w-full rounded-md bg-white/50 hover:bg-gray-100 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};
