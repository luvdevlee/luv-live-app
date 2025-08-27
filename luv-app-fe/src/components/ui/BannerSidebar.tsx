"use client";

interface BannerEvent {
  id: string;
  image: string;
}

const bannerEvents: BannerEvent[] = [
  {
    id: "1",
    image: "https://viet-power.vn/wp-content/uploads/2024/06/banner-su-kien-10.jpg"
  },
  {
    id: "2", 
    image: "https://viet-power.vn/wp-content/uploads/2024/06/banner-su-kien-13.jpg"
  },
  {
    id: "3",
    image: "https://upcontent.vn/wp-content/uploads/2024/07/banner-su-kien-dep-noi-bat-5.jpg"
  },
  {
    id: "4",
    image: "https://upcontent.vn/wp-content/uploads/2024/07/banner-su-kien-dep-noi-bat-4.jpg"
  }
];

export default function BannerSidebar() {
  return (
    <div className="banner-sidebar">
      <div className="banner-grid">
        {bannerEvents.map((event) => (
          <div key={event.id} className="banner-card">
            <img 
              src={event.image} 
              alt="Banner"
              className="banner-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
