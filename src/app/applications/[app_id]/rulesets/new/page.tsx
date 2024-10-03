import { Layout } from "antd";
import { Header, Footer } from "antd/es/layout/layout";
import React from "react";
import RulesetCreator from "./RulesetCreator";

export default function Page() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="flex items-center"></Header>
      <Layout>
        <RulesetCreator />
      </Layout>
      <Footer className="text-center">
        Inquisico ©{new Date().getFullYear()} Created by Adrians Worker
      </Footer>
    </Layout>
  );
}
