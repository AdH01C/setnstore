"use client"

import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import Loading from './loading';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Allow time for render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  const onLogin = (values: any) => {
    console.log('Received values of form: ', values);
    router.push('https://www.youtube.com/watch?v=xvFZjo5PgG0');
  };
  return (
    <main className="flex min-h-screen flex-col items-center gap-16 bg-background justify-center">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-[50px] font-bold text-primary">Inquisito</h1>
          <Form
            name="login"
            initialValues={{ remember: true }}
            className='w-[360px]'
            onFinish={onLogin}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>
                    <a className='text-secondary'>Remember me</a>
                    </Checkbox>
                </Form.Item>
                <a href="" className='text-secondary'>Forgot password</a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit" className='bg-secondary'>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </main>
  );
}