"use client"

import { useState, use } from 'react';
import "./profile.css";
import ReplayVideoSection from "@/components/layout/ReplayVideoSection";
import TopVideoSection from "@/components/layout/TopVideoSection";
import "@/app/live/[userName]/livestream.css"

interface ProfilePageProps {
  params: Promise<{
    userName: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userName } = use(params);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data - sau này sẽ lấy từ API
  const userData = {
    userId: "11082003",
    userName: userName,
    userDisplayName: "Karinaaa ☆",
    followers: 1250,
    following: 856,
    banner: "https://preview.redd.it/aespa-smtown-2025-photoshoot-desktop-background-set-karina-v0-h15mlv7sw6ie1.jpeg?auto=webp&s=436568728765da978361aa96129438441b1b311e", // URL banner
    avatar: "https://pbs.twimg.com/media/FN9lzQwaMAQbnTV?format=jpg&name=large",
  };

  // Mock streamer data cho ReplayVideoSection
  const streamerData = {
    id: "1",
    userName: userName,
    displayName: userData.userDisplayName,
    avatar: userData.avatar,
    streamTitle: "Live stream hiện tại",
    category: "Liveshow",
    followers: userData.followers,
    isLive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div
        className="profile-banner"
        style={{
          backgroundImage: `url('${userData.banner}')`
        }}
      >
        <div className="profile-banner-content">
          {/* User Avatar */}
          <div className="user-avatar-container">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.userName}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar">
                {userData.userName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Follow Button */}
            <button
              className={`follow-button ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowClick}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </div>

      {/* User Info Container */}
      <div className="user-info-container">
        <div className="user-id">
          LUV ID: {userData.userId}
        </div>
        <h1 className="user-display-name">
          {userData.userDisplayName}
        </h1>

        {/* User Stats */}
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-label">Followers</span>
            <span className="stat-number">{userData.followers.toLocaleString()}</span>

          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <span className="stat-label">Following</span>
            <span className="stat-number">{userData.following.toLocaleString()}</span>

          </div>
        </div>
      </div>

      {/* Replay Video Section */}
      <div className="replay-video-container">
        <ReplayVideoSection streamer={streamerData} />
      </div>

      <div className="replay-video-container">
        <TopVideoSection streamer={streamerData} />
      </div>


    </div>
  );
}
