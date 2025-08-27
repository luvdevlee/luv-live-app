"use client";

interface GameCard {
  id: string;
  name: string;
  image: string;
  liveStreamers: number;
}

const gameData: GameCard[] = [
  {
    id: "lol",
    name: "League of Legends",
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/aeddf86348891bd4bc12509db175d0cccb8b8c02-837x469.jpg?w=1200&h=630&fm=webp&fit=crop&crop=center",
    liveStreamers: 64
  },
  {
    id: "valorant",
    name: "Valorant",
    image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/bd4367989d3fa57a8872e94b70f10875684d5c43-1920x1080.jpg?auto=format&fit=crop&q=80&h=537&w=956&crop=center",
    liveStreamers: 39
  },
  {
    id: "pubg",
    name: "PUBG",
    image: "https://media.sketchfab.com/models/5848769ca37f442eb9d100374d02be4b/thumbnails/18ac83c88c7642acb4c76f900b9d152e/6b46efc4de46443aa067a74d63f4a4c9.jpeg",
    liveStreamers: 28
  },
  {
    id: "cod",
    name: "Call of Duty",
    image: "https://img.goodfon.com/original/2560x1440/8/f5/logo-call-of-duty-black-ops-4-logo-chernyi-fon-tekst.jpg",
    liveStreamers: 19
  }
];

export default function HotGameLives() {
  return (
    <section className="hot-games-section">
      <div className="hot-games-container">
        {/* Section Title */}
        <div className="section-header">
          <h2 className="section-title">Hot Games</h2>
          <p className="section-subtitle">Khám phá những tựa game hot nhất hiện tại</p>
        </div>

        {/* Game Cards Grid */}
        <div className="game-cards-grid">
          {gameData.map((game) => (
            <div key={game.id} className="game-card">
              {/* Game Background Image */}
              <div 
                className="game-image"
                style={{
                  backgroundImage: `url(${game.image})`
                }}
              >
                {/* Live Badge */}
                <div className="live-count-badge">
                  <span className="live-dot-small"></span>
                  {game.liveStreamers} LIVE
                </div>
                
                {/* Hover Overlay */}
                <div className="game-overlay">
                  <div className="play-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Game Info */}
              <div className="game-info">
                <h3 className="game-name">{game.name}</h3>
                <p className="streamers-count">
                  {game.liveStreamers.toLocaleString()} streamers đang live
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
