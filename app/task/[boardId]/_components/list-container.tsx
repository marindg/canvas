import { ListWithCards } from "@/types/taskBoard";
import { useEffect, useState } from "react";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

interface ListContainerProps {
  data: ListWithCards[] | null | undefined;
  boardId: string;
  numberOfLists: number;
}

export const ListContainer = ({
  data,
  boardId,
  numberOfLists,
}: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState<
    ListWithCards[] | null | undefined
  >(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData?.map((list, index) => (
        <ListItem
          key={list._id}
          index={index}
          data={list}
          boardId={boardId}
        />
      ))}
      <ListForm
        boardId={boardId}
        numberOfLists={numberOfLists}
      />
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
};
