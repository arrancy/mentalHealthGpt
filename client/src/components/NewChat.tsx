interface NewChatProps {
  onClick: () => void;
}

export function Newchat({ onClick }: NewChatProps) {
  return (
    <>
      <div
        onClick={onClick}
        className="text-sky-900 cursor-pointer font-semibold mb-1 mt-8 sm:my-1 bg-sky-100 text-lg p-1 rounded-md hover:bg-sky-300 transition-all ease-in-out"
      >
        + new chat
      </div>
    </>
  );
}
