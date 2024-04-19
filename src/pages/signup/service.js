import {authenticatedRequest} from "../../request";

export const register = (user) => {
    return authenticatedRequest.post("/api/users/signup", user);
}