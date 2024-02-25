// SelectCanvaDialog.tsx
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LayoutList, Presentation } from "lucide-react";
import { ButtonSelectCanva } from "./button-select-canva";

interface SelectCanvaDialogProps {
  handleBoard: () => void;
  handleTask: () => void;
  disabled?: boolean;
}

export const SelectCanvaDialog: React.FC<
  SelectCanvaDialogProps
> = ({ handleBoard, handleTask, disabled }) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Which type of canva?</DialogTitle>
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
  );
};
