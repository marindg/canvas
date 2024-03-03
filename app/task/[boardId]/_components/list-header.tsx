"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { convertToNumber } from "@/lib/utils";
import { List } from "@/types/taskBoard";
import {
  ElementRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { FormInput } from "./form-input";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export const ListHeader = ({
  data,
  onAddCard,
}: ListHeaderProps) => {
  const [title, setTitle] = useState<string>(data.title);
  const [order, setOrder] = useState<number>(data.order);
  const [isEditing, setIsEditing] =
    useState<boolean>(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const handleRemoveList = useApiMutation(
    api.tasks.removeList
  );

  const { mutate, pending } = useApiMutation(
    api.tasks.updateList
  );

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  useEffect(() => {
    setTitle(data.title);
  }, [data.title]);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (formData: FormData) => {
    const newTitle = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    const newOrder = convertToNumber(
      formData.get("order")
    ) as number;

    if (newTitle === title && newOrder === order)
      return disableEditing();

    await mutate({
      listId: id,
      boardId,
      title: newTitle,
      order: newOrder,
    })
      .then(() => {
        toast.success("List updated");
        setTitle(newTitle);
        disableEditing();
      })
      .catch(() => {
        toast.error("Failed to update list");
        disableEditing();
      });
    disableEditing();
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener("keydown", onKeydown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form
          className="flex-1 px-[2px]"
          ref={formRef}
          action={handleSubmit}
        >
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
          <input
            hidden
            id="order"
            name="order"
            value={data.order | 0}
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            placeholder="Enter list title..."
            defaultValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white shadow-none"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions data={data} onAddCard={onAddCard} />
    </div>
  );
};
