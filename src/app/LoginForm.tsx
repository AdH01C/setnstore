"use client"

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Flex, Checkbox, Button, Input } from "antd";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loading from '@/app/components/Loading';

export default function LoginForm() {
    const router = useRouter();

    const onLogin = async (values: any) => {
        // console.log('Received values of form: ', values);
        // router.push('/home');
        const result = await signIn('credentials', {
            redirect: false,
            username: values.username,
            password: values.password,
        });

        if (result?.error) {
            console.error("Login error: ", result.error)
        } else {
            router.push('/home');
        }
    };

    const onGoogleLogin = () => {
        signIn('google', { callbackUrl: '/home'}).then(() => {
            router.push('/home');
        }).catch(e => {
            console.error("Google login error", e);
        })
    }

        
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

                {/* Google OAuth button */}
                <Button block type="default" onClick={onGoogleLogin}>
                    Log in with Google
                </Button>
            </>
        )}
        
        </>
        
    );
}