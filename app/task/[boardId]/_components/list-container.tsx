import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { ListWithCards } from "@/types/taskBoard";
import {
  DragDropContext,
  Droppable,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

  const { mutate, pending } = useApiMutation(
    api.tasks.updateListOrder
  );

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  function reorded<T>(
    list: T[],
    startIndex: number,
    endIndex: number
  ) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const onDragEnd = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return null;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return null;
    }

    if (type === "list") {
      const items: any = reorded(
        orderedData as ListWithCards[],
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));

      setOrderedData(items);

      console.log(items);

      await mutate({
        items,
        boardId,
      })
        .then(() => {
          toast.success("List order updated");
        })
        .catch((e) => {
          console.log(e);
          toast.error("Failed to update order list");
        });
    }

    if (type === "card") {
      let newOrderedData = [
        ...(orderedData as ListWithCards[]),
      ];

      const sourceList = newOrderedData.find(
        (list) => list._id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list._id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return null;
      }

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destList.cards) {
        destList.cards = [];
      }

      if (source.droppableId === destination.droppableId) {
        const reorderedCards: any = reorded(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach(
          (card: any, index: number) => {
            card.order = index;
          }
        );

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        // trigger server action
      } else {
        const [movedCard] = sourceList.cards.splice(
          source.index,
          1
        );

        movedCard.listId = destination.droppableId;

        destList.cards.splice(
          destination.index,
          0,
          movedCard
        );

        sourceList.cards.forEach(
          (card: any, index: number) => {
            card.order = index;
          }
        );

        destList.cards.forEach(
          (card: any, index: number) => {
            card.order = index;
          }
        );
        setOrderedData(newOrderedData);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="lists"
        type="list"
        direction="horizontal"
      >
        {(provided) => (
          <ol
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-x-3 h-full"
          >
            {orderedData?.map((list, index) => (
              <ListItem
                key={list._id}
                index={index}
                data={list}
                boardId={boardId}
              />
            ))}
            {provided.placeholder}
            <ListForm
              boardId={boardId}
              numberOfLists={numberOfLists}
            />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
