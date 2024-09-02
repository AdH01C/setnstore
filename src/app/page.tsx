import LoginForm from '@/app/LoginForm';

export default function Home() {

    return (
        <main className="flex min-h-screen flex-col items-center gap-16 bg-background justify-center">
            <LoginForm />
        </main>
    );
}