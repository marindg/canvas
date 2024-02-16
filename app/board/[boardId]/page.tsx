import { Canvas } from "./_components/canvas";

interface BoardIdPageProps {
  params: { boardId: string };
}

const BoardIdPage = ({
  params,
}: BoardIdPageProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        boardId={params.boardId}
      />
    </div>
  );
};

export default BoardIdPage;
