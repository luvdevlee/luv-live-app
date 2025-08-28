import { notFound } from "next/navigation";

interface LiveStreamPageProps {
  params: Promise<{
    userName: string;
  }>;
}

export default async function LiveStreamPage({ params }: LiveStreamPageProps) {
  const { userName } = await params;

  // TODO: Fetch streamer data based on userName
  // For now, we'll show a placeholder
  if (!userName) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Live Stream của {userName}
          </h1>
          <p className="text-muted-foreground">
            Trang livestream đang được phát triển...
          </p>
        </div>
      </div>
    </div>
  );
}
