import { Layout } from "antd";
import { Header, Footer } from "antd/es/layout/layout";
import React from "react";
import RulesetEditor from "./RulesetEditor";

export default function Page() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="flex items-center"></Header>
      <Layout>
        <RulesetEditor />
      </Layout>
      <Footer className="text-center">
        Inquisico ©{new Date().getFullYear()} Created by Adrians Worker
      </Footer>
    </Layout>
  );
}
