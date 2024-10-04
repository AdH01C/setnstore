import { Layout } from "antd";
import { Header, Footer } from "antd/es/layout/layout";
import React from "react";
import AppDisplay from "./AppDisplay";
import { getServerSession } from 'next-auth/next';
import { options } from '../../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(options);

  if (!session) {
    redirect('/');
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="flex items-center"></Header>
      <Layout>
        <AppDisplay />
      </Layout>
      <Footer className="text-center">
        Inquisico ©{new Date().getFullYear()} Created by Adrians Worker
      </Footer>
    </Layout>
  );
}
