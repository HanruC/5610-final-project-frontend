import {createContext, useState, useContext} from 'react';

const AuthContext = createContext();

const useAuth = () => {
    const authed = Boolean(localStorage.getItem('token'));
    const [authenticated, setAuthenticated] = useState(authed);
    return {

        authenticated,
        login() {
            return new Promise(res => {
                setAuthenticated(true);
                res();
            })
        },
        logout() {
            localStorage.setItem('role', '');
            localStorage.setItem('token', '');
            return new Promise(res => {
                setAuthenticated(false);
                res();
            })
        }
    }
}

export const AuthProvider = ({children}) => {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default function AuthConsumer() {
    return useContext(AuthContext);
}
