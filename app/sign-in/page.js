'use client';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="auth-container">
      <SignIn />
    </div>
  );
}
