import { ChatCompletionRequestMessage } from "openai";
import { twMerge } from "tailwind-merge";
import OpenAI from "@/assets/svg/openai.svg";
import User from "@/assets/svg/user.svg";
import ThumbDown from "@/assets/svg/thumb-down.svg";
import ThumbUp from "@/assets/svg/thumb-up.svg";

interface IMessageProps {
  message: ChatCompletionRequestMessage;
}

export default function Message({ message }: IMessageProps) {
  const bgColor = message.role === "assistant" ? "bg-zinc-100" : "white";

  return (
    <div
      className={twMerge(
        "w-full py-6 flex items-center justify-center border-b border-b-zinc-200",
        bgColor
      )}
    >
      <div className="w-[720px] flex flex-row space-x-5">
        <div className="w-8 flex flex-col items-center">
          {message.role === "assistant" && <OpenAI />}
          {message.role === "user" && <User />}
        </div>
        <div className="flex-1">{message.content}</div>
        <div className="w-[120px] flex flex-row items-start justify-end space-x-3">
          <button>
            <ThumbUp />
          </button>
          <button>
            <ThumbDown />
          </button>
        </div>
      </div>
    </div>
  );
}
