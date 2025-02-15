import { motion } from "motion/react";
import Markdown from "react-markdown";
import logoImage from "../images/mentalHealthGpt logo-photoaidcom-cropped.png";
import { memo } from "react";
interface MessageProps {
  content: string;
  role: string;
  pending: boolean;
}

export const Message = memo(({ content, role, pending }: MessageProps) => {
  return (
    <>
      <motion.div
        initial={{ y: -20, filter: "blur(2px)" }}
        whileInView={{ y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={
          "sm:p-6 sm:pr-12 p-3 sm:text-lg text-sm my-2 sm:max-w-[70%] max-w-[90%] rounded-3xl " +
          (role === "user"
            ? "rounded-tr-md  bg-sky-100"
            : "rounded-tl-md flex gap-4 text-sky-900")
        }
      >
        {role === "user" ? (
          <div>
            <Markdown>{content}</Markdown>
          </div>
        ) : pending ? (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <>
            <img className="w-8 h-8" src={logoImage}></img>

            <div>
              <Markdown>{content}</Markdown>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
});
