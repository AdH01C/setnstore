"use client";

import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Flex, Checkbox, Button, Input } from "antd";
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Loading from "@/app/components/Loading";

export default function LoginForm() {
  const router = useRouter();
  const onLogin = async () => {
    const result = await signIn("authlink", { callbackUrl: "/dashboard" });
    if (result?.error) {
      console.error("Error signing in:", result.error);
    } else {
      redirect("/dashboard");
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Allow time for render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-[50px] font-bold text-primary">Inquisico</h1>
          <Form
            name="login"
            initialValues={{ remember: true }}
            className="w-[360px]"
            onFinish={onLogin}
          >
            
            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                className="bg-secondary"
              >
                Get Started
              </Button>
            </Form.Item>

          </Form>
        </>
      )}
    </>
  );
}
