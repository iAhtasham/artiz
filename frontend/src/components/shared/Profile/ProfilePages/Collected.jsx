import React from "react";
import {Row, Col} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Killua from "../../../images/killua.jpg";
import ListGroup from "react-bootstrap/ListGroup";


const Collected = (props) => {
    const Navigate = useNavigate()
    const collected = props.collected
    console.log(collected)
    return (
        <div>
            <Row>
                <Col sm={10}>
  
                </Col>
                <Col sm={2}>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Recently received
                        </Dropdown.Toggle>

           
                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <div>
                    <div style={{marginLeft: "3rem"}}>
                        <Row>
                            {collected.map(item => <Card
                                key={item.id}
                                className="allnfts-card cursor-pointer"
                                style={{width: "18rem", marginTop: "2rem", marginRight: "2rem"}}
                                onClick={() => {
                                    Navigate(`/buy-page/${item.id}`);
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

export default Collected;
