"use client";
import { useEffect, useState } from "react";
import type { User } from "@/types/user"; 

export default function MyInfoPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">My Info</h1>
        <p>⚠️ Bạn chưa đăng nhập.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Info</h1>
      <p><strong>ID:</strong> {user._id}</p>
      <p><strong>Display Name:</strong> {user.display_name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Avatar:</strong> {user.avatar_url}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Is Active:</strong> {user.is_active ? "Yes" : "No"}</p>
      <p><strong>Last Login At:</strong> {user.last_login_at}</p>
      <p><strong>Created At:</strong> {user.createdAt}</p>
      <p><strong>Updated At:</strong> {user.updatedAt}</p>
    </div>
  );
}
