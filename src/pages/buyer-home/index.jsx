import React from 'react';
import {Col, Container, Row, Button} from "react-bootstrap";
import {Link, Outlet, useLocation} from 'react-router-dom';
import navs from './navs';
import useAuth from '../../auth/index.jsx'
function BuyerHome() {
    const {logout} = useAuth();
    const location = useLocation();


    return (
        <Container fluid>
            <Row>
                <Outlet />
            </Row>
        </Container>
    )
}

export default BuyerHome;
