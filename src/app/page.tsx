import LoginForm from "@/app/LoginForm";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";

export default function App() {
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
