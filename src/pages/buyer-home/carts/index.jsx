import React, { useEffect, useState } from 'react';
import {Row, Col, Table, Button, Modal, Form, Input, Checkbox, Typography, message, List} from 'antd';
import { getCartGoods, orderCart, removeGoodsFromCart } from "../service";

const { Title } = Typography;

function Carts() {
    const [refresh, setRefresh] = useState(true);
    const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [orderForm, setOrderForm] = useState({
        phone: '',
        address: ''
    });
    const [cartGoods, setCartGoods] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchCartGoods();
    }, [refresh]);

    const fetchCartGoods = async () => {
        try {
            const res = await getCartGoods();
            setCartGoods(res.data.map(item => ({ ...item, checked: false })));
        } catch (err) {
            message.error('Failed to load cart goods');
            console.error(err);
        }
    };

    useEffect(() => {
        const amount = cartGoods.reduce((acc, item) => {
            return item.checked ? acc + (item.count * item.productDetails.price) : acc;
        }, 0);
        setTotal(amount.toFixed(2));
    }, [cartGoods]);

    const removeGoods = async (id) => {
        try {
            await removeGoodsFromCart([id]);
            message.success('Removed successfully!');
            setRefresh(!refresh);
        } catch (err) {
            message.error('Failed to remove item');
            console.error(err);
        }
    };

    const handleOrder = async () => {
        const filteredItems = cartGoods.filter(item => item.checked);
        try {
            await orderCart(filteredItems, orderForm);
            message.success("Order placed successfully!");
            setOrderModalVisible(false);
            setRefresh(!refresh);
        } catch (err) {
            message.error('Order failed');
            console.error(err);
        }
    };

    const columns = [
        {
            title: 'Select',
            dataIndex: 'checked',
            render: (checked, record) => (
                <Checkbox checked={checked} onChange={e => handleCheckChange(e, record._id)} />
            ),
        },
        {
            title: 'Goods Name',
            dataIndex: ['productDetails', 'name'],
        },
        {
            title: 'Unit Price',
            dataIndex: ['productDetails', 'price'],
            render: price => `${price} $`
        },
        {
            title: 'Quantity',
            dataIndex: 'count',
        },
        {
            title: 'Total',
            render: (_, record) => `${(record.count * record.productDetails.price).toFixed(2)} $`
        },
        {
            title: 'Operation',
            key: 'operation',
            render: (_, record) => (
                <Button icon={<i className="bi bi-trash3-fill"></i>} type="danger" onClick={() => removeGoods(record._id)}>Remove</Button>
            )
        },
    ];

    const handleCheckChange = (e, id) => {
        setCartGoods(current =>
            current.map(item => item._id === id ? { ...item, checked: e.target.checked } : item)
        );
    };

    return (
        <div>
            <Modal
                title="Make Order"
                visible={orderModalVisible}
                onCancel={() => setOrderModalVisible(false)}
                onOk={handleOrder}
                okText="Order"
                cancelText="Cancel"
            >
                <Form layout="vertical">
                    <Form.Item label="Your Phone number">
                        <Input
                            value={orderForm.phone}
                            onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                            required
                        />
                    </Form.Item>
                    <Form.Item label="Your Address">
                        <Input
                            value={orderForm.address}
                            onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                            required
                        />
                    </Form.Item>
                    <Title level={5} className="text-right">Total: {total}</Title>
                </Form>
            </Modal>
            <Row justify="center" style={{ marginTop: '20px' }}>
                <Col span={18} className={'d-none d-md-block'}>
                    <Table
                        columns={columns}
                        dataSource={cartGoods}
                        rowKey="_id"
                        summary={() => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={5} className="text-right">
                                    <Title level={5}>Total: {total} $</Title>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <Button type="primary" disabled={!cartGoods.some(item => item.checked)} onClick={() => setOrderModalVisible(true)}>
                                        Order
                                    </Button>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                </Col>

                <Col span={18} className={'d-block d-md-none'}>
                    <List
                        itemLayout="horizontal"
                        dataSource={cartGoods}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Button
                                        onClick={() => {
                                            removeGoods(item._id)
                                        }}
                                        icon={<i className="bi bi-trash3-fill"></i>} type="danger" >
                                        Remove
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Checkbox
                                            onChange={e => handleCheckChange(e, item._id)}
                                            checked={item.checked}  />
                                    }
                                    title={item.productDetails.name}
                                    description={
                                        <>
                                            <div>Unit Price: ${item.productDetails.price}</div>
                                            <div>Quantity: {item.count}</div>
                                            <div>Total: ${(item.count * item.productDetails.price).toFixed(2)}</div>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                    <h4 className={'d-flex align-items-center gap-5 w-100'}>
                        Total: {total}

                        <Button type="primary" disabled={!cartGoods.some(item => item.checked)} onClick={() => setOrderModalVisible(true)}>
                            Order
                        </Button>
                    </h4>
                </Col>
            </Row>
        </div>
    );
}

export default Carts;
