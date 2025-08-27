"use client";


interface LiveshowCard {
  id: string;
  streamerName: string;
  title: string;
  profileImage: string;
  viewers: number;
  category: string;
}

const liveshowData: LiveshowCard[] = [
  {
    id: "1",
    streamerName: "Nathan Nguyen",
    title: "ABCDSSSS",
    profileImage: "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/481080307_1692240728382080_3749027935326059149_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=20ezD5jCZg8Q7kNvwF55YKW&_nc_oc=AdliJ_cxzJvkB2wzwg6D_JmhHnYzLYBMLkJ3i7Wlt48pY1DXBy3NeV5bKKZxJTRwB3r9oinANpZlTh8FcXzzE9Xu&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=q0XMPCEd_dAn_uT4Mm0zcg&oh=00_AfU4zSCgiIpOg4nx758t1JGCfwgkmcwFdHIUz7gktigp_A&oe=68B245A0",
    viewers: 1247,
    category: "Live Idol"
  },
  {
    id: "2", 
    streamerName: "Linh Thỏ",
    title: "Mưa bùn quóo",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkwMYthqutaftuxz8RK9vaEJyrSPvvNDJvwA&s",
    viewers: 892,
    category: "Live Idol"
  },
  {
    id: "3",
    streamerName: "StreamQueen",
    title: "Tâm sự tủi pink",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe7WFuqadM31NIdbwsGUPsWgRc8gbmzHo-IQ&s",
    viewers: 634,
    category: "New Idol"
  },
  {
    id: "4",
    streamerName: "Công chúa",
    title: "Cảnh báo động!!",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyI20h0NZPVnW0-9rdzBhDfMjDlohvZFDP4Q&s",
    viewers: 445,
    category: "Live Idol"
  },
  {
    id: "5",
    streamerName: "NaNa",
    title: "Em bé ne",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPEMaTW7A559ftA5lkv9j-iFoee6f5-SsClw&s",
    viewers: 328,
    category: "Live Idol"
  },
  {
    id: "6",
    streamerName: "Sếp Linh",
    title: "ỦA EMMM!!",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6AaDGvGUd_jz2-hV32OLGJNmPAJ6HNejzqw&s",
    viewers: 267,
    category: "Live Idol"
  },
  {
    id: "7",
    streamerName: "Lina Youne",
    title: "Có zô hong thì bảo",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU4mgtZXEqveFGpBVDal_zA71hV8oMjZdtHw&s",
    viewers: 189,
    category: "Live Idol"
  },
  {
    id: "8",
    streamerName: "Minaa",
    title: "Chúa hề nèee",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7h9BQ-ir6YffxX7onxNsMi47Krd6y-Xae7A&s",
    viewers: 156,
    category: "New Idol"
  },
  {
    id: "9",
    streamerName: "Luming",
    title: "Test",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7h9BQ-ir6YffxX7onxNsMi47Krd6y-Xae7A&s",
    viewers: 81,
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
  return (
    <section className="liveshow-section">
      <div className="liveshow-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Tất cả livestream của các streamer</h2>
        </div>

        {/* Liveshow Cards Grid */}
        <div className="liveshow-grid">
          {liveshowData.map((liveshow) => (
            <div key={liveshow.id} className="liveshow-card">
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
                  <button className="watch-btn-small">Xem ngay</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
