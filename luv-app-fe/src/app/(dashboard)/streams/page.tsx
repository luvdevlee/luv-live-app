// Streams management page
export default function StreamsPage() {
  return (
    <div className="streams-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Streams</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Tạo Stream Mới
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách Streams</h2>
          {/* Stream list will be added here */}
          <p className="text-gray-500">Chưa có stream nào.</p>
        </div>
      </div>
    </div>
  );
}
