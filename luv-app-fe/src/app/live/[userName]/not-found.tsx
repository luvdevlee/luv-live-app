import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy Streamer</h2>
        <p className="text-muted-foreground mb-6">
          Streamer bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
