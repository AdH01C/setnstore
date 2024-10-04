import LoginForm from '@/app/LoginForm';
import { options } from './api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default function async Page() {
  const session = await getServerSession(options);

  if(session) {
    redirect('/dashboard')
  }
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className="flex flex-col gap-4 items-center justify-center">
        <LoginForm />
      </Content>
      <Footer className="text-center">
        Inquisico ©{new Date().getFullYear()} Created by Adrians Worker
      </Footer>
    </Layout>
  );
}
