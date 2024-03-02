import { List } from "@/types/taskBoard";
import { ListForm } from "./list-form";

interface ListContainerProps {
  data: List[] | null | undefined;
  boardId: string;
  numberOfLists: number;
}

export const ListContainer = ({
  data,
  boardId,
  numberOfLists,
}: ListContainerProps) => {
  return (
    <ol>
      <ListForm
        boardId={boardId}
        numberOfLists={numberOfLists}
      />
    </ol>
  );
};
