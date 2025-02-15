import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isLogoutModalActiveAtom } from "../store/atoms/isLogoutModalActiveAtom";

export function LogoutButton() {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const setIsLogoutModalActive = useSetRecoilState(isLogoutModalActiveAtom);
  //   const navigate = useNavigate();
  return (
    <>
      <button
        className={
          "h-10 pb-2 fixed px-2 top-4 z-50 right-4 flex items-center bg-sky-300 border-2 border-sky-900  rounded-lg transition-all ease-in-out duration-200 "
        }
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onClick={async () => {
          setIsLogoutModalActive(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 relative top-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>

        <span
          className={
            "font-semibold relative top-1  overflow-hidden transition-all ease-in-out duration-200 " +
            (isHovering ? "max-w-16" : "max-w-0")
          }
        >
          logout
        </span>
      </button>
    </>
  );
}
