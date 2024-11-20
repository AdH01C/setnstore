import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";

import { LoginForm } from "./LoginForm";

export default function Page() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className="flex flex-col items-center justify-center gap-4">
        <LoginForm />
      </Content>
      <Footer className="text-center">Inquisico ©{new Date().getFullYear()} Created by Adrians Worker</Footer>
    </Layout>
  );
}
