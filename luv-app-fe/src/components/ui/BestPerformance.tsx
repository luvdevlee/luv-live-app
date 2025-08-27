"use client";

interface StreamerRanking {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  views?: number;
  donations?: number;
  change: 'up' | 'down' | 'same';
}

const topViewsData: StreamerRanking[] = [
  {
    id: "1",
    rank: 1,
    name: "Nathan Nguyen",
    avatar: "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/481080307_1692240728382080_3749027935326059149_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=20ezD5jCZg8Q7kNvwF55YKW&_nc_oc=AdliJ_cxzJvkB2wzwg6D_JmhHnYzLYBMLkJ3i7Wlt48pY1DXBy3NeV5bKKZxJTRwB3r9oinANpZlTh8FcXzzE9Xu&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=q0XMPCEd_dAn_uT4Mm0zcg&oh=00_AfU4zSCgiIpOg4nx758t1JGCfwgkmcwFdHIUz7gktigp_A&oe=68B245A0",
    views: 130267,
    change: 'up'
  },
  {
    id: "2", 
    rank: 2,
    name: "LNguyen Gaming",
    avatar: "https://picsum.photos/200/300?random=1",
    views: 126897,
    change: 'same'
  },
  {
    id: "3",
    rank: 3,
    name: "Thanh Raiik",
    avatar: "https://picsum.photos/200/300?random=2",
    views: 122694,
    change: 'up'
  },
  {
    id: "4",
    rank: 4,
    name: "SenKuns",
    avatar: "https://picsum.photos/200/300?random=3",
    views: 118936,
    change: 'down'
  },
  {
    id: "5",
    rank: 5,
    name: "Chubs",
    avatar: "https://picsum.photos/200/300?random=10",
    views: 112850,
    change: 'up'
  }
];

const topDonationsData: StreamerRanking[] = [
  {
    id: "1",
    rank: 1,
    name: "WynT",
    avatar: "https://picsum.photos/200/300?random=5",
    donations: 81945,
    change: 'up'
  },
  {
    id: "2",
    rank: 2,
    name: "Norah Gaming",
    avatar: "https://picsum.photos/200/300?random=6", 
    donations: 69438,
    change: 'same'
  },
  {
    id: "3",
    rank: 3,
    name: "BaoChiw Xinh Đẹp",
    avatar: "https://picsum.photos/200/300?random=7",
    donations: 65276,
    change: 'up'
  },
  {
    id: "4", 
    rank: 4,
    name: "Em bé thỏ ",
    avatar: "https://picsum.photos/200/300?random=11",
    donations: 52146,
    change: 'down'
  },
  {
    id: "5",
    rank: 5,
    name: "Đị Mi Xô",
    avatar: "https://picsum.photos/200/300?random=9",
    donations: 48215,
    change: 'same'
  }
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return rank.toString();
  }
}

function getChangeIcon(change: 'up' | 'down' | 'same') {
  switch (change) {
    case 'up':
      return "📈";
    case 'down':
      return "📉";
    case 'same':
      return "➖";
  }
}

export default function BestPerformance() {
  return (
    <section className="best-performance-section">
      <div className="best-performance-container">
        {/* Section Title */}
        <div className="section-header">
          <h2 className="section-title">Best Performance</h2>
          <p className="section-subtitle">Bảng xếp hạng những streamer xuất sắc nhất</p>
        </div>

        {/* Leaderboards Grid */}
        <div className="leaderboards-grid">
          {/* Top Views Leaderboard */}
          <div className="leaderboard-card">
            <div className="leaderboard-header">
              <h3 className="leaderboard-title">
                <span className="title-icon">👁️</span>
                Top Viewers
              </h3>
              <p className="leaderboard-subtitle">Streamers có lượt xem cao nhất</p>
            </div>
            
            <div className="leaderboard-list">
              {topViewsData.map((streamer) => (
                <div key={streamer.id} className="leaderboard-item">
                  <div className="rank-section">
                    <span className="rank-number">{getRankIcon(streamer.rank)}</span>
                  </div>
                  
                  <div className="streamer-section">
                    <div className="streamer-avatar">
                      <img src={streamer.avatar} alt={streamer.name} />
                    </div>
                    <div className="streamer-details">
                      <span className="streamer-name">{streamer.name}</span>
                    </div>
                  </div>
                  
                  <div className="stats-section">
                    <span className="stat-value">{formatNumber(streamer.views!)}</span>
                    <span className="stat-label">views</span>
                  </div>
                  
                  <div className="change-section">
                    <span className="change-icon">{getChangeIcon(streamer.change)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Donations Leaderboard */}
          <div className="leaderboard-card">
            <div className="leaderboard-header">
              <h3 className="leaderboard-title">
                <span className="title-icon">💰</span>
                Top Donations
              </h3>
              <p className="leaderboard-subtitle">Streamers được donate nhiều nhất</p>
            </div>
            
            <div className="leaderboard-list">
              {topDonationsData.map((streamer) => (
                <div key={streamer.id} className="leaderboard-item">
                  <div className="rank-section">
                    <span className="rank-number">{getRankIcon(streamer.rank)}</span>
                  </div>
                  
                  <div className="streamer-section">
                    <div className="streamer-avatar">
                      <img src={streamer.avatar} alt={streamer.name} />
                    </div>
                    <div className="streamer-details">
                      <span className="streamer-name">{streamer.name}</span>
                    </div>
                  </div>
                  
                  <div className="stats-section">
                    <span className="stat-value">${formatNumber(streamer.donations!)}</span>
                    <span className="stat-label">donated</span>
                  </div>
                  
                  <div className="change-section">
                    <span className="change-icon">{getChangeIcon(streamer.change)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
