import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {AuthProvider} from "./auth/index.jsx";
import {ProtecedRoute} from "./auth/protecedRoute.jsx";
import Signin from "./pages/signin/index.jsx";
import Signup from "./pages/signup/index.jsx";
import BuyerHome from "./pages/buyer-home/index.jsx";
import GoodsList from "./pages/buyer-home/goods-list/index.jsx";
import GoodsDetail from "./pages/buyer-home/goods-detail/index.jsx";
import Carts from "./pages/buyer-home/carts/index.jsx";
import Orders from "./pages/buyer-home/orders/index.jsx";
import SellerHome from "./pages/seller-home/index.jsx";
import GoodsManage from "./pages/seller-home/goods-manage/index.jsx";
import OrdersManage from "./pages/seller-home/orders-manage/index.jsx";
import Home from "./pages/home/index.jsx";
import AppHeader from "./components/AppHeader.jsx";
import Profile from "./pages/profile/Profile.jsx";
import PublicProfile from "./pages/profile/PublicProfile.jsx";
import Favorites from "./pages/favorites/Favorite.jsx";

function App() {
    const role = localStorage.getItem('role');
    const homePath = role === 'seller' ? '/seller' : '/home';
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppHeader />
                <main >
                    <Routes>
                        <Route exact path="/" element={<Home />}>
                            <Route path={''} index element={<Navigate to={'home'}/>}/>
                            <Route path={"home"} element={<GoodsList/>}/>
                            <Route path={"goods/:id"} element={<GoodsDetail/>}/>
                            <Route path={"cart"} element={
                                <ProtecedRoute>
                                    <Carts/>
                                </ProtecedRoute>
                            }/>
                            <Route path={"orders"} element={
                                <ProtecedRoute>
                                    <Orders/>
                                </ProtecedRoute>
                            }/>
                            <Route path={"favorites"} element={
                                <ProtecedRoute>
                                    <Favorites />
                                </ProtecedRoute>
                            }/>

                        </Route>
                        <Route path={'/profile'} element={
                            <ProtecedRoute>
                                <Profile />
                            </ProtecedRoute>
                        }/>
                        <Route path={'/profile/:userId'} element={
                            <PublicProfile />
                        }/>
                        <Route path={"/seller"} element={<ProtecedRoute><SellerHome/></ProtecedRoute>}>
                            <Route index element={<Navigate to={"products"}/>}/>
                            <Route path={"products"} element={<GoodsManage/>}/>
                            <Route path={"orders"} element={<OrdersManage/>}/>
                        </Route>
                        <Route path={"/login"} element={<Signin/>}/>
                        <Route path={"/register"} element={<Signup/>}/>

                    </Routes>
                </main>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
