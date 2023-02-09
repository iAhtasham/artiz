import React from "react";
import {Row, Col} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {useNavigate} from "react-router-dom";

const Created = (props) => {
    const minted = props.minted
    const Navigate = useNavigate()
    console.log(minted)
    return (
        <div>
            <Row>
                <Col sm={10}>
  
                </Col>
                <Col sm={2}>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Recently created
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-2">Recently created</Dropdown.Item>
                            <Dropdown.Item href="#/action-1">Recently listed</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Recently sold</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Recently received</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <div>
                    <div style={{marginLeft: "3rem"}}>
                        <Row>
                            {minted.map(item => <Card
                                key={item.id}
                                className="allnfts-card cursor-pointer"
                                style={{width: "18rem", marginTop: "2rem", marginRight: "2rem"}}
                                onClick={() => {
                                    Navigate(`/buy-page/${id}`);
                                }}
                            >
                                <Card.Img variant="top" width="18rem" height="200rem" style={{marginTop:"2px"}} src={item.image}/>
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>{item.price} Eth</ListGroup.Item>
                                </ListGroup>
                            </Card>)}
                        </Row>
                    </div>
                </div>
            </Row>
        </div>
    );
};

export default Created;
