import { Layout } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Dashboard from "./Dashboard";

export default function Page() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="flex items-center"></Header>
      <Content className="flex flex-col gap-4 items-center justify-center">
        <Dashboard />
      </Content>
      <Footer className="text-center">
        Inquisico ©{new Date().getFullYear()} Created by Adrians Worker
      </Footer>
    </Layout>
  );
}


