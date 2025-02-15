import React from "react";
import { isSidebarOpenAtom } from "../store/atoms/isSidebarOpenAtom";
import { useSetRecoilState } from "recoil";

export const SidebarToggleButton: React.FC = () => {
  const setIsSidebarOpen = useSetRecoilState(isSidebarOpenAtom);
  return (
    <button
      data-drawer-target="default-sidebar"
      data-drawer-toggle="default-sidebar"
      aria-controls="default-sidebar"
      type="button"
      onClick={() => {
        setIsSidebarOpen((prevState) => !prevState);
      }}
      className=" fixed top-0  left-2 z-50  bg-sky-100 p-2 mt-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-900  "
    >
      <svg
        className="w-6 h-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
  );
};
