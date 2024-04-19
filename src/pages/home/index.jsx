import React from 'react';
import BuyerHome from "../buyer-home/index.jsx";
import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";


function Home() {
    return (
        <Container>
            <Outlet />
        </Container>
    )
}

export default Home;
