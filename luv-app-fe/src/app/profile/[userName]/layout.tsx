import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Luv Live Stream',
  description: 'Xem thông tin profile của người dùng',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
