import React, { useEffect, useState } from 'react';
import {Button, Modal, Form, Input, Table, message, Row, Col, Typography, Badge, List, Card} from 'antd';
import {addComment, cancelOrder, getOrders} from '../service';
import Score from './score.jsx';
import moment from 'moment';
import PackageIcon from '../../../assets/package.png';
import DeliveryIcon from '../../../assets/delivery-truck.png';
import CheckedIcon from '../../../assets/checked.png';

const { TextArea } = Input;
const { Title } = Typography;

function Orders() {
    const [reviewVisible, setReviewVisible] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [score, setScore] = useState(1);
    const [comment, setComment] = useState('');
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrders();
                setOrders(res.data);
            } catch (err) {
                message.error("Failed to fetch orders.");
            }
        };
        fetchOrders();
    }, [refresh]);

    const handleComment = async () => {
        if (!comment.trim()) {
            message.warning("Comment can't be empty!");
            return;
        }
        if (!activeOrder) {
            return;
        }
        await addComment(comment, activeOrder.productDetails._id, score, activeOrder._id);
        message.success(
            'Comment submitted successfully. Thank you for your feedback!'
        );
        setComment('');
        setReviewVisible(false);
    };

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
    const handleCancelOrder = async (orderID) => {
        Modal.confirm({
            title: 'Do you want to cancel the order?',
            onOk: async () => {
                try {
                    await cancelOrder(orderID);
                    message.success('Order cancelled successfully');
                    setRefresh(!refresh);
                } catch (err) {

                    message.warning(err.response.data.message);
                    console.error(err);
                }
            }
        })
    }

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdTime',
            render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: 'Goods Name',
            dataIndex: ['productDetails', 'name'],
        },
        {
            title: 'Unit Price',
            dataIndex: ['productDetails', 'price'],
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Total',
            render: (_, record) => `${record.productDetails.price * record.quantity}$`
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
            dataIndex: 'isShipped',
            render: (_, record) => (
                <div className={'d-flex gap-2 flex-column align-items-center'}>
                    {renderStatusIcon(record.isShipped, record.isDone)}
                    {renderStatusLabel(record.isShipped, record.isDone)}
                </div>
            )
        },
        {
            title: 'Operation',
            key: 'operation',
            render: (_, record) => (
                <>
                    {!record.isDone && (
                        <div className={'d-flex gap-2'}>
                            <Button type="primary" disabled={!record.isShipped} onClick={() => {
                                setReviewVisible(true);
                                setActiveOrder(record);
                            }}>
                                Confirm receipt
                            </Button>
                            <Button onClick={() => handleCancelOrder(record._id)} type={'primary'} danger>
                                Cancel Order
                            </Button>
                        </div>
                    )}
                </>
            )
        }
    ];

    return (
        <Row justify="center">
            <Col xs={24} sm={20}>
                <Title level={2} className="text-center mt-5">Orders</Title>
                <Table className={'d-none d-md-block'} columns={columns} dataSource={orders} rowKey="_id" />
                <List
                    className={'d-md-none'}
                    dataSource={orders}
                    renderItem={item => (
                        <Card
                            className="mb-2"
                            title={`Order from ${moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}`}
                        >
                            <p><strong>Goods Name:</strong> {item.productDetails.name}</p>
                            <p><strong>Unit Price:</strong> {item.productDetails.price}$</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Total:</strong> {item.productDetails.price * item.quantity}$</p>
                            <p><strong>Delivery Address:</strong> {item.deliveryAddress}</p>
                            <p><strong>Phone Number:</strong> {item.contactNumber}</p>
                            <p>
                                <strong>Status:</strong>
                                <div className={'d-flex gap-2 flex-column align-items-center'}>
                                    {renderStatusIcon(item.isShipped, item.isDone)}
                                    {renderStatusLabel(item.isShipped, item.isDone)}
                                </div>
                            </p>
                            {!item.isDone && (
                               <div className={'d-flex gap-2'}>
                                   <Button type="primary" disabled={!item.isShipped} onClick={() => {
                                       setReviewVisible(true);
                                       setActiveOrder(item);
                                   }}>
                                       Confirm receipt
                                   </Button>
                                   <Button onClick={() => handleCancelOrder(item._id)}  type={'primary'} danger>
                                       Cancel Order
                                   </Button>
                               </div>
                            )}
                        </Card>
                    )}
                />
                <Modal
                    title="Review for Product"
                    visible={reviewVisible}
                    onCancel={() => setReviewVisible(false)}
                    footer={[
                        <Button key="submit" type="primary" onClick={handleComment}>
                            Submit
                        </Button>
                    ]}
                >
                    <Form
                        layout="vertical"
                        onFinish={handleComment}
                    >
                        <Form.Item
                            label="Enter your feedback"
                            name="comment"
                            rules={[{ required: true, message: 'Please input your comment!' }]}
                        >
                            <TextArea rows={4} value={comment} onChange={e => setComment(e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            label="Give it a score"
                            name="score"
                            rules={[{ required: true, message: 'Please assign a score!' }]}
                        >
                            <Score handleScore={setScore} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Col>
        </Row>
    );
}

export default Orders;
