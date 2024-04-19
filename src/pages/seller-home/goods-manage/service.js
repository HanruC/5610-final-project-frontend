import {authenticatedFormRequest, authenticatedRequest} from "../../../request";

export const addGoods = (goods) => {
    return authenticatedFormRequest.post("/api/goods", goods);
}

export const updateGoods = (goodsID, goods) => {
    return authenticatedFormRequest.put(`/api/goods/${goodsID}`, goods);
}

export const removeGoods = (goodsID) => {
    return authenticatedRequest.delete(`/api/goods/${goodsID}`);
}
