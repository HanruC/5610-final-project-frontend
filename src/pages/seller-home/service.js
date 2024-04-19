
import {authenticatedRequest} from "../../request";

export const getGoodsOfSeller = () => {
    return authenticatedRequest.get("/api/goods/seller/products");
}

export const getOrdersOfSeller = () => {
    return authenticatedRequest.get("/api/orders/seller/orders");
}

export const sendGoods = (orderID) => {
    return authenticatedRequest.put(`/api/orders/ship/${orderID}`)
}
