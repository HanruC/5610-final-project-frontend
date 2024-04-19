import React from 'react';
import { Form, Input, Radio, Button, message, Row, Col } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { register } from "./service";

const Signup = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            await register(values);
            message.success("Register successfully!");
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    };

    const validatePassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
    });

    return (
        <Row className="vh-100 d-flex justify-content-center align-items-center">
            <Col xs={24} md={12} lg={8} className="p-5 bg-light shadow-lg rounded">
                <h1 className="text-center mb-4">Sign Up</h1>
                <p className="text-end mb-4">
                    <span>Already have an account?</span>
                    <Link to={"/login"}>Login</Link>
                </p>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>

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

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[{ required: true, message: 'Please confirm your password!' }, validatePassword]}
                    >
                        <Input.Password placeholder="Confirm Password" />
                    </Form.Item>

                    <Form.Item name="role" label="Role" initialValue="buyer">
                        <Radio.Group>
                            <Radio value="buyer">I am a Buyer</Radio>
                            <Radio value="seller">I am a Seller</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default Signup;
