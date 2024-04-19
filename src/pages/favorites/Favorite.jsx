import { useEffect, useState } from "react";
import { authenticatedRequest } from "../../request.js";
import {Card, Col, Empty, Row} from "antd";
import Meta from "antd/es/card/Meta";
import {useNavigate} from "react-router-dom";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await authenticatedRequest.get("/api/favorites");
                setFavorites(res.data);
            } catch (err) {}
        };
        fetchFavorites();
    }, []);

    return (
        <div className={"mt-2"}>
            <h1>Favorites</h1>
            <Row gutter={[16, 16]}>
                {favorites.length === 0 && (
                    <Empty />
                )}
                {favorites.map((favorite) => (
                    <Col key={favorite._id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            onClick={() => {
                                navigate(`/goods/${favorite.product._id}`);
                            }}
                            hoverable
                            cover={
                                <img
                                    alt={favorite.product.name}
                                    src={favorite.product.imageUrls[0]}
                                />
                            }
                        >
                            <Meta
                                title={favorite.product.name}
                                description={`$${favorite.product.price}`}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
