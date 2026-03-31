'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import PoopSurvivors from '../../components/Game1'; 

export default function Home() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // PROTEKSI URL: Cek apakah data login ada di localStorage atau sessionStorage
    const isLogin =
      localStorage.getItem('isLogin') === 'true' ||
      sessionStorage.getItem('isLogin') === 'true';
    
    if (!isLogin) {
      // Jika pengguna mencoba akses langsung /home tanpa login, lempar ke notauthorized
      router.replace('/auth/not-authorized'); 
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    sessionStorage.removeItem('isLogin');
    toast.success('Berhasil keluar. Sampai jumpa!', { 
      theme: 'dark', 
      position: 'top-right' 
    });
    router.push('/auth/login'); 
  };

  // Cegah konten berkedip (flashing) sebelum pengecekan selesai
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex flex-col items-center justify-center p-6 relative">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all text-sm z-50 flex items-center gap-2"
      >
        <span>Logout</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>

      {!playing ? (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
            Selamat Datang!
          </h1>

          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Choose Your Game
            </h2>

            <button
              onClick={() => setPlaying(true)}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:scale-95 text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-green-500/40 transition-all duration-200 transform hover:scale-105 text-xl"
            >
              🧻 Poop Survivors
            </button>

            <p className="text-gray-400 text-sm text-center">
              Survive as long as you can and avoid the chaos!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
            🧻 Poop Survivors
          </h1>
          
          <PoopSurvivors onExit={() => setPlaying(false)} />
        </div>
      )}
    </div>
  );
}