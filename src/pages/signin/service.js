import {authenticatedRequest} from "../../request";

export const login = (user) => {
    return authenticatedRequest.post("/api/users/signin", user);
}