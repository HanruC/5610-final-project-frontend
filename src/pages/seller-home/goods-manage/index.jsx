import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Table,
    Popconfirm,
    message,
    Upload,
    Row,
    Col,
    Card,
    Carousel
} from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import { getGoodsOfSeller } from '../service';
import {addGoods, removeGoods, updateGoods} from './service';

const GoodsManage = () => {
    const [loadGoods, setLoadGoods] = useState(true);
    const [goods, setGoods] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [currentGoods, setCurrentGoods] = useState(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const res = await getGoodsOfSeller();
                const data = res.data;
                setGoods(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchGoods();
    }, [loadGoods]);

    const handleSubmit = async (values) => {
        try {
            const formData = {
                name: values.name,
                price: values.price,
                description: values.description,
                imageNames: values.images.fileList.map((image, index) => `image${index + 1}`).join(','),
            };
            Array.from(values.images.fileList).forEach((image, index) => {
                formData[`image${index + 1}`] = image.originFileObj;
            });
            console.log('formData', formData)

            if (!isEdit) {
                await addGoods(formData);
                message.success('Create goods successfully!');
            } else {
                await updateGoods(currentGoods._id, formData);
                message.success('Update goods successfully!');
            }


            setOpen(false)
            setLoadGoods(!loadGoods);
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditGoods = async (product) => {
        setOpen(true);
        setIsEdit(true);
        setCurrentGoods(product);
    }

    const handleRemoveGoods = async (goodsID) => {
        try {
            Modal.confirm({
                title: 'Do you want to remove this goods?',
                onOk() {
                    removeGoods(goodsID).then(() => {
                        message.success('Remove goods successfully!');
                        setLoadGoods(!loadGoods);
                    });
                },
                onCancel() {
                    console.log('Cancel');
                },
            })
        } catch (err) {
            console.log(err);
        }
    };



    return (
        <>
            <Modal
                destroyOnClose
                title={isEdit ? 'Edit Goods' : 'Create Goods'}
                visible={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Form
                    preserve={false}
                    initialValues={currentGoods}
                    name="addGoodsForm"
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Goods Name"
                        rules={[{ required: true, message: 'Please enter the goods title' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Goods Price"
                        rules={[{ required: true, message: 'Please enter the goods price' }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Goods Description"
                        rules={[
                            { required: true, message: 'Please enter the goods introduction' },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        name="images"
                        label="Goods Images"
                        rules={[
                            { required: true, message: 'Please upload the goods images' },
                        ]}
                    >
                        <Upload
                            listType="picture-card"
                            multiple
                            showUploadList={{
                                showRemoveIcon: true,
                            }}
                        >
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Row gutter={16}>
                            <Col>
                                {!isEdit && (
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Create
                                    </Button>
                                )}
                                {isEdit && (
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Update
                                    </Button>
                                )}
                            </Col>
                            <Col>
                                <Button onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>

            <Row justify="start" className={'mb-2'} gutter={16}>
                <Col>
                    <Button
                        type="primary"
                        onClick={() => {
                            setOpen(true);
                            setIsEdit(false);
                            setCurrentGoods(null);
                        }}
                        icon={<PlusOutlined />}
                    >
                        Add Goods
                    </Button>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {goods.map(product => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                        <Card
                            hoverable
                            cover={
                                <Carousel autoplay>
                                    {product.imageUrls.map((url, index) => (
                                        <div key={index}>
                                            <img src={url} alt={`Product ${index}`} style={{ width: '100%' }} />
                                        </div>
                                    ))}
                                </Carousel>
                            }
                        >
                            <Card.Meta
                                title={product.name}
                                description={product.description}
                            />
                            <p>Price: ${product.price}</p>
                            <p>Total Sales: {product.totalSales}</p>
                            <p className={'d-flex gap-2'}>
                                <Button onClick={() => {
                                    handleEditGoods(product)
                                }} type={'primary'}>
                                    Edit
                                </Button>

                                <Button onClick={() => {
                                    handleRemoveGoods(product._id)
                                }} type={'primary'} danger>
                                    Remove
                                </Button>
                            </p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default GoodsManage;
