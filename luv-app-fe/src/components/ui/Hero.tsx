"use client";

import BannerSidebar from "./BannerSidebar";

export default function Hero() {
  return (
    <section className="hero-banner-section">
      <div className="hero-banner">
        {/* Content Container */}
        <div className="banner-content">
          {/* Left Side - Large Livestream Player */}
          <div className="livestream-player">
            {/* Ads Player */}
            <div className="ads-player">
              <a 
                href="https://qc.rikvip.win/?a=9278bbe646650a8324e009b01ca4f150&utm_source=animevietsubapp&utm_medium=topbanner2&utm_campaign=cpd&utm_term=phim" 
                target="_blank" rel="noopener noreferrer" className="ads-link"
              >
                <img 
                  src="https://lh3.googleusercontent.com/7u-W_Hd5FW82Ag7fAHs-iTRH9ZWAB-YES1QEKQ2GUhG9Q4cljk8XZRTsljNn0-jeM9jFbKmyUiaCg-voFdJaMTeQEAc8TMx0Xj9O-NZBXPChvROulAPLc1XS6_pp=s0" 
                  alt="Advertisement Banner"
                  className="ads-banner"
                />
              </a>
            </div>
            
            {/* Video Player Area */}
            <div className="video-player">
              <div className="video-overlay-home">
                <div className="play-button-home">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="video-message">
                  <p>Click to play</p>
                </div>
              </div>
            </div>
            
            {/* Stream Info Bar */}
            <div className="stream-info-bar">
              <div className="streamer-section">
                <div className="streamer-avatar">
                  <img 
                    src="https://static1.dienanh.net/upload/202203/723d998d-893b-4c79-a912-b43f5b01930a.jpg" 
                    alt="Miu Moon " 
                  />
                </div>
                <div className="streamer-info">
                  <h3 className="text-white font-bold">Miu Moon</h3>
                  <p className="stream-title">PK With Me | LIVE IDOL</p>
                </div>
              </div>
              
              <div className="stream-actions">
                <button className="follow-btn">Theo dõi</button>
                <button className="watch-btn">Xem ngay</button>
              </div>
            </div>
          </div>

          {/* Right Side - Banner Sidebar */}
          <BannerSidebar />
        </div>
      </div>
    </section>
  );
}
