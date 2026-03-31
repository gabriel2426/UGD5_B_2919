'use client';

import { useRouter } from 'next/navigation';

export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#7091F5] flex items-center justify-center p-4">
      <div className="bg-[#97AEFF] rounded-[32px] shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 shadow-inner">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDl3eXZtNTRqdXFqbWZvNHJ6cW9xbWVxb2ZkcHd6cmNsMDR3Y2ZiaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKF1fSIs1R19B8k/giphy.gif"
            alt="not authorized"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] flex items-center gap-2">
            <span className="text-red-500">❌</span> Anda belum login
          </h1>
          <p className="text-[#475569] text-sm md:text-base font-medium">
            Silakan login terlebih dahulu
          </p>
        </div>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-[#3359E0] hover:bg-[#2848b8] active:scale-95 text-white font-semibold px-10 py-2.5 rounded-lg transition-all text-sm flex items-center gap-2 shadow-md"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>
      </div>
    </div>
  );
}