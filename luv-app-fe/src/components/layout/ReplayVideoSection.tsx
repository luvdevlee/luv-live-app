import { Streamer } from "@/types/streamer";

interface ReplayVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  createdAt: string;
  category: string;
}

interface ReplayVideoSectionProps {
  streamer: Streamer;
}

// Mock data cho replay videos
const mockReplayVideos: ReplayVideo[] = [
  {
    id: "1",
    title: "Tâm sự cuối tuần - Tập 1",
    thumbnail: "https://cdn.k-ennews.com/news/photo/202504/8139_21668_3236.jpg",
    duration: "2:34:15",
    views: 15420,
    createdAt: "2024-01-10",
    category: "Liveshow"
  },
  {
    id: "2", 
    title: "Chơi game cùng chat - Minecraft",
    thumbnail: "https://newsimg.koreatimes.co.kr/2025/05/28/ec2d7aa5-9ed6-425d-92c3-47d029e4d4c1.jpg?v=1749100924000&w=1200",
    duration: "1:45:30",
    views: 8920,
    createdAt: "2024-01-08",
    category: "Gaming"
  },
  {
    id: "3",
    title: "Review sản phẩm mới nhất",
    thumbnail: "https://rare-gallery.com/uploads/posts/340448-Karina-Yoo-Ji-Min-Aespa-Kpop-K-pop-Girl-Group-Girls.jpg", 
    duration: "45:20",
    views: 12340,
    createdAt: "2024-01-05",
    category: "Review"
  },
  {
    id: "4",
    title: "Q&A với fan - Phần 2",
    thumbnail: "https://wimg.mk.co.kr/news/cms/202503/08/news-p.v1.20250308.af2bdd45409d40c689225f800dac5825_P1.jpg",
    duration: "1:20:45",
    views: 6780,
    createdAt: "2024-01-03",
    category: "Q&A"
  },
  {
    id: "5",
    title: "Reaction MV mới neee",
    thumbnail: "https://image.phunuonline.com.vn/fckeditor/upload/2024/20241207/images/karina-aespa-giu-dang-thon-gon-_731733540932.jpg",
    duration: "40:54",
    views: 121091,
    createdAt: "2024-08-11",
    category: "Reaction"
  },
  {
    id: "6",
    title: "Q&A với fan - Phần 3",
    thumbnail: "https://kenh14cdn.com/203336854389633024/2024/4/13/snapinstaapp4362831414120586748590165745310450511145379n1080-17129742274301935807373.jpg",
    duration: "1:37:15",
    views: 8012,
    createdAt: "2024-01-19",
    category: "Q&A"
  },
  {
    id: "7",
    title: "Dạo Seoul",
    thumbnail: "https://www.allkpop.com/upload/2021/09/content/051340/1630863636-7a0a0f49-4521-4c85-9023-4ade04f377f5.jpeg",
    duration: "1:15:35",
    views: 7281,
    createdAt: "2024-04-19",
    category: "Live"
  },
  {
    id: "8",
    title: "Mukbang kkkk",
    thumbnail: "https://i.pinimg.com/736x/06/d5/dd/06d5dd5d27b0a8e576c74e86b0cbf477.jpg",
    duration: "30:12",
    views: 4091,
    createdAt: "2024-01-29",
    category: "Mukbang"
  },
];

export default function ReplayVideoSection({ streamer }: ReplayVideoSectionProps) {
  return (
    <div className="replay-video-section">
      <div className="replay-section-header">
        <h2 className="replay-title">Video phát lại của {streamer.displayName}</h2>
        <button className="view-all-button">Xem tất cả</button>
      </div>
      <div className="replay-video-grid">
        {mockReplayVideos.map((video) => (
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
