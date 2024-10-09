import LoginForm from "@/app/LoginForm";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Layout } from "antd";
import { Footer } from "antd/es/layout/layout";
import { Content } from "antd/es/layout/layout";

export default async function Page() {
  const session = await getServerSession(options);

  if (session) {
    redirect("/dashboard");
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
