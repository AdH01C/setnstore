import { UserOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAppContext } from "./AppContext";
import { Header } from "antd/es/layout/layout";
import { addTrailingSlash } from "../utils/common";

const { Text } = Typography;

function ApplicationHeader() {
  const { companyName, name } = useAppContext();
  const router = useRouter();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "User: " + name,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      danger: true,
      label: "Log out",
      onClick: () => {
        void router.push(addTrailingSlash(process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? "") + "logout_unified");
      },
    },
  ];

  return (
    <Header className="flex items-center justify-between">
      <Link href="/dashboard" className="text-2xl font-bold text-white">
        Inquisico
      </Link>

      <Dropdown menu={{ items }}>
        <a onClick={e => e.preventDefault()}>
          <Space>
            <UserOutlined style={{ color: "white" }} className="text-2xl hover:cursor-pointer" />
            <Text style={{ color: "white" }}>{companyName}</Text>
          </Space>
        </a>
      </Dropdown>
    </Header>
  );
}

export { ApplicationHeader };
