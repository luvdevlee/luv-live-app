"use client"

import { Streamer } from "@/types/streamer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/live/[userName]/livestream.css";

interface LuvRoomTheaterSectionProps {
  streamer: Streamer;
}

export default function LuvRoomTheaterSection({ streamer }: LuvRoomTheaterSectionProps) {
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsOverlayActive(true);
  };

  const handleMouseLeave = () => {
    setIsOverlayActive(false);
  };

  const handleProfileClick = () => {
    router.push(`/profile/${streamer.userName || 'karina'}`);
  };

  return (
    <div className="luv-room_theater-section">
      <div className="user-main-header">
        <div className="user-profile-section">
          <div
            className="user-avatar-live"
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={streamer.avatar}
              alt={`${streamer.displayName} avatar`}
              width={48}
              height={48}
              className="avatar-image"
            />
            <div className="live-indicator"></div>
          </div>
          <h1
            className="user-display-name"
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          >
            {streamer.displayName}
          </h1>
          <button className="follow-button-live">
            + Theo dõi
          </button>
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
      <div
        className="video-player-placeholder"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Test Image */}
        <img
          src="https://i.pinimg.com/736x/4c/b4/17/4cb417663ea98ddd229e0b6481ac1487.jpg"
          alt="Test video thumbnail"
          className="livestream-video"
        />

        {/* Video Overlay */}
        {isOverlayActive && (
          <div className="video-overlay">
            <div className="overlay-info">
              <div className="overlay-title">{streamer.streamTitle}</div>
              <div className="overlay-streamer">{streamer.displayName}</div>
            </div>

            <div className="live-indicator-overlay">
              <div className="live-dot"></div>
              <span className="live-text">LIVE</span>
            </div>

            <div className="overlay-controls">

              <button className="overlay-button play-pause">
                <span className="control-icon">⏸️</span>
              </button>
              <button className="overlay-button volume">
                <span className="control-icon">🔊</span>
              </button>
              <button className="overlay-button fullscreen">
                <span className="control-icon">⛶</span>
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
