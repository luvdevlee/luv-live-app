import { notFound } from "next/navigation";

interface LiveStreamPageProps {
  params: {
    userName: string;
  };
}

export default function LiveStreamPage({ params }: LiveStreamPageProps) {
  const { userName } = params;

  // TODO: Fetch streamer data based on userName
  // For now, we'll show a placeholder
  if (!userName) {
    notFound();
  }

  return (
    <div>Live Stream Page của {userName}</div>
  );
}
