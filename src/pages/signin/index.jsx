import React from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { login as requestLogin } from "./service";
import useAuth from '../../auth/index.jsx';

const Signin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const res = await requestLogin(values);
            const data = res.data;
            const token = data.token;
            const role = data.role;
            login().then(() => {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                if (role === 'seller') {
                    navigate("/seller");
                } else {
                    navigate("/");
                }
            });
        } catch (err) {
            console.log(err);
            message.error("Login failed!");
        }
    };

    return (
        <Row className="vh-100 d-flex justify-content-center align-items-center">
            <Col xs={24} md={12} lg={8} className="p-5 bg-light shadow-lg rounded">
                <h1 className="text-center mb-4">Sign In</h1>
                <p className="text-end mb-4">
                    <span>Don't have an account?</span>
                    <Link to={"/register"}>Register</Link>
                </p>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default Signin;
