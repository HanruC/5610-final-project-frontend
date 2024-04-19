import {authenticatedRequest} from "../../request";

export const getGoods = (query = '') => {
    return authenticatedRequest.get('/api/goods');
}

export const searchGoods = (query = '') => {
    return authenticatedRequest.get(`/api/goods/search/${query}`);
}

export const getGoodsDetail = (id) => {
    return authenticatedRequest.get(`/api/goods/${id}`);
}

export const addGoodsToCart = (goodsId, quantity) => {
    return authenticatedRequest.post(`/api/cart/items`, {
        goodsId,
        quantity
    })
}

export const getCartGoods = () => {
    return authenticatedRequest.get('/api/cart/items')
}

export const removeGoodsFromCart = (ids) => {
    return authenticatedRequest.put(`/api/cart/items/remove`, {
        productIds: ids
    })
}

export const orderCart = (cartItems, userInfo) => {
    return authenticatedRequest.post(`/api/orders/cart-items`, {
        cartItems,
        userInfo
    })
}

export const getOrders = () => {
    return authenticatedRequest.get(`/api/orders`);
}


export const cancelOrder = (orderId) => {
    return authenticatedRequest.delete(`/api/orders/${orderId}`);
}
export const addComment = (text, productId, rating, orderId) => {
    return authenticatedRequest.post('/api/comments/review', {
        productId,
        text,
        rating,
        orderId
    })
}
