"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface LiveshowCard {
  id: string;
  streamerName: string;
  userName: string;
  title: string;
  profileImage: string;
  viewers: number;
  category: string;
}

const liveshowData: LiveshowCard[] = [
  {
    id: "1",
    streamerName: "Nathan Nguyen",
    userName: "nathan-nguyen",
    title: "Coi tarrot",
    profileImage: "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/481080307_1692240728382080_3749027935326059149_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=20ezD5jCZg8Q7kNvwF55YKW&_nc_oc=AdliJ_cxzJvkB2wzwg6D_JmhHnYzLYBMLkJ3i7Wlt48pY1DXBy3NeV5bKKZxJTRwB3r9oinANpZlTh8FcXzzE9Xu&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=q0XMPCEd_dAn_uT4Mm0zcg&oh=00_AfU4zSCgiIpOg4nx758t1JGCfwgkmcwFdHIUz7gktigp_A&oe=68B245A0",
    viewers: 1247,
    category: "Live Idol"
  },
  {
    id: "2", 
    streamerName: "Linh Thỏ",
    userName: "linh-tho",
    title: "Mưa bùn quóo",
    profileImage: "https://i.pinimg.com/736x/c3/a2/cf/c3a2cfe35a483929dc954bcc915d75da.jpg",
    viewers: 892,
    category: "Live Idol"
  },
  {
    id: "3",
    streamerName: "StreamQueen",
    userName: "stream-queen",
    title: "Tâm sự tủi pink",
    profileImage: "https://i.pinimg.com/1200x/d1/c8/30/d1c830340acf294aa4258e6b75db19bc.jpg",
    viewers: 634,
    category: "New Idol"
  },
  {
    id: "4",
    streamerName: "Công chúa",
    userName: "cong-chua",
    title: "Cảnh báo động!!",
    profileImage: "https://i.pinimg.com/736x/36/f1/c5/36f1c5627aadbd4feb2d8156a6870db5.jpg",
    viewers: 445,
    category: "Live Idol"
  },
  {
    id: "5",
    streamerName: "NaNa",
    userName: "nana",
    title: "Em bé ne",
    profileImage: "https://i.pinimg.com/736x/4b/9e/56/4b9e56c2d2ac407d193a62b17e1630b4.jpg",
    viewers: 328,
    category: "Live Idol"
  },
  {
    id: "6",
    streamerName: "Sếp Linh",
    userName: "sep-linh",
    title: "ỦA EMMM!!",
    profileImage: "https://i.pinimg.com/736x/59/a1/c9/59a1c950009d81905fa63a9c5a64bc7c.jpg",
    viewers: 267,
    category: "Live Idol"
  },
  {
    id: "7",
    streamerName: "Lina Youne",
    userName: "lina-youne",
    title: "Có zô hong thì bảo",
    profileImage: "https://i.pinimg.com/736x/c1/aa/58/c1aa5877f62ec0e670d1c8bb83379639.jpg",
    viewers: 189,
    category: "Live Idol"
  },
  {
    id: "8",
    streamerName: "Minaa",
    userName: "minaa",
    title: "Chúa hề nèee",
    profileImage: "https://i.pinimg.com/736x/4e/22/ef/4e22efe654e8ae8ae1f65b7adc1bddfc.jpg",
    viewers: 156,
    category: "New Idol"
  },
  {
    id: "9",
    streamerName: "Bella Rose",
    userName: "bella-rose",
    title: "Chill cùng em",
    profileImage: "https://i.pinimg.com/736x/01/7f/20/017f20761184d6248b5ebcf421c349dc.jpg",
    viewers: 145,
    category: "Live Idol"
  },
  {
    id: "10",
    streamerName: "Candy Sweet",
    userName: "candy-sweet",
    title: "Karaoke night",
    profileImage: "https://i.pinimg.com/736x/5a/9f/19/5a9f19fe064921b0c549eb0b82a2b350.jpg",
    viewers: 134,
    category: "New Idol"
  }
];

function formatViewers(viewers: number): string {
  if (viewers >= 1000) {
    return (viewers / 1000).toFixed(1) + 'K';
  }
  return viewers.toString();
}

export default function LiveshowSection() {
  const router = useRouter();

  const handleLiveshowClick = (userName: string) => {
    router.push(`/live/${userName}`);
  };

  return (
    <section className="liveshow-section">
      <div className="liveshow-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Liveshow</h2>
          <p className="section-subtitle">Xem những liveshow hot nhất hiện tại</p>
          <Link href="/liveshow" className="view-more-btn">
            Xem thêm 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        </div>

        {/* Liveshow Cards Grid */}
        <div className="liveshow-grid">
          {liveshowData.slice(0, 10).map((liveshow) => (
            <div 
              key={liveshow.id} 
              className="liveshow-card"
              onClick={() => handleLiveshowClick(liveshow.userName)}
              style={{ cursor: 'pointer' }}
            >
              {/* Profile Image Section */}
              <div className="liveshow-image">
                <div 
                  className="profile-background"
                  style={{
                    backgroundImage: `url(${liveshow.profileImage})`
                  }}
                >
                  {/* Live Badge */}
                  <div className="live-badge-small">
                    <span className="live-dot-mini"></span>
                    LIVE
                  </div>
                  
                  {/* Viewer Count */}
                  <div className="viewer-badge">
                    👁️ {formatViewers(liveshow.viewers)}
                  </div>
                  
                  {/* Play Overlay */}
                  <div className="play-overlay">
                    <div className="play-btn-small">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streamer Info Section */}
              <div className="liveshow-info">
                <div className="streamer-details">
                  <h3 className="streamer-name">{liveshow.streamerName}</h3>
                  <p className="liveshow-title">{liveshow.title}</p>
                  <span className="liveshow-category">{liveshow.category}</span>
                </div>
                
                <div className="liveshow-actions">
                  <button className="follow-btn-small">Theo dõi</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
