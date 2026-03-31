import React, { ReactNode } from 'react';

interface AuthFormWrapperProps {
  title: string;
  children: ReactNode;
}

const AuthFromWrapper = ({ title, children }: AuthFormWrapperProps) => {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default AuthFromWrapper;
