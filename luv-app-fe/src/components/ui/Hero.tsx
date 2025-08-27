"use client";

export default function Hero() {
  return (
    <section className="hero-banner-section">
      <div className="hero-banner">
        {/* Content Container */}
        <div className="banner-content">
          {/* Large Livestream Player */}
          <div className="livestream-player">
            {/* Video Player Area */}
            <div className="video-player">
              <div className="video-overlay">
                <div className="play-button">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="video-message">
                  <p>Click to play</p>
                </div>
              </div>
              
              {/* Live Badge */}
              <div className="live-badge-overlay">
                <span className="live-dot"></span>
                LIVE
              </div>
              
              {/* Viewer Count */}
              <div className="viewer-count-overlay">
                👁️ 1,234
              </div>
            </div>
            
            {/* Stream Info Bar */}
            <div className="stream-info-bar">
              <div className="streamer-section">
                <div className="streamer-avatar">
                  <img 
                    src="https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/481080307_1692240728382080_3749027935326059149_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=20ezD5jCZg8Q7kNvwF55YKW&_nc_oc=AdliJ_cxzJvkB2wzwg6D_JmhHnYzLYBMLkJ3i7Wlt48pY1DXBy3NeV5bKKZxJTRwB3r9oinANpZlTh8FcXzzE9Xu&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=q0XMPCEd_dAn_uT4Mm0zcg&oh=00_AfU4zSCgiIpOg4nx758t1JGCfwgkmcwFdHIUz7gktigp_A&oe=68B245A0" 
                    alt="Nathan Nguyen" 
                  />
                </div>
                <div className="streamer-info">
                  <h3 className="text-white font-bold">Nathan Nguyen</h3>
                  <p className="stream-title">Ranked Solo/Duo - Leo rank Thách Đấu! | League of Legends</p>
                </div>
              </div>
              
              <div className="stream-actions">
                <button className="follow-btn">Theo dõi</button>
                <button className="watch-btn">Xem ngay</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
