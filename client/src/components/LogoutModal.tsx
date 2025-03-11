import { useSetRecoilState } from "recoil";
import { isLogoutModalActiveAtom } from "../store/atoms/isLogoutModalActiveAtom";
import { useNavigate } from "react-router-dom";

export function LogoutModal() {
  const setIsLogoutModalActive = useSetRecoilState(isLogoutModalActiveAtom);
  const navigate = useNavigate();
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={() => {
          setIsLogoutModalActive(false);
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div
          className=" border-2 border-sky-900 bg-sky-200 brightness-100 z-50 shadow-gray-800 shadow-2xl bottom-[20%] mx-auto relative  max-w-fit pt-2 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="font-medium text-2xl text-opacity-70 text-slate-500  px-6">
            are you sure you want to log out ?
          </div>
          <div className="flex justify-center gap-2">
            <div className="p-4">
              <button
                onClick={async () => {
                  const response = await fetch(
                    "https://api.helpmymind.tech/user/logout",
                    {
                      credentials: "include",
                      method: "POST",
                    }
                  );
                  if (response.ok) {
                    await response.json();
                    navigate("/");
                  }

                  localStorage.removeItem("jwt");
                  navigate("/");
                }}
                className="border-2  px-5 border-sky-900 bg-sky-200 text-sky-900 rounded-lg text-xl font-medium  hover:bg-sky-900 hover:text-sky-200 transition-all ease-in-out duration-300 pb-1
            "
              >
                yes
              </button>
            </div>
            <div className="p-4">
              <button
                onClick={() => {
                  setIsLogoutModalActive(false);
                }}
                className="border-2 px-5 border-sky-200 bg-sky-900 rounded-lg font-medium text-sky-200 text-xl hover:bg-sky-200 hover:text-sky-900 hover:border-sky-900 transition-all ease-in-out duration-300 pb-1"
              >
                no
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
