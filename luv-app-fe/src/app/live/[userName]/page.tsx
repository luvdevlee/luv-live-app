import { notFound } from "next/navigation";
import "./livestream.css";
import { Streamer } from "@/types/streamer";
import Image from "next/image";

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
          <div className="stream-header">
            <div className="user-profile-section">
              <div className="user-avatar">
                <img
                  src={streamer.avatar}
                  alt={`${streamer.displayName} avatar`}
                  width={48}
                  height={48}
                  className="avatar-image"
                />
                <div className="live-indicator"></div>
              </div>
              <h1 className="user-display-name">
                {streamer.displayName}
              </h1>
            </div>
            <div className="stream-info">
              <div className="stream-info-item">
                <span className="stream-title-main">{streamer.streamTitle}</span>
              </div>
              <div className="stream-info-item">
                <span className="stream-category">{streamer.category}</span>
              </div>
              <div className="stream-info-item">
                <span className="viewer-count">👥 1,234 viewers</span>
              </div>
              <div className="stream-info-item">
                <span className="streamer-followers">❤️ {streamer.followers.toLocaleString()} followers</span>
              </div>
            </div>
          </div>
          <div className="video-player-placeholder">
            <p className="text-muted-foreground">
              Video player sẽ được hiển thị ở đây...
            </p>
          </div>
        </div>
      </div>
      
      <div className="luv-room_main_sider">
        <div className="sidebar-content">
          <h2 className="sidebar-title">Live Chat</h2>
          <div className="chat-container">
            <p className="text-muted-foreground">
              Chat box sẽ được hiển thị ở đây...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
