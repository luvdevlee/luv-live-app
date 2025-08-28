"use client";

import BannerSidebar from "./BannerSidebar";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero-banner-section">
      <div className="hero-banner">
        {/* Content Container */}
        <div className="banner-content">
          {/* Left Side - Large Livestream Player */}
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
                  <Image 
                    src="https://static1.dienanh.net/upload/202203/723d998d-893b-4c79-a912-b43f5b01930a.jpg" 
                    alt="Miu Moon "
                    width={100}
                    height={100}
                    unoptimized
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
