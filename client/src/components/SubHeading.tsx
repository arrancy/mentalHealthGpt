import { HeadingProps } from "./BigHeading";

export function SubHeading({ label }: HeadingProps) {
  return (
    <>
      <div className="text-sm text-sky-400 text-opacity-60 font-semibold">
        {label}
      </div>
    </>
  );
}
