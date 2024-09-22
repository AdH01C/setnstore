"use client";
import { currentlySelectedAtom } from "@/jotai/Navigation";
import { UserOutlined } from "@ant-design/icons";
import { useAtom } from "jotai";
import React from "react";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

export default function Navbar() {
  const Router = useRouter();
  const [currentlySelected, setCurrentlySelected] = useAtom(
    currentlySelectedAtom
  );

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a>Profile</a>,
    },
    {
      key: "2",
      label: <a>Permissions</a>,
      disabled: true,
    },
    {
      key: "3",
      label: <a>Settings</a>,
      disabled: true,
    },
    {
      key: "4",
      danger: true,
      label: "Log out",
      onClick: () => {
        Router.push("/");
      },
    },
  ];

  return (
    <nav className="flex flex-col items-center py-4 px-8 gap-8 w-full">
      <div className="flex justify-between w-full">
        <button
          className="text-white text-4xl text-primary font-bold hover:cursor-pointer"
          onClick={() => setCurrentlySelected({ type: "Dashboard" })}
        >
          Inquisito
        </button>

        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <UserOutlined className="text-2xl hover:cursor-pointer" />
            </Space>
          </a>
        </Dropdown>
      </div>

      <div className="flex w-full font-bold gap-4">
        <a
          className={`text-white hover:cursor-pointer hover:text-primary ${
            currentlySelected.type === "Dashboard" ? "text-primary" : ""
          }`}
          onClick={() => setCurrentlySelected({ type: "Dashboard" })}
        >
          Dashboard
        </a>
        <a
          className={`text-white hover:cursor-pointer hover:text-primary ${
            currentlySelected.type === "Ruleset Management"
              ? "text-primary"
              : ""
          }`}
          onClick={() => setCurrentlySelected({ type: "Ruleset Management" })}
        >
          Ruleset Management
        </a>
        <a
          className={`text-white hover:cursor-pointer hover:text-primary ${
            currentlySelected.type === "Application Status"
              ? "text-primary"
              : ""
          }`}
          onClick={() => setCurrentlySelected({ type: "Application Status" })}
        >
          Application Status
        </a>
      </div>
    </nav>
  );
}
