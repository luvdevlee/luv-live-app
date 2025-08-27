import Footer from "@/components/layout/Footer";
import { Hero, HotGameLives, BestPerformance, LiveshowSection } from "@/components/ui";

export default function HomePage() {
  return (
    <div>
      <Hero />

      <HotGameLives />

      <BestPerformance />

      <LiveshowSection />

      <div className="h-[200px]">More content coming soon...</div>

      <Footer />
    </div>
  );
}