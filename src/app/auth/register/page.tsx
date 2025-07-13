import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Регистрация - AnimeV',
  description: 'Создайте аккаунт AnimeV',
}
