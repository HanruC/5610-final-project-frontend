import { Navigate } from 'react-router-dom';
import useAuth from "./index.jsx";

export const ProtecedRoute = ({children}) => {
    const {authenticated} = useAuth();
    return authenticated === true ? children : <Navigate to={"/login"} replace/>;
}
