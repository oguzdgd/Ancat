"use client";

export default function DashboardClient({ user }: { user: any }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Hoş geldin, {user.email}</h1>
      <p className="mt-2">Burası senin Dashboard alanın.</p>

      {/* Gelecekte burada interaktif şeyler olacak */}
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Yeni Anket Oluştur
      </button>
    </div>
  );
}
