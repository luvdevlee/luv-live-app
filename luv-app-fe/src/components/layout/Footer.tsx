"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} LUV App. All rights reserved.
      </div>
    </footer>
  );
}
