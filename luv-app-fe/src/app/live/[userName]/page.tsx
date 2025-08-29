import { notFound } from "next/navigation";
import "./livestream.css";
import { Streamer } from "@/types/streamer";
import LuvRoomTheaterSection from "@/components/layout/LuvRoomTheaterSection";
import ReplayVideoSection from "@/components/layout/ReplayVideoSection";
import LiveChat from "@/components/layout/LiveChat";

interface LiveStreamPageProps {
  params: Promise<{
    userName: string;
  }>;
}

// Test data based on Streamer interface
const mockStreamerData: Streamer = {
  id: "1",
  userName: "karinaaa",
  displayName: "Karinaaa ☆",
  avatar: "https://pbs.twimg.com/media/FN9lzQwaMAQbnTV?format=jpg&name=large",
  bio: "Professional streamer and content creator",
  followers: 5678,
  isLive: true,
  streamTitle: "Tâm sự cuối tuần (≧ ▽ ≦) o",
  streamThumbnail: "",
  category: "Liveshow",
  tags: ["gaming", "entertainment", "live"],
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2024-01-15")
};

export default async function LiveStreamPage({ params }: LiveStreamPageProps) {
  const { userName } = await params;

  // TODO: Fetch streamer data based on userName
  // For now, we'll use mock data
  if (!userName) {
    notFound();
  }

  // Simulate fetching streamer data
  const streamer = mockStreamerData;

  return (
    <div className="livestream-container">
      <div className="luv-room_main_container">
        <div className="stream-content">
          <LuvRoomTheaterSection streamer={streamer} />
          <ReplayVideoSection streamer={streamer} />
        </div>
      </div>

      <div className="luv-room_main_sider">
        <div className="sidebar-content">
          <h2 className="sidebar-title">Live Chat</h2>
          <LiveChat />
        </div>
      </div>
    </div>
  );
}
