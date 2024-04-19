import React from 'react';
import { Modal} from "react-bootstrap";

const FormModal = ({visible = false, config}) => {
    return (
        <Modal
        show={visible}
        centered>
            <Modal.Header>
                <Modal.Title>Create Goods</Modal.Title>
            </Modal.Header>
            <Modal.Body></Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>)
}

export default FormModal;
