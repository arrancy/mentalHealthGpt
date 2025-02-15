export interface HeadingProps {
  label: string;
}

export function BigHeading({ label }: HeadingProps) {
  return (
    <>
      <div className="text-4xl text-sky-900 font-semibold">{label}</div>
    </>
  );
}
