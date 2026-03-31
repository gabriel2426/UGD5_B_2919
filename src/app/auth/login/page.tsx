'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/Socialauth';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const MAX_ATTEMPTS = 3;

const generateCaptcha = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.187-3.39M6.228 6.228A9.97 9.97 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.51 5.273M6.228 6.228L3 3m3.228 3.228l3.65 3.65M21 21l-3.228-3.228m0 0L14.12 14.12" />
  </svg>
);

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
  });

  const [errors, setErrors] = useState<ErrorObject>({});
  const [attempts, setAttempts] = useState<number>(MAX_ATTEMPTS);
  const [captcha, setCaptcha] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setFormData(prev => ({ ...prev, captchaInput: '' }));
    setErrors(prev => ({ ...prev, captcha: undefined }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const getEmailNumber = (email: string): string | null => {
    const emailRegex = /^([0-9]+)@gmail\.com$/;
    const match = email.match(emailRegex);
    return match ? match[1] : null;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (attempts <= 0) return;

    const newErrors: ErrorObject = {};
    const emailTrim = formData.email.trim();

    if (!emailTrim) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!getEmailNumber(emailTrim)) {
      newErrors.email = 'Email harus sesuai format NPM (cth. 2919@gmail.com)';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else {
      const emailNum = getEmailNumber(emailTrim);
      if (emailNum && formData.password !== emailNum) {
        newErrors.password = `Password harus sesuai NPM (${emailNum})`;
      }
    }

    // VALIDASI CAPTCHA (Sesuai Gambar)
    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = 'Captcha salah';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const newAttempts = Math.max(0, attempts - 1);
      setAttempts(newAttempts);
      // Hanya refresh captcha jika input salah, bukan jika kosong (opsional, sesuai UX umum)
      if (newErrors.captcha === 'Captcha salah') refreshCaptcha();
      return;
    }

    if (formData.rememberMe) localStorage.setItem('isLogin', 'true');
    else sessionStorage.setItem('isLogin', 'true');

    toast.success('Login Berhasil!', { theme: 'dark' });
    router.push('/home');
  };

  const handleReset = () => {
    setAttempts(MAX_ATTEMPTS);
    setFormData({ email: '', password: '', captchaInput: '', rememberMe: false });
    setErrors({});
    refreshCaptcha();
    toast.success('Kesempatan direset!');
  };

  const isDisabled = attempts <= 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <AuthFromWrapper title="Login">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <p className="text-center text-sm font-semibold text-gray-700">
            Sisa Kesempatan: <span className={attempts === 0 ? 'text-red-500' : 'text-gray-800'}>{attempts}</span>
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-500">Email</label>
            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              disabled={isDisabled}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-blue-300 ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="Masukan email"
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isDisabled}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-blue-300 ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                placeholder="Masukan password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Captcha:</label>
              <div className="bg-gray-100 border border-gray-300 rounded px-3 py-1 shadow-sm">
                <span className="font-mono text-lg font-bold tracking-widest text-gray-800 select-none">{captcha}</span>
              </div>
              <button type="button" onClick={refreshCaptcha} className="text-blue-500 hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <input
              name="captchaInput"
              type="text"
              value={formData.captchaInput}
              onChange={handleChange}
              disabled={isDisabled}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-blue-300 ${errors.captcha ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Masukkan captcha"
            />
            {errors.captcha && (
              <p className="text-red-600 text-sm italic font-medium mt-1">
                {errors.captcha}
              </p>
            )}
          </div>

          <button type="submit" disabled={isDisabled} className={`w-full font-semibold py-2.5 rounded-lg text-white ${isDisabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            Sign In
          </button>

          <button type="button" onClick={handleReset} disabled={!isDisabled} className={`w-full font-semibold py-2.5 rounded-lg ${isDisabled ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            Reset Kesempatan
          </button>

          <SocialAuth />
          <p className="text-center text-sm text-gray-600">
            Tidak punya akun? <Link href="/auth/register" className="text-blue-600 font-semibold">Daftar</Link>
          </p>
        </form>
      </AuthFromWrapper>
    </div>
  );
};

export default LoginPage;