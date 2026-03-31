'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/Socialauth';
import { toast } from 'react-toastify';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
};

const generateCaptcha = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const getPasswordStrength = (password: string) => {
  if (!password) return { label: '0%', color: 'bg-gray-200', width: '0%', percentage: 0 };
  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;

  let color = 'bg-red-500';
  if (score > 25) color = 'bg-orange-500';
  if (score > 50) color = 'bg-yellow-500';
  if (score > 75) color = 'bg-green-500';

  return { label: `${score}%`, color, width: `${score}%`, percentage: score };
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

const RegisterPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  const [captcha, setCaptcha] = useState<string>(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordValue = watch('password', '');
  const strength = getPasswordStrength(passwordValue);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    setCaptchaError('');
  }, []);

  const onSubmit = (data: RegisterFormData) => {
    // VALIDASI CAPTCHA (Sesuai Gambar)
    if (!captchaInput.trim()) {
      setCaptchaError('Captcha belum diisi');
      return;
    }
    if (captchaInput !== captcha) {
      setCaptchaError('Captcha salah');
      refreshCaptcha();
      return;
    }
    toast.success('Register Berhasil!');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <AuthFormWrapper title="Register">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-500">Username</label>
            <input
              {...register('username', { required: 'Username wajib diisi', maxLength: 8 })}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-blue-300"
              placeholder="Username"
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-500">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email wajib diisi' })}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-blue-300"
              placeholder="Email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: true, minLength: 8 })}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-blue-300"
                placeholder="Password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Strength: {strength.label}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-gray-500">Konfirmasi Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmPassword', { required: true, validate: v => v === passwordValue })}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-blue-300"
                placeholder="Konfirmasi password"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Captcha:</label>
              <div className="bg-gray-100 border border-gray-300 rounded px-3 py-1 shadow-sm">
                <span className="font-mono text-lg font-bold tracking-widest text-gray-800 select-none">{captcha}</span>
              </div>
              <button type="button" onClick={refreshCaptcha} className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => {
                setCaptchaInput(e.target.value);
                setCaptchaError(''); 
              }}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-blue-300 ${captchaError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Masukkan captcha"
            />
            {captchaError && (
              <p className="text-red-600 text-sm italic font-medium mt-1">
                {captchaError}
              </p>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg">Register</button>
          
          <SocialAuth />
          <p className="text-center text-sm text-gray-600">
            Sudah punya akun? <Link href="/auth/login" className="text-blue-600 font-semibold">Login</Link>
          </p>
        </form>
      </AuthFormWrapper>
    </div>
  );
};

export default RegisterPage;