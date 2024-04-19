import React, { useEffect, useState } from 'react';
import {Row, Col, Input, Button, Form, message, Empty} from 'antd';
import GoodsItem from "./goods-item.jsx";
import { getGoods, searchGoods } from "../service";

function GoodsList() {
    const [goods, setGoods] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const res = await getGoods();
                setGoods(res.data);
            } catch (err) {
                message.error('Failed to load goods');
                console.error(err);
            }
        };
        fetchGoods();
    }, []);

    const handleClickSearch = async () => {
        try {
            const res = query ? await searchGoods(query) : await getGoods();
            setGoods(res.data);
        } catch (err) {
            message.error('Failed to perform search');
            console.error(err);
        }
    };

    const renderGoodsList = () => {
        return goods.map(item => (
            <div key={item._id} style={{ margin: '10px' }}>
                <GoodsItem goods={item} />
            </div>
        ));
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Form layout="inline" onFinish={handleClickSearch}>
                        <Form.Item>
                            <Input
                                placeholder="Enter the keyword"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <h2>Goods List</h2>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24} style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {renderGoodsList()}
                    {goods.length === 0 && <Empty />}
                </Col>
            </Row>
        </div>
    );
}

export default GoodsList;
