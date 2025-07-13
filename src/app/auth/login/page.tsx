import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Вход - AnimeV',
  description: 'Войдите в свой аккаунт AnimeV',
}
