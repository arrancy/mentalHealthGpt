import { motion } from "motion/react"; // Corrected import
import mentalHealthImage from "../images/mental-health-concept-vector.jpg";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen w-screen"
      style={{
        backgroundColor: "#E1FFFF",
      }}
    >
      <div className="text-center text-5xl sm:text-8xl font-semibold text-sky-900 font-lato pt-4 sm:py-8">
        Mental Health GPT
      </div>
      <div className="sm:flex justify-between items-center sm:w-full px-8">
        <motion.img
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          src={mentalHealthImage}
          className=" opacity-35 sm:opacity-100 sm:max-w-xl" // Adjusted width
        />
        <motion.div
          initial={{ y: -20, filter: "blur(3px)" }}
          whileInView={{ y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-3xl  sm:text-6xl font-extrabold font-lato text-sky-900 sm:w-2/5 text-center sm:text-left sm:pr-6"
        >
          <p className="sm:px-0 px-1">
            we help you take the first steps towards mental wellness.
          </p>
          <button
            onClick={() => {
              navigate("/signin");
            }}
            className="flex relative top-6  border rounded-xl pt-2 pb-3 px-5 mx-auto sm:mx-0 text-xl sm:text-2xl bg-sky-900 text-sky-50 hover:bg-opacity-75 transition-all ease-in-out duration-200"
          >
            <p>get started</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 relative top-1 sm:top-1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
