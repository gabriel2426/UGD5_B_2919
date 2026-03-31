'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const SocialAuth = () => {
  const router = useRouter();

  const handleSocialLogin = (provider: string) => {
    localStorage.setItem('isLogin', 'true');
    toast.success(`${provider} Login Berhasil!`, { theme: 'dark', position: 'top-right' });
    setTimeout(() => {
      router.push('/home');
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Atau masuk dengan</span>
        </div>
      </div>

      <div className="flex space-x-4 justify-center">
    
        <button
        type="button"
          onClick={() => handleSocialLogin('Google')}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-110 shadow-sm"
          title="Login dengan Google"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="h-5 w-5"
            alt="google"
          />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-110 shadow-sm"
          title="Login dengan GitHub"
        >
          <img
            src="https://www.svgrepo.com/show/512317/github-142.svg"
            className="h-5 w-5"
            alt="github"
          />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('Facebook')}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-110 shadow-sm"
          title="Login dengan Facebook"
        >
          <img
            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
            className="h-5 w-5"
            alt="facebook"
          />
        </button>
      </div>
    </div>
  );
};

export default SocialAuth;
