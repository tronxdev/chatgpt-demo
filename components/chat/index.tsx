"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { generateConversation } from "./action";
import Share from "@/assets/svg/share-default.svg";
import Loading from "@/components/loading";
import Message from "@/components/message";
import NoMessage from "@/components/no-message";

interface IChatProps {
  chatId?: string;
}

export interface IChat {
  id: string; // timestamp
  messages: ChatCompletionRequestMessage[];
}

function saveMessage(currChat: IChat, prevId?: string) {
  const chats = JSON.parse(localStorage.getItem("chats") || "[]");

  if (chats) {
    localStorage.setItem(
      "chats",
      JSON.stringify(
        [...(chats as IChat[]).filter((c) => c.id !== prevId), currChat].sort(
          (a, b) => parseInt(a.id) - parseInt(b.id)
        )
      )
    );
  }
}

export default function Chat({ chatId }: IChatProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chat, setChat] = useState<IChat>();
  const [loading, setLoading] = useState(false);

  const scrollToBottom = useCallback(() => {
    const lastChildElement = messagesRef.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const callGPTApi = useCallback(async () => {
    let timestamp: number;
    let currChat: IChat;
    const content = inputRef.current!.value;
    if (content) {
      try {
        setLoading(true);

        const message = {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content,
        };

        currChat = {
          id: chat?.id || "",
          messages: chat ? [...chat.messages, message] : [message],
        };

        setChat(currChat);

        // reset the message input
        inputRef.current!.value = "";

        scrollToBottom();

        const reply = await generateConversation(
          chat ? [...chat.messages, message] : [message]
        );
        if (reply.message) {
          timestamp = reply.created;
          currChat = {
            id: timestamp.toString(10),
            messages: chat
              ? [...chat.messages, message, reply.message]
              : [message, reply.message],
          };
          // store the chat update in local storate
          saveMessage(currChat, chat?.id);
          setChat(currChat);
        }
      } catch (e) {
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    }
  }, [chat, scrollToBottom]);

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        await callGPTApi();
      }
    },
    [callGPTApi]
  );

  const handleMessageSend = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      await callGPTApi();
    },
    [callGPTApi]
  );

  useEffect(() => {
    if (chatId) {
      const chats = JSON.parse(localStorage.getItem("chats") || "[]");
      if (chats) {
        setChat((chats as IChat[]).find((c) => c.id === chatId));
      }
    }
  }, [chatId]);

  return (
    <div className="h-full w-full relative">
      <div
        ref={messagesRef}
        className="h-[calc(100vh-112px)] pt-10 overflow-y-auto"
      >
        {chat
          ? chat.messages.map((message, idx) => (
              <Message key={idx} message={message} />
            ))
          : !loading && <NoMessage />}
        {loading && <Loading />}
      </div>
      <div className="h-28 w-full flex items-center justify-center absolute bottom-0 bg-white z-50">
        <div className="h-12 w-[720px] rounded bg-zinc-900 flex flex-row items-center pl-4 pr-2 space-x-2 drop-shadow-md">
          <input
            ref={inputRef}
            type="text"
            className="text-sm outline-none bg-transparent text-zinc-300 flex-1"
            placeholder="Send a message..."
            disabled={loading}
            onKeyDown={handleKeyDown}
          />
          <button disabled={loading} onClick={handleMessageSend}>
            <Share />
          </button>
        </div>
      </div>
    </div>
  );
}
