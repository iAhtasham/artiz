import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'animate.css/animate.min.css';

const MintedNFTModal = ({ nftImage, nftPrice, transactionHash, closeHandler }) => {
    return (
        <Modal show={true} onHide={closeHandler} className="animated fadeIn">
            <Modal.Header closeButton>
                <Modal.Title>Minted NFT</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6} className="minted-nft-image">
                        <img src={nftImage} alt="Minted NFT" width="200px" height="200px"/>
                    </Col>
                    <Col md={6}>
                        <Form>
                            <Form.Group controlId="nftPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="text" value={nftPrice} readOnly />
                            </Form.Group>
                            <Form.Group controlId="transactionHash">
                                <Form.Label>Transaction Hash</Form.Label>
                                <Form.Control type="text" value={transactionHash} readOnly />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeHandler}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MintedNFTModal;
