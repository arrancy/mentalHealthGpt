import { WrapperProps } from "./FullHeading";

export function CenteringWrapper({ children }: WrapperProps) {
  return <div className="flex justify-center">{children}</div>;
}
