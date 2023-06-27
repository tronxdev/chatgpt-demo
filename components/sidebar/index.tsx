"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { IChat } from "@/components/chat";

interface ISidebarProps extends React.PropsWithChildren {}

interface ISectionProps {
  date: string;
  chats: IChat[];
}

const options: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
};

function isToday(timestamp: number) {
  return (
    new Date().setHours(0, 0, 0, 0) === new Date(timestamp).setHours(0, 0, 0, 0)
  );
}

function Section({ date, chats }: ISectionProps) {
  return (
    <section className="w-[calc(100%-32px)] border-b border-b-zinc-700 py-4">
      <p className="text-xs text-zinc-500 mb-2">{date}</p>
      <div className="w-full flex flex-col space-y-2">
        {chats.map((chat) => (
          <NextLink
            key={chat.id}
            href={`/chats/${chat.id}`}
            className="w-full text-sm text-white font-medium overflow-ellipsis"
          >
            {chat.messages[0].content || ""}
          </NextLink>
        ))}
      </div>
    </section>
  );
}

export default function Sidebar() {
  const [history, setHistory] = useState<Record<string, IChat[]>>();

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem("chats") || "[]") as IChat[];

    const grouped = chats.reduce((group: Record<string, IChat[]>, chat) => {
      let date: string = "Today";

      if (!isToday(parseInt(chat.id) * 1000)) {
        date = new Date(parseInt(chat.id) * 1000).toLocaleDateString(
          "en-us",
          options
        );
      }

      group[date] = group[date] ?? [];
      group[date].push(chat);

      return group;
    }, {});

    setHistory(grouped);
  }, []);

  return (
    <aside className="h-full w-[300px] bg-zinc-900 flex flex-col items-center">
      {history ? (
        Object.keys(history).map((k) => {
          const data = history[k];
          return <Section key={k.split(" ").join("-")} date={k} chats={data} />;
        })
      ) : (
        <></>
      )}
    </aside>
  );
}
