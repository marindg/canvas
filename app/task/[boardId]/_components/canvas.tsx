"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
} from "@/liveblocks.config";
import { List } from "@/types/taskBoard";
import { useQuery } from "convex/react";
import { Info } from "./info";
import { ListContainer } from "./list-container";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const data: List[] | undefined | null = useQuery(
    api.tasks.getTaskBoardList,
    {
      id: boardId as Id<"boards">,
    }
  );

  console.log(data);
  // if (!data) return <InfoSkeleton />;

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <div className="w-full h-full pt-24 pl-32">
        <ListContainer
          boardId={boardId}
          data={data}
          numberOfLists={data ? data.length : 0}
        />
      </div>
    </main>
  );
};
