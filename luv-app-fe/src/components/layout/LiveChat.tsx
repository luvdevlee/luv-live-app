"use client";

import { useEffect, useRef, useState } from "react";

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  time: string;
  timestamp: number; // For sorting
}

export default function LiveChat() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Mock comments data
  const [comments] = useState<Comment[]>([
    {
      id: "1",
      username: "user123",
      avatar: "https://picsum.photos/32/32?random=1",
      text: "Chào mừng Karinaaa! 🎉",
      time: "2 phút trước",
      timestamp: Date.now() - 2 * 60 * 1000
    },
    {
      id: "2",
      username: "fan_kpop",
      avatar: "https://picsum.photos/32/32?random=2",
      text: "Stream hôm nay thật tuyệt! ❤️",
      time: "1 phút trước",
      timestamp: Date.now() - 1 * 60 * 1000
    },
    {
      id: "3",
      username: "luv_streamer",
      avatar: "https://picsum.photos/32/32?random=3",
      text: "Karinaaa fighting! 💪",
      time: "30 giây trước",
      timestamp: Date.now() - 30 * 1000
    },
    {
      id: "4",
      username: "kpop_lover",
      avatar: "https://picsum.photos/32/32?random=4",
      text: "Karinaaa đẹp quá! 😍",
      time: "1 phút trước",
      timestamp: Date.now() - 1 * 60 * 1000
    },
    {
      id: "5",
      username: "stream_fan",
      avatar: "https://picsum.photos/32/32?random=5",
      text: "Hôm nay có gì mới không chị? 🤔",
      time: "2 phút trước",
      timestamp: Date.now() - 2 * 60 * 1000
    },
    {
      id: "6",
      username: "aespa_fan",
      avatar: "https://picsum.photos/32/32?random=6",
      text: "Chị hát bài gì đi! 🎤",
      time: "3 phút trước",
      timestamp: Date.now() - 3 * 60 * 1000
    },
    {
      id: "7",
      username: "music_lover",
      avatar: "https://picsum.photos/32/32?random=7",
      text: "Giọng hát của chị thật tuyệt! 🎵",
      time: "4 phút trước",
      timestamp: Date.now() - 4 * 60 * 1000
    },
    {
      id: "8",
      username: "vietnam_fan",
      avatar: "https://picsum.photos/32/32?random=8",
      text: "Chào chị từ Việt Nam! 🇻🇳",
      time: "5 phút trước",
      timestamp: Date.now() - 5 * 60 * 1000
    },
    {
      id: "9",
      username: "dance_queen",
      avatar: "https://picsum.photos/32/32?random=9",
      text: "Chị nhảy đẹp quá! 💃",
      time: "6 phút trước",
      timestamp: Date.now() - 6 * 60 * 1000
    },
    {
      id: "10",
      username: "next_level",
      avatar: "https://picsum.photos/32/32?random=10",
      text: "Next Level là bản hit nhất! 🔥",
      time: "7 phút trước",
      timestamp: Date.now() - 7 * 60 * 1000
    },
    {
      id: "11",
      username: "savage_fan",
      avatar: "https://picsum.photos/32/32?random=11",
      text: "Savage comeback khi nào chị? 🎭",
      time: "8 phút trước",
      timestamp: Date.now() - 8 * 60 * 1000
    },
    {
      id: "12",
      username: "girls_fan",
      avatar: "https://picsum.photos/32/32?random=12",
      text: "Girls album thật tuyệt! 👧",
      time: "9 phút trước",
      timestamp: Date.now() - 9 * 60 * 1000
    },
    {
      id: "13",
      username: "spicy_lover",
      avatar: "https://picsum.photos/32/32?random=13",
      text: "Spicy MV đẹp quá! 🌶️",
      time: "10 phút trước",
      timestamp: Date.now() - 10 * 60 * 1000
    },
    {
      id: "14",
      username: "drama_fan",
      avatar: "https://picsum.photos/32/32?random=14",
      text: "Drama concept thật ấn tượng! 🎬",
      time: "11 phút trước",
      timestamp: Date.now() - 11 * 60 * 1000
    },
    {
      id: "15",
      username: "welcome_fan",
      avatar: "https://picsum.photos/32/32?random=15",
      text: "Welcome to MY world! 🌍",
      time: "12 phút trước",
      timestamp: Date.now() - 12 * 60 * 1000
    }
  ]);

  // Sort comments by oldest first (newest at bottom for live chat)
  const sortedComments = [...comments].sort((a, b) => a.timestamp - b.timestamp);

  // Auto scroll to bottom when component mounts
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  return (
    <>
      <div className="chat-container" ref={chatContainerRef}>
        <div className="comment-area">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                <img src={comment.avatar} alt={comment.username} />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-username">{comment.username}</span>
                  <span className="comment-time">{comment.time}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Nhập tin nhắn..."
          />
          <button className="send-button">
            Gửi
          </button>
        </div>
      </div>
    </>
  );
}
