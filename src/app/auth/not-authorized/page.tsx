'use client';

import { useRouter } from 'next/navigation';

const NotAuthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-blue-200/60 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg">
        <div className="w-full h-56 bg-gray-900 overflow-hidden">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDl3eXZtNTRqdXFqbWZvNHJ6cW9xbWVxb2ZkcHd6cmNsMDR3Y2ZiaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKF1fSIs1R19B8k/giphy.gif"
            alt="not authorized"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 flex flex-col items-center gap-3 text-center">
          <p className="text-3xl font-black text-gray-800">
            ❌ Anda belum login
          </p>
          <p className="text-gray-600 text-sm">
            Silakan login terlebih dahulu
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2"
          >
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
