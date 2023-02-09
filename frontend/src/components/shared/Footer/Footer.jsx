import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="mt-5">
      <Card
        className="text-center"
        style={{ color: "white", backgroundColor: "rgb(24, 104, 183)" }}
      >
        <Container>
          <Row className="mt-4">
            <Col sm={5}>
              <h3 className="d-flex justify-content-start">Stay in the loop</h3>
              <p>
                Join our mailing list to stay in the loop with our newest
                feature releases, NFT drops, and tips and tricks for navigating
                OpenSea.
              </p>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Row>
                  <Col sm={7}>
                    <Form.Control
                      type="email"
                      placeholder="Your email address"
                    />
                  </Col>
                  <Col sm={4}>
                    <Button bg="primary">Sign up</Button>
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col sm={1}></Col>
            <Col sm={5}>
              <h3>Join the community</h3>
              <i className="bi bi-facebook footer-logos cursor-pointer"></i>
              <i className="bi bi-instagram footer-logos cursor-pointer"></i>
              <i className="bi bi-discord footer-logos cursor-pointer"></i>
              <i className="bi bi-reddit footer-logos cursor-pointer"></i>
              <i className="bi bi-youtube footer-logos cursor-pointer"></i>
              <i className="bi bi-tiktok footer-logos cursor-pointer"></i>
              <i className="bi bi-envelope footer-logos cursor-pointer"></i>
            </Col>
            <hr className="mt-4" />
          </Row>
          <Row className="mt-5">
            <Col sm={4}>
              <h3 className="d-flex justify-content-start">ArtiZ</h3>
              <p className="d-flex justify-content-start">
                The world’s first and largest digital marketplace for crypto
                collectibles and non-fungible tokens (NFTs). Buy, sell, and
                discover exclusive digital items
              </p>
              <p className="d-flex justify-content-start">
                Aladdin Sane Lightning Bolt is a registered trademark of
                Jones/Tintoretto Entertainment Company LLC.
              </p>
            </Col>
            <Col sm={2}>
              <b>MarketPlace</b>
              <p>All nfts</p>
              <p>All nfts</p>
              <p>All nfts</p>
            </Col>
            <Col sm={2}>
              <b>MarketPlace</b>
              <p>All nfts</p>
              <p>All nfts</p>
              <p>All nfts</p>
            </Col>
            <Col sm={2}>
              <b>MarketPlace</b>
              <p>All nfts</p>
              <p>All nfts</p>
              <p>All nfts</p>
            </Col>
            <Col sm={2}>
              <b>MarketPlace</b>
              <p>All nfts</p>
              <p>All nfts</p>
              <p>All nfts</p>
            </Col>
            <hr className="mt-4 mb-4" />
          </Row>
          <Row>
            <Col sm={3}>
              <small className="d-flex justify-content-start">
                <i className="bi bi-c-circle"></i> &nbsp;2022 - 2027 ArtiZ, Inc
              </small>
            </Col>
            <Col sm={6}></Col>
            <Col sm={3} className="mb-4">
              <small className="d-flex justify-content-end">
                Privacy Policy
              </small>
            </Col>
          </Row>
        </Container>
      </Card>
    </div>
  );
};

export default Footer;
