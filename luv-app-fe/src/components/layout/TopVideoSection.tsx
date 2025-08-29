import { Streamer } from "@/types/streamer";

interface TopVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  createdAt: string;
  category: string;
}

interface TopVideoSectionProps {
  streamer: Streamer;
}

// Mock data cho replay videos
const mockTopVideos: TopVideo[] = [
  {
    id: "1",
    title: "POV Show diễn của tuiiii",
    thumbnail: "https://afamilycdn.com/150157425591193600/2021/4/13/1307357352220016761096301848512984611015454n-16182927569192082691829-1618301178283-1618301179402313869259.jpg",
    duration: "4:52:29",
    views: 302985,
    createdAt: "2025-06-1",
    category: "Liveshow"
  },
  {
    id: "2", 
    title: "Dual cùng Winter",
    thumbnail: "https://kenh14cdn.com/203336854389633024/2021/12/31/winter-karina-16409228150081421240147.jpg",
    duration: "2:15:31",
    views: 298061,
    createdAt: "2025-03-04",
    category: "Liveshow"
  },
  {
    id: "3",
    title: "Đi quay với tui nhaaa!",
    thumbnail: "https://image.phunuonline.com.vn/fckeditor/upload/2024/20241207/images/karina-aespa-giu-dang-thon-gon-_751733540819.jpg", 
    duration: "56:34",
    views: 240198,
    createdAt: "2025-02-15",
    category: "POV"
  },
];

export default function TopVideoSection({ streamer }: TopVideoSectionProps) {
  return (
    <div className="replay-video-section">
      <div className="replay-section-header">
        <h2 className="replay-title">Video xem nhiều nhất của {streamer.displayName}</h2>
      </div>
      <div className="replay-video-grid">
        {mockTopVideos.map((video) => (
          <div key={video.id} className="replay-video-card">
            <div className="replay-thumbnail">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="thumbnail-image"
              />
              <div className="video-duration">{video.duration}</div>
              <div className="play-overlay">
                <div className="play-icon">▶</div>
              </div>
            </div>
            <div className="replay-video-info">
              <h3 className="video-title">{video.title}</h3>
              <div className="video-meta">
                <span className="video-category">{video.category}</span>
                <span className="video-views">👁 {video.views.toLocaleString()} lượt xem</span>
                <span className="video-date">{video.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
