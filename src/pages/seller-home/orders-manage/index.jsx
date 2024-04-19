import React, { useEffect, useState } from 'react';
import {Table, Button, Typography, Layout, message, List, Card, Modal, Badge} from 'antd';
import { getOrdersOfSeller, sendGoods } from '../service';
import moment from "moment";
import DeliveryIcon from '../../../assets/delivery-truck.png';
import CheckedIcon from "../../../assets/checked.png";
import PackageIcon from "../../../assets/package.png";

const { Title } = Typography;
const { Content } = Layout;

function OrdersManage() {
    const [loadOrders, setLoadOrders] = useState(true);
    const [orders, setOrders] = useState([]);

    const renderStatusIcon = (isShipped, isDone) => {
        if (isDone) {
            return <img src={CheckedIcon} width={40}/>;
        }
        if (isShipped) {
            return <img src={DeliveryIcon} width={40}/>;
        }
        return <img src={PackageIcon} width={40}/>;
    }
    const renderStatusLabel = (isShipped, isDone) => {
        if (isDone) {
            return <Badge color={'#7aeeb3'} count={'Order Done'}/>;
        }
        if (isShipped) {
            return <Badge color={'#f5ca7d'} count={'Shipping'}/>;
        }
        return <Badge color={'#f84862'} count={'Packing'}/>;
    }

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrdersOfSeller();
                if (res.data) {
                    setOrders(res.data);
                }
            } catch (error) {
                message.error('Failed to load orders');
                console.error(error);
            }
        };
        fetchOrders();
    }, [loadOrders]);

    const handleClickSend = async (orderID) => {
        try {
            Modal.confirm({
                title: 'Do you want to send the goods?',

                onOk: async () => {
                    await sendGoods(orderID);
                    setLoadOrders(!loadOrders);
                    message.success('Send goods successfully');
                }
            })
        } catch (err) {
            message.error('Failed to send goods');
            console.log(err);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdTime',
            key: 'createdTime',
            render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: 'Goods Name',
            dataIndex: ['productDetails', 'name'],
            key: 'name',
        },
        {
            title: 'Pay Amount',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => (record.price * record.quantity).toFixed(2),
        },
        {
            title: 'Customer Name',
            dataIndex: ['customerDetails', 'username'],
            key: 'username',
        },
        {
            title: 'Delivery Address',
            dataIndex: 'deliveryAddress',
        },
        {
            title: 'Phone Number',
            dataIndex: 'contactNumber',
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <div className={'d-flex gap-2 flex-column align-items-center'}>
                    {renderStatusIcon(record.isShipped, record.isDone)}
                    {renderStatusLabel(record.isShipped, record.isDone)}
                </div>
            ),
        }
    ];

    return (
        <Layout>
            <Content style={{ padding: '50px', marginTop: 32 }}>
                <Title level={2}>Orders</Title>
                <Table
                    className={'d-none d-md-block'}
                    columns={columns}
                    dataSource={orders}
                    rowKey={record => record._id}
                    bordered
                    pagination={{ position: ["bottomCenter"] }}
                />
                <List
                    className={'d-md-none'}
                    grid={{
                        gutter: 16,
                    }}
                    dataSource={orders}
                    renderItem={item => (
                        <List.Item>
                            <Card title={`Order from ${moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}`}>
                                <p><strong>Goods Name:</strong> {item.productDetails.name}</p>
                                <p><strong>Pay Amount:</strong> ${(item.price * item.quantity).toFixed(2)}</p>
                                <p><strong>Customer Name:</strong> {item.customerDetails.username}</p>
                                <p><strong>Delivery Address:</strong> {item.deliveryAddress}</p>
                                <p><strong>Phone Number:</strong> {item.contactNumber}</p>
                                <p><strong>Status:</strong> </p>
                                <p>
                                    <div className={'d-flex gap-2 flex-column align-items-center'}>
                                        {renderStatusIcon(item.isShipped, item.isDone)}
                                        {renderStatusLabel(item.isShipped, item.isDone)}
                                    </div>
                                </p>
                            </Card>
                        </List.Item>
                    )}
                />
            </Content>
        </Layout>
    );
}

export default OrdersManage;
