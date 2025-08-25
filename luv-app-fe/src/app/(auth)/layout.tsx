// Auth layout
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 min-h-screen">
        {children}
      </div>
    </div>
  );
}
