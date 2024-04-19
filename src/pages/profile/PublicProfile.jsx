import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import { authenticatedRequest } from "../../request.js";
import {Card, List, Avatar, Typography, Col, Row, Badge} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from "moment";

const { Title, Text } = Typography;

export default function PublicProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await authenticatedRequest.get(`/api/users/profile/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUser();
    }, [userId]);

    if (!user) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col xs={24} sm={20} md={18} lg={16} xl={12}>
                <Card
                    hoverable
                    style={{ width: '100%', padding: '15px' }}
                    cover={<Avatar size={128} src={user.avatar ? `${user.avatar}` : null} icon={!user.avatar && <UserOutlined />} />}
                >
                    <Title level={4}>{user.username}</Title>
                    <Text type="secondary">{user.role}</Text>
                    <br />
                    <Text>Joined: {moment(user.createdAt).format(`YYYY-MM-DD`)}</Text>
                    <p>
                        <Badge
                            color={user.shareFavorites ? '#52c41a' : '#f5222d'}
                            count={
                                user.shareFavorites ? 'Share Favorites' : 'Private Favorites'
                            }
                        />
                    </p>
                </Card>
                {user.role === 'seller' && (
                    <List
                        className="mt-4"
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
                        dataSource={user.products}
                        renderItem={item => (
                            <List.Item>
                                <Card
                                    onClick={() => {
                                        navigate(`/goods/${item._id}`);
                                    }}
                                    hoverable
                                    cover={<img className={'w-100'} alt={item.name} src={`${item.imageUrls[0]}`} />}
                                >
                                    <Card.Meta title={item.name} />
                                    <Text>Price: ${item.price}</Text>
                                    <br />
                                    <Text>Description: {item.description}</Text>
                                    <br />
                                    <Text>Total Sales: {item.totalSales}</Text>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}

                {user.shareFavorites && Array.isArray(user.favorites) && (
                    <List
                        className="mt-4"
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
                        dataSource={user.favorites.map(favorite => favorite.product)}
                        renderItem={item => (
                            <List.Item>
                                <Card
                                    onClick={() => {
                                        navigate(`/goods/${item._id}`);
                                    }}
                                    hoverable
                                    cover={<img className={'w-100'} alt={item.name} src={`${item.imageUrls[0]}`} />}
                                >
                                    <Card.Meta title={item.name} />
                                    <Text>Price: ${item.price}</Text>
                                    <br />
                                    <Text>Description: {item.description}</Text>
                                    <br />
                                    <Text>Total Sales: {item.totalSales}</Text>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Col>
        </Row>
    );
}
