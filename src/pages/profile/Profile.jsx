import React, {useEffect, useState} from 'react';
import { Form, Input, Button, Avatar, Upload, Layout, Typography, message, Checkbox } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {authenticatedFormRequest, authenticatedRequest} from "../../request.js";
import {Spinner} from "react-bootstrap";

const { Content } = Layout;
const { Title } = Typography;
async function imageUrlToFile(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        console.error('Error converting image URL to File:', error);
        throw error;
    }
}
const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [profile, setProfile] = useState(null);
    const [refresh, setRefresh] = useState(false)

    const onFormSubmit = async (values) => {
        try {
            if (Array.isArray(values.avatar) && values.avatar.length > 0 && values.avatar[0].originFileObj) {
                values.avatar = values.avatar[0].originFileObj;
            }
            await authenticatedFormRequest.put('/api/users/profile', {
                ...values
            });
            console.log('Received values of form: ', values);
            message.success('Profile updated successfully!');
        } catch (err) {
            console.log(err);
        }
    };

    const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(file);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }

        if (isJpgOrPng && isLt2M) {
            getBase64(file, imageUrl => {
                setImageUrl(imageUrl);
                setLoading(false);
            });
        }

        return false;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await authenticatedRequest.get('/api/users/profile');
                if (res.data.avatar) {
                    setImageUrl(res.data.avatar);
                    res.data.avatar = [];
                }
                setProfile({
                    ...res.data
                });
            } catch (err) {}
        }
        fetchProfile()
    }, [refresh]);

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    if (!profile) {
        return (
            <Spinner></Spinner>
        )
    }

    return (
        <Layout>
            <Content style={{ padding: '50px', maxWidth: 600, margin: '0 auto' }}>
                <Title level={2}>Profile</Title>
                <Form

                    form={form}
                    layout="vertical"
                    onFinish={onFormSubmit}
                    initialValues={profile}
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                    >
                        <Input disabled placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="avatar"
                        label="Avatar"
                        valuePropName="fileList"
                        getValueFromEvent={e => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Form.Item>


                    <Form.Item
                        name="shareFavorites"
                        valuePropName="checked"
                    >
                        <Checkbox>Share favorites</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default Profile;
