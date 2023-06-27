import Chat from "@/components/chat";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <Chat chatId={id} />;
}
