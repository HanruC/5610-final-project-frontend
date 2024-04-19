import React, { useEffect, useState } from 'react';
import {Row, Col, Carousel, Button, Modal, Form, InputNumber, Typography, Space, message, Avatar} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addGoodsToCart, getGoodsDetail } from "../service";
import useAuth from '../../../auth/index.jsx';
import Comments from "./comments.jsx";
import {StarFilled, StarOutlined} from "@ant-design/icons";
import {authenticatedRequest} from "../../../request.js";

const { Title, Paragraph, Text } = Typography;

function GoodsDetail() {
    const { id } = useParams();
    const [goods, setGoods] = useState(null);
    const { authenticated } = useAuth();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchGoodsDetail = async () => {
            try {
                const res = await getGoodsDetail(id);
                setGoods(res.data);
            } catch (err) {
                message.error('Failed to load goods details');
                console.error(err);
            }
        };
        fetchGoodsDetail();

        const fetchIsFavorite = async () => {
            try {
                const res = await authenticatedRequest.get(`/api/favorites/${id}`);
                setIsFavorite(res.data.isFavorite);
            } catch (err) {
                console.error(err);
            }
        }
        fetchIsFavorite();
    }, [id]);

    const [quantity, setQuantity] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleClickFavorite = async () => {
        try {
            if (!authenticated) {
                Modal.confirm({
                    title: 'Please login first',
                    content: 'You need to login to add goods to favorites',
                    onOk: () => navigate('/login'),
                })
                return;
            }

            await authenticatedRequest.post(`/api/favorites`, {
                productId: id
            });
            setIsFavorite(true);
            message.success('Added to favorites successfully!')
        } catch (err) {
            console.log(err);
        }
    }

    const handleCancelFavorite = async () => {
        try {
           if (!authenticated) {
            return;
           }

            await authenticatedRequest.delete(`/api/favorites/${id}`);
            setIsFavorite(false);
            message.success('Removed from favorites successfully!')
        } catch (err) {

        }
    }


    const showAddCartModal = () => {
        if (!authenticated) {
            Modal.confirm({
                title: 'Please login first',
                content: 'You need to login to add goods to cart',
                onOk: () => navigate('/login'),
            })
            return;
        }
        setIsModalVisible(true)
    };
    const hideAddCartModal = () => setIsModalVisible(false);

    const handleAddGoodsToCart = async () => {
        if (!authenticated) {
            navigate('/login');
            return;
        }
        try {
            await addGoodsToCart(goods._id, quantity);
            message.success('Added to cart successfully!');
            hideAddCartModal();
        } catch (err) {
            message.error('Failed to add to cart');
            console.error(err);
        }
    };

    const renderCarousel = () => (
        <Carousel autoplay>
            {goods?.imageUrls.map((image, index) => (
                <div key={index}>
                    <img className="d-block w-100" src={image} alt={`slide-${index}`} />
                </div>
            ))}
        </Carousel>
    );

    return (
        <div style={{ padding: '20px' }}>
            <Modal
                title="Add To Cart"
                visible={isModalVisible}
                onOk={handleAddGoodsToCart}
                onCancel={hideAddCartModal}
                okText="Submit"
                cancelText="Cancel"
            >
                <Form.Item label="Enter quantity:">
                    <InputNumber
                        min={1}
                        value={quantity}
                        onChange={setQuantity}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Modal>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} md={12} lg={8}>
                    {goods && renderCarousel()}
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Space direction="vertical" size="large">
                        <Title>{goods?.name}</Title>
                        <div
                            onClick={() => {
                                navigate(`/profile/${goods?.vendor?._id}`)
                            }}
                            style={{fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer'}}
                            className={'d-flex align-items-center gap-2'}>
                            <Avatar src={goods?.vendor?.avatar}/>
                            <Text >
                                {goods?.vendor?.username}
                            </Text>
                        </div>
                        <Text type="danger" style={{ fontSize: '24px' }}>${goods?.price}</Text>
                        <Paragraph type="secondary">{goods?.description}</Paragraph>
                        <div className={'d-flex gap-2'}>
                            <Button type="primary" icon={<i className="bi bi-cart-check-fill"></i>} onClick={showAddCartModal}>
                                Add to Cart
                            </Button>

                            {!isFavorite && (
                                <Button type={'dashed'} onClick={handleClickFavorite} icon={<StarOutlined />}>
                                    Add to Favorites
                                </Button>
                            )}
                            {isFavorite && (
                                <Button type={'dashed'} danger onClick={handleCancelFavorite} icon={<StarFilled />}>
                                    Remove from Favorites
                                </Button>
                            )}
                        </div>
                    </Space>
                </Col>
            </Row>
            <Row justify="center" gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Comments comments={goods?.reviews || []}/>
                </Col>
            </Row>
        </div>
    );
}

export default GoodsDetail;
