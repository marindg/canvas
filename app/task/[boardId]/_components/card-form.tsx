"use client";

import { FormTextarea } from "@/components/form-textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  useRef,
} from "react";
import { toast } from "sonner";
import {
  useEventListener,
  useOnClickOutside,
} from "usehooks-ts";
import { FormSubmit } from "./form-submit";

interface CardFormProps {
  listId: string;
  boardId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<
  HTMLTextAreaElement,
  CardFormProps
>(
  (
    {
      listId,
      isEditing,
      enableEditing,
      disableEditing,
      boardId,
    },
    ref
  ) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const { mutate, pending } = useApiMutation(
      api.tasks.createCard
    );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<
      HTMLTextAreaElement
    > = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = async (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get(
        "listId"
      ) as Id<"taskBoardList">;
      const boardId = formData.get(
        "boardId"
      ) as Id<"boards">;

      if (title) {
        await mutate({
          boardId,
          title,
          listId,
        })
          .then((id) => {
            toast.success("Card created");
            formRef.current?.reset();
          })
          .catch((e) => {
            toast.error("Failed to create card");
          });
        disableEditing();
      }
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card"
          />
          <input
            hidden
            id="listId"
            name="listId"
            value={listId}
          />
          <input
            hidden
            id="boardId"
            name="boardId"
            value={boardId}
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit variant="ghost">
              Add card
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
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";

export default CardForm;
