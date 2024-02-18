"use client";

import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
} from "@/liveblocks.config";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

import { pointerEventToCanvasPoint } from "@/lib/utils";
import {
  Camera,
  CanvasMode,
  CanvasState,
} from "@/types/canvas";
import {
  useCallback,
  useState,
} from "react";
import { CursorsPresence } from "./cursors-presence";

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({
  boardId,
}: CanvasProps) => {
  const [canvasState, setCanvasState] =
    useState<CanvasState>({
      mode: CanvasMode.None,
    });

  const [camera, setCamera] =
    useState<Camera>({
      x: 0,
      y: 0,
    });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  // If pb whith infinite go Cursors Presence 6:39:00
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      console.log({
        x: e.deltaX,
        y: e.deltaY,
      });
      setCamera((camera) => ({
        x: camera.x - e.deltaX,
        y: camera.y - e.deltaY,
      }));
    },
    []
  );

  const onPointerMove = useMutation(
    (
      { setMyPresence },
      e: React.PointerEvent
    ) => {
      e.preventDefault();

      const current =
        pointerEventToCanvasPoint(
          e,
          camera
        );

      setMyPresence({
        cursor: current,
      });
    },
    []
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
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g>
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
