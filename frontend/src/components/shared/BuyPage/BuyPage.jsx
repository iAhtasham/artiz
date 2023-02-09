import React, {useEffect, useState} from "react";
import {Row, Col, Container} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Asuki from "../../images/Asuki.avif";
import NyanCat from "../../images/NyanCat.gif";
import "./BuyPage.css";
import {useAuth} from "../../Utils/context/auth-context";
import Table from "react-bootstrap/Table";

const Web3 = require('web3');

const BuyPage = () => {
    let {id} = useParams();
    const {
        currentUser,
        WEB3,
        contract,
        makeOffer,
        allOffers,
        accept,
        decline,
        process,
        host
    } = useAuth()
    const [nft, setNFT] = useState(null)
    const navigate = useNavigate()
    const [offers, setOffers] = useState(null)
    console.log(nft)
    useEffect(() => {
        WEB3.eth.getAccounts().then((accounts) => {
            contract.methods.getNFT(id).call({from: accounts[0]}).then(nftResult => {
                const nft = {
                    id: nftResult.id,
                    title: nftResult.title,
                    description: nftResult.description,
                    price: nftResult.price / 1000000,
                    creator: nftResult.creator,
                    owner: nftResult.owner,
                    image: host + nftResult.url,
                }
                setNFT(nft);
                allOffers(nftResult.id).then(res => {
                    setOffers(res.data)
                })
            })
        });
    }, [1])


    function onMakeOfferBtnClicked(event) {
        if (!currentUser) {
            navigate("/login")
            return;
        }
        event.preventDefault()
        const amount = event.target[0].value;

        const offer = {
            price: amount,
            nft: nft.id,
        }
        makeOffer(offer).then(res => {
            if (res.data === "ok") {
                window.location.reload(false)
            }
        })
    }

    function onAcceptBtnClicked(id) {
        accept(id).then(res => {
            window.location.reload(false)
        })
    }

    function onDeclineBtnClicked(id) {
        decline(id).then(res => {
            window.location.reload(false)
        })
    }

    function onProcessBtnClicked(offer) {
        const price = parseInt(parseFloat(offer.offerPrice) * 1000000)
        console.log(price)
        WEB3.eth.getAccounts().then(accounts => {
            const web3 = new Web3(window.ethereum);
            web3.eth.sendTransaction({
                from: accounts[0],
                to: nft.owner,
                value: price
            }, function (err, transactionHash) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(transactionHash);
                    contract.methods.transfer(nft.id, nft.owner, price).send({from: accounts[0]}).then(res => {
                        console.log(res)
                        process(offer._id).then(r => {
                            window.location.reload(false);
                        })
                    })
                }
            });

        })
    }

    if (nft && currentUser) {
        console.log(nft.owner.toUpperCase(), currentUser.address.toUpperCase())
    }

    return (
        <div>
            {nft && <Container className="mt-5">
                <Row>
                    {/* Image */}
                    <Col sm={5}>
                        <Card>
                            <Card.Header>{nft.title}</Card.Header>
                            <img src={nft.image} alt="img" width="524px" height="500px"/>
                        </Card>
                        <Card style={{width: "33rem"}} className="mt-4">
                            <ListGroup variant="flush">
                                <ListGroup.Item style={{height: "4rem"}}>
                                    <b> {nft.description}</b>
                                </ListGroup.Item>
                                <ListGroup.Item style={{height: "5rem"}}>
                                    <b>By {nft.creator}</b>
                                </ListGroup.Item>

                                <ListGroup.Item style={{height: "4rem"}}>
                                    <div className="dropdown">
                                        <p
                                            className="btn transparent dropdown-toggle text-start about-left"
                                            type="button"
                                            id="dropdownMenuButton1"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <b>About {nft.title}</b>
                                        </p>
                                        <ul
                                            className="dropdown-menu"
                                            aria-labelledby="dropdownMenuButton1"
                                        >
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <img
                                                        src={NyanCat}
                                                        alt="nyancat"
                                                        width={"80px"}
                                                        height={"80px"}
                                                    />
                                                    {nft.description}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item style={{height: "4rem"}}>
                                    <div className="dropdown">
                                        <p
                                            className="btn transparent dropdown-toggle text-start about-left"
                                            type="button"
                                            id="dropdownMenuButton1"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <b>Details</b>
                                        </p>
                                        <ul
                                            className="dropdown-menu"
                                            aria-labelledby="dropdownMenuButton1"
                                        >
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <Row style={{width: "30.4rem"}}>
                                                        <Col sm={2}>
                                                            <ul>Contract Address</ul>
                                                            <ul>Token ID</ul>
                                                            <ul>Token Standard</ul>
                                                            <ul>Blockchain</ul>
                                                            <ul>Metadata</ul>
                                                            <ul>Creator Earnings</ul>
                                                        </Col>
                                                        <Col sm={6}></Col>
                                                        <Col sm={2}>
                                                            <ul>0x495f...7b5e</ul>
                                                            <ul>546616271946</ul>
                                                            <ul>ERC-1155</ul>
                                                            <ul>Ethereum</ul>
                                                            <ul>Centralized</ul>
                                                            <ul>3%</ul>
                                                        </Col>
                                                    </Row>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    {/* Right Side of Image */}
                    <Col sm={7}>
                        <Row>
                            <Col sm={4}>
                                <br/>
                                <b style={{fontSize: "2rem"}}>{nft.title}</b>
                                <br/>
                                <p>Owned by {nft.owner}</p>
                                <br/>
                            </Col>
                            <Col sm={4}></Col>
                            <Col sm={4}></Col>
                        </Row>
                        <Row>
                            <Card style={{width: "60rem"}}>
                                <ListGroup variant="flush">

                                    <ListGroup.Item style={{height: "16rem"}}>
                                        Current price <br/>
                                        <b style={{fontSize: "2rem"}}>{nft.price} Eth</b>
                                        <br/>
                                        <br/>
                                        <Row>
                                            <Col sm={12}>
 {currentUser && currentUser.address.toLowerCase() !== nft.owner.toLowerCase() &&
    <Button
                                                    className="make-offer"
                                                    variant="transparent"
                                                    style={{
                                                        border: "1px solid lightgrey",
                                                        fontWeight: "bold",
                                                        color: "blue",
                                                    }}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModal"
                                                >
                                                    Make offer
                                                </Button>
 }
                                                
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Row>
                        <Row className="mt-4">

                            <Card body className="mt-3">
                                <div className="btn-group dropdown">
                                    <button
                                        type="button"
                                        className="btn transparent dropdown-toggle text-start btn-right"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <b>Offers</b>
                                    </button>
                                    <ul className="dropdown-menu"></ul>
                                </div>
                                {offers && <div style={{width: "100%"}}>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                        <tr>
                                            <th style={{maxWidth: "200px"}}>Offered By</th>
                                            <th>Offered Price</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Accept</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {offers.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.offeredBy}</td>
                                                <td>{item.offerPrice}</td>
                                                <td>{item.offerTime}</td>
                                                <td>{item.status}</td>
                                                <td>
                                                    {currentUser && nft && <div>
                                                        {item.status && item.status === "pending"
                                                        && nft.owner && currentUser.address
                                                        && nft.owner.toUpperCase() === currentUser.address.toUpperCase() &&
                                                        <div className="d-inline-flex">
                                                            <button onClick={() => {
                                                                onAcceptBtnClicked(item._id)
                                                            }}
                                                                    className="btn btn-primary m-2">&#10004;</button>
                                                            <button onClick={() => {
                                                                onDeclineBtnClicked(item._id)
                                                            }}
                                                                    className="btn btn-primary m-2">&#9587;</button>
                                                        </div>
                                                        }
                                                        {item.status && item.status === "accepted"
                                                        && item.offeredBy && currentUser.address
                                                        && item.offeredBy.toUpperCase() === currentUser.address.toUpperCase() &&
                                                        <div className="d-inline-flex">
                                                            <button onClick={() => {
                                                                onProcessBtnClicked(item)
                                                            }}
                                                                    className="btn btn-primary m-2">&#10004;</button>
                                                        </div>
                                                        }
                                                    </div>}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>


                                </div>}
                            </Card>
                        </Row>
                    </Col>
                </Row>
                <div
                    className="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Make an offer
                                </h5>
                            </div>
                            <form onSubmit={onMakeOfferBtnClicked}>
                                <div className="modal-body">
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1">Eth</InputGroup.Text>
                                        <Form.Control
                                            placeholder="Amount"
                                            type="number"
                                            step="any"
                                            required
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        Make offer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>}
        </div>
    );
};

export default BuyPage;
