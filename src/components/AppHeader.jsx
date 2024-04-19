import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import {
    UserOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    LoginOutlined,
    LogoutOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom';
import useAuth from '../auth/index.jsx';
import StoreIcon from '../assets/store.png';
const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const { authenticated, logout } = useAuth();
    const [visible, setVisible] = useState(false);
    const role = localStorage.getItem('role');
    const handleMenuVisibleChange = (flag) => {
        setVisible(flag);
    };

    const handleClickLogout = async () => {
        await logout();
        navigate('/');
    }

    const userMenu = (
        <Menu >
            <Menu.Item key="profile"
                       onClick={() => navigate('/profile')}
                       icon={<UserOutlined />}>
                Profile
            </Menu.Item>
            {role !== 'seller' && (
                <>
                    <Menu.Item
                        onClick={() => navigate('/cart')}
                        key="cart" icon={<ShoppingCartOutlined />}>
                        My Cart
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => navigate('/orders')}
                        key="orders" icon={<HistoryOutlined />}>
                        My Orders
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => navigate('/favorites')}
                        key="favorites" icon={<HeartOutlined />}>
                        My Favorites
                    </Menu.Item>

                </>
            )}
            {role === 'seller' && (
                <>
                    <Menu.Item
                        className="bg-primary text-white"
                        onClick={() => {
                            navigate('/seller/products');
                        }}
                        key="products" icon={<ShoppingCartOutlined />}>
                        Products Management
                    </Menu.Item>
                    <Menu.Item
                        className="bg-primary text-white mt-2"
                        onClick={() => navigate('/seller/orders')}
                        key="orders" icon={<HistoryOutlined />}>
                        Orders Management
                    </Menu.Item>
                </>
            )}
            <Menu.Item
                onClick={handleClickLogout}
                key="logout" icon={<LogoutOutlined />}>
                Log Out
            </Menu.Item>
        </Menu>
    );

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center' }}>
                <img src={StoreIcon} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                <h1 style={{ margin: 0, color: '#fff', fontSize: '24px' }}>Online Store</h1>
            </div>
            <div>
                {authenticated ? (
                    <Dropdown
                        overlay={userMenu}
                        onVisibleChange={handleMenuVisibleChange}
                        visible={visible}
                        placement="bottomRight"
                    >
                        <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                    </Dropdown>
                ) : (
                    <Link to="/login">
                        <Button type="primary" icon={<LoginOutlined />}>
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </Header>
    );
};

export default AppHeader;
