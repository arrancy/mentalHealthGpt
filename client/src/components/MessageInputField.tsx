interface MessageInputFieldProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MessageInputField({ onChange }: MessageInputFieldProps) {
  return (
    <>
      <input
        onChange={onChange}
        className="border-2  border-sky-900 focus:ring-1 outline-none focus:ring-sky-900 rounded-lg my-2 col-span-5 px-1   w-full "
      ></input>
    </>
  );
}
