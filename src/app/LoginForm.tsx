"use client";

import { Button, Form } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Loading } from "./components/Loading";
import { useAuth } from "./hooks/useAuth";

function LoginForm() {
  const router = useRouter();
  const { isFetching, identity } = useAuth({ forceRefetch: false });

  const redirectToDashboard = () => {
    router.push("/dashboard");
  };

  const redirectToLogin = () => {
    const authEndpoint = process.env.NEXT_PUBLIC_AUTH_ENDPOINT;
    if (authEndpoint) {
      router.push(`${authEndpoint}/login`);
    } else {
      throw new Error("Auth endpoint is not defined");
    }
  };

  const onAuthlinkLogin = () => {
    if (!isFetching && identity) {
      redirectToDashboard();
    } else {
      redirectToLogin();
    }
  };

  useEffect(() => {
    if (!isFetching && identity) {
      redirectToDashboard();
    }
  }, [isFetching, identity, router]);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-[50px] font-bold text-primary">Inquisico</h1>
          {/* <Form name="login" initialValues={{ remember: true }} className="w-[360px]">
            <Form.Item name="username" rules={[{ required: true, message: "Please input your Username!" }]}>
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
              <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
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
              <Button block type="primary" htmlType="submit" className="bg-secondary">
                Log in
              </Button>
            </Form.Item> */}

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
          {/* </Form> */}
        </>
      )}
    </>
  );
}

export { LoginForm };
