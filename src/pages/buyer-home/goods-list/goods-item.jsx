import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Form, InputNumber, message, Row, Col } from 'antd';
import { addGoodsToCart } from "../service";

function GoodsItem({ goods }) {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleClickGoods = () => {
        navigate(`/goods/${goods._id}`);
    };

    const showAddCartModal = () => {
        setIsModalVisible(true);
    };

    const handleAddGoodsToCart = async () => {
        try {
            await addGoodsToCart(goods._id, quantity);
            message.success('Add Successfully!');
            setIsModalVisible(false);
        } catch (error) {
            message.error('Failed to add to cart');
            console.error(error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Modal
                title="Add To Cart"
                visible={isModalVisible}
                onOk={handleAddGoodsToCart}
                onCancel={handleCancel}
                okText="Submit"
                cancelText="Cancel"
            >
                <Form layout="vertical">
                    <Form.Item label="Enter quantity:">
                        <InputNumber
                            min={1}
                            value={quantity}
                            onChange={value => setQuantity(value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={goods.imageUrls[0]} onClick={handleClickGoods} />}
            >
                <Card.Meta
                    title={`$ ${goods.price}`}
                    description={goods.name}
                    onClick={handleClickGoods}
                />
            </Card>
        </>
    );
}

export default GoodsItem;
