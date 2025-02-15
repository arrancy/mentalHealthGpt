import { useNavigate } from "react-router-dom";

interface BottomHeadingProps {
  label: string;
  redirectPage: string;
}

export function BottomHeading({ label, redirectPage }: BottomHeadingProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="text-sky-400 text-opacity-60 font-semibold text-sm mt-2">
        click here to{" "}
        <a
          className="underline hover:text-sky-900  transition-all ease-in-out duration-200 cursor-pointer "
          onClick={() => {
            navigate("/" + redirectPage);
          }}
        >
          {label}
        </a>
      </div>
    </>
  );
}
