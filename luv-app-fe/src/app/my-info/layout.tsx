import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Info - Luv Live Stream',
  description: 'Xem thông tin profile của người dùng',
};

export default function MyInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}