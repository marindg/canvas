"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
} from "@/liveblocks.config";
import { Camera } from "@/types/canvas";
import { List } from "@/types/taskBoard";
import { useQuery } from "convex/react";
import { useState } from "react";
import { CursorsPresence } from "./cursors-presence";
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

  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
  });

  const data: List[] | undefined | null = useQuery(
    api.tasks.getTaskBoardList,
    {
      id: boardId as Id<"boards">,
    }
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);

      setMyPresence({
        cursor: current,
      });
    },
    [camera]
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }) => {
      setMyPresence({ cursor: null });
    },
    []
  );

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
      <svg
        className="h-[100vh] w-[100vw]"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          <foreignObject className="w-full h-full pt-24 pl-32">
            <ListContainer
              boardId={boardId}
              data={data}
              numberOfLists={data ? data.length : 0}
            />
          </foreignObject>
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
