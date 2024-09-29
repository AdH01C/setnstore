import { Layout } from "antd";
import { Header, Footer } from "antd/es/layout/layout";
import React from "react";
import NewRulesetCreator from "./NewRulesetCreator";

export default function NewRulesetEditor() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="flex items-center"></Header>
      <Layout>
        <NewRulesetCreator />
      </Layout>
      <Footer className="text-center">
        Inquisico ©{new Date().getFullYear()} Created by Adrians Worker
      </Footer>
    </Layout>
  );
}
