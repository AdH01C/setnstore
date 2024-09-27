import LoginForm from '@/app/LoginForm';
import { options } from './api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Home() {
    const session = await getServerSession(options);

    if (session) {
        redirect('/home');
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-16 bg-background justify-center">
            <LoginForm />
        </main>
    );
}
