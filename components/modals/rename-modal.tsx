"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useRenameModal } from "@/store/use-rename-modal";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

export const RenameModal = () => {
  const { mutate, pending } =
    useApiMutation(api.board.update);

  const {
    isOpen,
    onClose,
    initialValues,
  } = useRenameModal();

  const [title, setTitle] = useState(
    initialValues.title
  );

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const onSumbit: FormEventHandler<
    HTMLFormElement
  > = (e) => {
    e.preventDefault();
    mutate({
      id: initialValues.id,
      title,
    })
      .then(() => {
        toast.success("Board renamed");
        onClose();
      })
      .catch(() => {
        toast.error(
          "Failed to rename board"
        );
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit board title
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter a new title for this
          board
        </DialogDescription>
        <form
          onSubmit={onSumbit}
          className="space-y-4"
        >
          <Input
            disabled={false}
            required
            maxLength={60}
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Board title"
          />
          <DialogFooter>
            <DialogClose>
              <Button
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={false}
              type="submit"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
