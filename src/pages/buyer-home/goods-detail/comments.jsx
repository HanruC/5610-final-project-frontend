import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import moment from "moment";
import {useNavigate} from "react-router-dom";

function Comments({comments = []}) {
    const navigate = useNavigate();
    const renderScore = (score) => {
        let fullStars = [];
        for (let i = 0; i < score; i ++) {
            fullStars.push(<i className="bi bi-star-fill me-1" key={i} style={{color: 'orange'}}></i>)
        }
        return fullStars;
    }

    const renderComments = () => {
        return comments.map(comment => {
            return <div className="border p-3" key={comment._id}>
                <Row>
                    <Col
                        onClick={() => {
                            navigate(`/profile/${comment.customerId._id}`)
                        }}
                        lg={"2"} className="d-flex align-items-center text-decoration-underline"
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        <i className="bi bi-person-circle me-2" style={{fontSize: "35px"}}></i>
                        <h4 className="me-2">{comment.customerId.username}</h4>
                    </Col>
                </Row>
                <Row>
                    <p>{comment.text}</p>
                    <h5>
                        {renderScore(comment.rating)}
                    </h5>
                    <small style={{color:"gray"}}>
                        {moment(comment.postedAt).format('YYYY-MM-DD HH:mm:ss')}
                    </small>
                </Row>
            </div>
        })
    }
    return (
        <Container className={'mt-3'}>
            {comments.length > 0 ? renderComments() : 'No Comments Yet'}

        </Container>)
}
export default Comments;
