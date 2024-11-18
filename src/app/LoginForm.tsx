"use client";

import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Flex, Checkbox, Button, Input } from "antd";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Loading from "@/app/components/Loading";
import { useAuth } from "./hooks/useAuth";
import { userDetailsAtom } from "@/jotai/User";
import { useAtom } from "jotai";

export default function LoginForm() {
  const router = useRouter();
  const { isFetching, identity } = useAuth({ forceRefetch: false });
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);

  const onAuthlinkLogin = () => {
    if (!isFetching && identity ) {
      
      if (!identity) {
        console.error("User not found or error fetching user data");
        return;
      }

      setUserDetails({
        id: identity.id,
        firstName: identity.firstName,
        lastName: identity.lastName,
        email: "",
        companyId: "",
        companyName: "",
        appId: "",
      });

      // router.push("/dashboard");
    } else {
      router.push(process.env.NEXT_PUBLIC_AUTH_ENDPOINT + "/login");
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFetching && identity) {
      
      if (!identity) {
        console.error("User not found or error fetching user data");
        setIsLoading(false);
        return;
      }

      setUserDetails({
        id: identity.id,
        firstName: identity.firstName,
        lastName: identity.lastName,
        email: "",
        companyId: "",
      });
      console.log("User exists:", userDetails);
      router.push("/dashboard");
      return;
    }

    // Allow time for render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [isFetching, identity]);

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

            <Form.Item>
                <Button
                block
                type="primary"
                style={{
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                }}
                onClick={onAuthlinkLogin}
                >
                Log in with Authlink
                </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
}
