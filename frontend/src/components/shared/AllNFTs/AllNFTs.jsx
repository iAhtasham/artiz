import React, {useEffect, useState} from "react";
import {Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import DropdownButton from "react-bootstrap/DropdownButton";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Killua from "../../images/killua.jpg";
import {useAuth} from "../../Utils/context/auth-context";

const AllNFTs = () => {

    let {search} = useParams();
    const Navigate = useNavigate();
    const {allNFTs, getNFT, WEB3, contract, host} = useAuth()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [NFTs, setNFTs] = useState([])
    const [Artiz, setArtiz] = useState([])


    useEffect(() => {
        WEB3.eth.getAccounts().then((accounts) => {
            contract.methods.getNFTCount().call({from: accounts[0]}).then(res => {
                const nftCount = parseInt(res)
                let i = 0;
                setArtiz([])
                while (i < nftCount) {
                    i++;
                    contract.methods.getNFT(i).call({from: accounts[0]}).then(nftResult => {
                        const nft = {
                            id: nftResult.id,
                            title: nftResult.title,
                            description: nftResult.description,
                            price: nftResult.price / 1000000,
                            creator: nftResult.creator,
                            owner: nftResult.owner,
                            image: host + nftResult.url,
                        }
                        if (search) {
                            if (nft.title.toLowerCase().includes(search.toLowerCase())
                                || nft.description.toLowerCase().includes(search.toLowerCase())) {
                                setArtiz(nfts => [...nfts, nft])
                                
                                
                            }
                        } else {
                            setArtiz(nfts => [...nfts, nft])
                            //window.location.reload(false);
                        }
                    })
                }
                //window.location.reload(false);
            });
        });

        allNFTs().then(res => {
            setNFTs([])
            if (res.data) {
                res.data.forEach(nft => {
                    getNFT(nft.contract_address, nft.token_id).then(nftDetails => {
                        if (!(NFTs.some(e => e._id === nftDetails.data._id))) {
                            if (nftDetails.data !== "error") {
                                const nft_data = nftDetails.data
                                if (nft_data.image.substring(0, 7) === "ipfs://")
                                    nft_data.image = "https://ipfs.io/ipfs/" + nft_data.image.substring(7)

                                if (search) {
                                    if (nft_data.title.toLowerCase().includes(search.toLowerCase()) 
                                        || nft_data.description.toLowerCase().includes(search.toLowerCase())) {
                                        setNFTs(NFTs => [...NFTs, nft_data])
                                       
                                    }
                                } else {
                                    setNFTs(NFTs => [...NFTs, nft_data])
                                    //window.location.reload(false);
                                }
                            }
                        }
                    })
                })
                //window.location.reload(false);
            }
        })
    }, [1])


    //temporary id for card ==> use card id coming from backend
    let id = 1;
    return (
        <>
            


            <div style={{marginLeft: "3rem"}}>
                <Row>
                    {Artiz.map(item => <Card
                        key={item.id}
                        className="allnfts-card cursor-pointer"
                        style={{width: "18rem", marginTop: "2rem", marginRight: "2rem"}}
                        onClick={() => {
                            Navigate(`/buy-page/${item.id}`);
                        }}
                    >
                        <Card.Img variant="top" width="18rem" height="200rem" style={{marginTop: "2px"}}
                                  src={item.image}/>
                        <Card.Body>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text>{item.description && item.description.length > 200 ? item.description.substring(0, 200) + "..." : item.description}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>{item.price} Eth</ListGroup.Item>
                        </ListGroup>
                    </Card>)}
                </Row>
            </div>

            <hr/>
            <div style={{marginLeft: "3rem"}}>
                <Row>
                    {NFTs.map(item => <Card
                        key={item._id}
                        className="allnfts-card cursor-pointer"
                        style={{width: "18rem", marginTop: "2rem", marginRight: "2rem"}}
                        onClick={() => {
                            Navigate(`/buy-page/${id}`);
                        }}
                    >
                        <Card.Img variant="top" width="18rem" height="200rem" style={{marginTop: "2px"}}
                                  src={item.image}/>
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>{item.description && item.description.length > 200 ? item.description.substring(0, 200) + "..." : item.description}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Unavailable</ListGroup.Item>
                        </ListGroup>
                    </Card>)}
                </Row>
            </div>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter NFTs</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {/* status */}
                    <Dropdown className="d-inline mx-2" autoClose={false}>
                        <Dropdown.Toggle id="dropdown-autoclose-false">
                            Status
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Buy Now"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="On Auction"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="New"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Has Offers"
                                style={{marginLeft: "0.5rem"}}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                    <br/>
                    <br/>
                    {/* price */}
                    <Dropdown className="d-inline mx-2" autoClose={false}>
                        <Dropdown.Toggle id="dropdown-autoclose-false">
                            Price
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#">
                                <Form>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formBasicEmail"
                                        style={{display: "flex"}}
                                    >
                                        <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            style={{width: "5rem"}}
                                        />
                                        <h3 style={{marginLeft: "1rem", marginRight: "1rem"}}>
                                            To
                                        </h3>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            style={{width: "5rem"}}
                                        />
                                    </Form.Group>
                                </Form>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <br/>
                    <br/>
                    {/* Quantity */}
                    <Dropdown className="d-inline mx-2" autoClose={false}>
                        <Dropdown.Toggle id="dropdown-autoclose-false">
                            Quantity
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Form.Check
                                type="radio"
                                label="All item"
                                id="default-radio"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="radio"
                                label="Single items"
                                id="default-radio"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="radio"
                                label="Bundles"
                                id="default-radio"
                                style={{marginLeft: "0.5rem"}}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                    <br/>
                    <br/>
                    {/* Category */}
                    <Dropdown className="d-inline mx-2" autoClose={false}>
                        <Dropdown.Toggle id="dropdown-autoclose-false">
                            Category
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Collectibles"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Domain Name"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Music"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Photography"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Sports"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Trading Cards"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Utility"
                                style={{marginLeft: "0.5rem"}}
                            />
                            <Form.Check
                                type="checkbox"
                                id="default-checkbox"
                                label="Virtual Worlds"
                                style={{marginLeft: "0.5rem"}}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default AllNFTs;
