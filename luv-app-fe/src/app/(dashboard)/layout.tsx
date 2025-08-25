// Dashboard layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold">Luv Stream</h2>
          </div>
          <nav className="mt-6">
            <div className="px-6 py-2">
              <a href="/dashboard" className="block text-gray-700 hover:text-blue-600">
                Dashboard
              </a>
            </div>
            <div className="px-6 py-2">
              <a href="/streams" className="block text-gray-700 hover:text-blue-600">
                Streams
              </a>
            </div>
            <div className="px-6 py-2">
              <a href="/analytics" className="block text-gray-700 hover:text-blue-600">
                Analytics
              </a>
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
