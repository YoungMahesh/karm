export default function Button1({
  children,
  onClick,
}: {
  children: string;
  onClick: (_: any) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
    >
      {children}
    </button>
  );
}
