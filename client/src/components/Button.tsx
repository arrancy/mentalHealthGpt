interface ButtonProps {
  label: string | JSX.Element;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <>
      <button
        className=" w-full m-2 font-semibold text-sky-200 bg-sky-900 rounded-xl hover:text-sky-900 hover:bg-sky-200 py-3 ease-in-out duration-300"
        onClick={onClick}
      >
        {label}
      </button>
    </>
  );
}
