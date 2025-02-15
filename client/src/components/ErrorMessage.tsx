export interface ErrorMessageProps {
  label: string;
}

export function ErrorMessage({ label }: ErrorMessageProps) {
  return <p className="text-red-700">{label}</p>;
}
