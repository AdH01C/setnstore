"use client";

import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Flex, Checkbox, Button, Input } from "antd";
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react';
import Loading from '@/app/components/Loading';
import { setCookie } from "cookies-next";

export default function LoginForm() {
  const router = useRouter();

  const onLogin = async (values: any) => {
    // expire in 30 minutes
    // setCookie("username", values.username, { maxAge: 60 * 30 });
    // router.push("/dashboard");
    const result = await signIn('credentials', {
            redirect: false, // Prevent automatic redirection
            username: values.username,
            password: values.password,
        });

        if (result?.error) {
            console.error("Login error:", result.error);
        } else {
            setCookie("username", values.username, { maxAge: 60 * 30 });
            router.push('/dashboard');
        }
    };

    const onGoogleLogin = async () => {
      signIn('google', { callbackUrl: '/dashboard' });
      // const result = await signIn('google', { redirect: false });

      // if (result?.error) {
      //   console.error("Google login error:", result.error);
      // } else {
      //   // Wait for the session to be available
      //   const session = await getSession();

      //   if (session?.user?.name) {
      //     // Set the cookie with the user's name from Google login
      //     setCookie("username", session.user.name, { maxAge: 60 * 30 });
          
      //     // Redirect to the dashboard
      //     router.push('/dashboard');
      //   } else {
      //     console.error("Session not established after Google login.");
      //   }
      // }
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
          <h1 className="text-[50px] font-bold text-primary">Inquisito</h1>
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
                    <Button block type="primary" htmlType="submit" className='bg-secondary'>
                        Log in
                    </Button>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        block
                        icon={<GoogleOutlined />}
                        type="primary"
                        style={{
                          backgroundColor: "#fa3452",
                          borderColor: "#fa3452",
                          color: "white",
                        }}
                        onClick={onGoogleLogin}
                      >
                        Log in with Google
                      </Button>
                    </Form.Item>
                </Form>

            </>
        )}
        
        </>
        
    );
}
