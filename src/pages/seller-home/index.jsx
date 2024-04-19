import React, {useEffect} from 'react';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Layout, Menu} from "antd";
const {  Sider, Content } = Layout;
function SellerHome() {
    const navigate = useNavigate();
    const location = useLocation();
    const [defaultSelectedKeys, setDefaultSelectedKeys] = React.useState([]);

    useEffect(() => {
        console.log(location.pathname)
        if (location.pathname.includes('/seller/orders')) {
            setDefaultSelectedKeys(['2']);
        }
        if (location.pathname.includes('/seller/products')) {
            setDefaultSelectedKeys(['1']);
        }
    }, [location]);

    return (
        <Layout >
            <Sider className={'d-none d-md-block'}>
                <Menu theme="dark" mode="inline" selectedKeys={defaultSelectedKeys}>
                    <Menu.Item key="1" onClick={() => navigate('/seller/products')}>
                        Products
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => navigate('/seller/orders')}>
                        Orders
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content className={'p-5'}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default SellerHome;
