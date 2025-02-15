import { ReactNode } from "react";

export interface WrapperProps {
  children: ReactNode;
}

export function FullHeading({ children }: WrapperProps) {
  return (
    <>
      <div className="text-center p-2">{children}</div>
    </>
  );
}
