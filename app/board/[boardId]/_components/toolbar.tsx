export const Toolbar = () => {
  const tools = ["Pencil", "Square", "Circle", "Ellipsis"];
  const actions = ["Undo", "Redo"];

  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 bg-white
                 flex flex-col gap-y-4">
      {/* Tools: Pencil, Circle, Ellipsis, etc... */}
      <div
        className="bg-white rounded-md p-1.5 gap-y-1 flex-col 
                    items-center shadow-md">
        {tools.map((n, i) => {
          return <div key={i}>{n}</div>;
        })}
      </div>
      {/* actions: Undo,Redo */}
      <div
        className="bg-white rounded-md p-1.5 flex 
                        flex-col items-center shadow-md">
        {actions.map((n, i) => {
          return <div key={i}>{n}</div>;
        })}
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 bg-white
             flex flex-col gap-y-4 h-[360px] w-[52px] shadow-md rounded-md"></div>
  );
};
