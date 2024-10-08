"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Flex, Checkbox, Button, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "@/app/components/Loading";
import { setCookie } from "cookies-next";

export default function LoginForm() {
  const router = useRouter();

  const onLogin = (values: any) => {
    console.log("Received values of form: ", values);
    // expire in 30 minutes
    setCookie("username", values.username, { maxAge: 60 * 30 * 60 });
    router.push("/dashboard");
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
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>
                    <a className="text-secondary">Remember me</a>
                  </Checkbox>
                </Form.Item>
                <a href="" className="text-secondary">
                  Forgot password
                </a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                className="bg-secondary"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
}
