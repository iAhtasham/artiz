import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Container, Row, Col, Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../images/logo.png";
import killua from "../images/killua.jpg";
import BackgroundImg from "./BackgroundImg/BackgroundImg";
import Offcanvas from "react-bootstrap/Offcanvas";
import {useAuth} from "../Utils/context/auth-context";
import "./NavigationBar.css";

const NavigationBar = () => {
    const {currentUser} = useAuth()
    const Navigate = useNavigate();
    const {getCurrentUser, logout} = useAuth()
    const [navbar, setNavbar] = useState(false);
    const [show, setShow] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseCart = () => setShowCart(false);
    const handleShowCart = () => setShowCart(true);


    const changeBackground = () => {
        if (window.scrollY >= 80) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    window.addEventListener("scroll", changeBackground);

    const handleKeyDown = (event) => {
        const query = event.target[0].value
        if (query.length > 0) {
           window.location.replace("http://localhost:3000/all-nfts/"+query);
        } else {
            
           //window.open("localhost:3000/all-nfts");
           window.location.replace("http://localhost:3000/all-nfts");
            //Navigate("/all-nfts")
        }
        event.preventDefault()
    }
    return (
        <>
            <Navbar
                bg="*"
                variant="none"
                expand="lg"
                fixed="top"
                className={navbar ? "nav-effect active" : "nav-effect"}
                style={{paddingLeft: "15rem"}}
            >
                <Container fluid style={{width: "100%"}}>
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            Navigate("/");
                        }}
                    >
                        <Navbar.Brand>
                            <img className="img-fluid" src={Logo} width="38px" alt="logo"/>
                        </Navbar.Brand>
                        <span
                            className={
                                navbar
                                    ? "txt-color active nav-logo-span"
                                    : "txt-color nav-logo-span"
                            }
                        >
              ArtiZ
            </span>
                    </div>
                    <Navbar.Toggle aria-controls="navbarScroll"/>
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{maxHeight: "100px"}}
                            navbarScroll
                        >
                            {/* search */}
                            <Form className="d-flex form-style" onSubmit={handleKeyDown}>
                                <Form.Control
                                    className="bg-light form-control-style"
                                    type="text"
                                    placeholder="Search items, collections, and accounts"
                                    style={{
                                        width: "45rem",
                                        height: "2.5rem",
                                    }}
                                />
                            </Form>
                            {/* Home */}
                            <p
                                className={
                                    navbar
                                        ? "dropbtn txt-color active cursor-pointer home-style"
                                        : "dropbtn txt-color cursor-pointer home-style"
                                }
                                onClick={() => {
                                    Navigate("/");
                                }}
                            >
                                Home
                            </p>
                            {/* Explore */}
                            <div className="dropdown">
                                <p
                                    className={
                                        navbar
                                            ? "dropbtn txt-color active cursor-pointer explore-style"
                                            : "dropbtn txt-color cursor-pointer explore-style"
                                    }
                                >
                                    Explore
                                </p>
                                <div className="dropdown-content">
                                    <a
                                        className="cursor-pointer"
                                        onClick={() => {
                                            Navigate("/all-nfts");
                                        }}
                                    >
                                        All NFTs
                                    </a>
                                </div>
                            </div>

                            {/* Create*/}
                            <p
                                className={
                                    navbar
                                        ? "dropbtn txt-color active cursor-pointer home-style"
                                        : "dropbtn txt-color cursor-pointer home-style"
                                }
                                onClick={() => {
                                    Navigate("/create-catelog");
                                }}
                            >
                                Create
                            </p>
                            {/* Profile */}
                            <div className="dropdown">
                                <p
                                    className={
                                        navbar
                                            ? "dropbtn txt-color active cursor-pointer explore-style"
                                            : "dropbtn txt-color cursor-pointer explore-style"
                                    }
                                >
                                    <i
                                        style={{fontSize: "20px"}}
                                        className="bi bi-person-circle"
                                    />
                                </p>
                                {currentUser ? <div className="dropdown-content">
                                    <a
                                        className="cursor-pointer"
                                        onClick={() => {
                                            Navigate("/profile");
                                        }}
                                    >
                                        Profile
                                    </a>

                                    <a
                                        className="cursor-pointer"
                                        onClick={() => {
                                            Navigate("/settings");
                                        }}
                                    >
                                        Settings
                                    </a>
                                    <a
                                        className="cursor-pointer"
                                        onClick={() => {
                                            logout().then(res => {
                                                getCurrentUser()
                                                Navigate("/profile")
                                            })
                                        }}
                                    >
                                        Logout
                                    </a>
                                </div> : <div className="dropdown-content">
                                    <a
                                        className="cursor-pointer"
                                        onClick={() => {
                                            Navigate("/login");
                                        }}
                                    >
                                        Login
                                    </a></div>}
                            </div>
                            {/* Wallet */}
                            <p
                                style={{
                                    marginLeft: "2rem",
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}
                                className={
                                    navbar
                                        ? "dropbtn txt-color active cursor-pointer"
                                        : "dropbtn txt-color cursor-pointer"
                                }
                                onClick={handleShow}
                            >
                                <i className="bi bi-wallet-fill"></i>
                            </p>
                            <Offcanvas show={show} onHide={handleClose} placement="end">
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>
                                        <i className="bi bi-person-circle"></i> <b> My Wallet</b>
                                        <hr style={{width: "16vw"}}/>
                                    </Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <p>
                                        If you don't have a <b>wallet</b> yet, you can select a
                                        provider and create one now.
                                    </p>
                                    <b
                                        className="cursor-pointer"
                                        onClick={() => {
                                            // handle login
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="50"
                                            height="50"
                                            viewBox="0 0 212 189"
                                        >
                                            <g fill="none" fill-rule="evenodd">
                                                <polygon
                                                    fill="#CDBDB2"
                                                    points="60.75 173.25 88.313 180.563 88.313 171 90.563 168.75 106.313 168.75 106.313 180 106.313 187.875 89.438 187.875 68.625 178.875"
                                                />
                                                <polygon
                                                    fill="#CDBDB2"
                                                    points="105.75 173.25 132.75 180.563 132.75 171 135 168.75 150.75 168.75 150.75 180 150.75 187.875 133.875 187.875 113.063 178.875"
                                                    transform="matrix(-1 0 0 1 256.5 0)"
                                                />
                                                <polygon
                                                    fill="#393939"
                                                    points="90.563 152.438 88.313 171 91.125 168.75 120.375 168.75 123.75 171 121.5 152.438 117 149.625 94.5 150.188"
                                                />
                                                <polygon
                                                    fill="#F89C35"
                                                    points="75.375 27 88.875 58.5 95.063 150.188 117 150.188 123.75 58.5 136.125 27"
                                                />
                                                <polygon
                                                    fill="#F89D35"
                                                    points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813"
                                                />
                                                <polygon
                                                    fill="#D87C30"
                                                    points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375"
                                                />
                                                <polygon
                                                    fill="#EA8D3A"
                                                    points="46.125 101.813 65.25 119.813 65.25 137.813"
                                                />
                                                <polygon
                                                    fill="#F89D35"
                                                    points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375"
                                                />
                                                <polygon
                                                    fill="#EB8F35"
                                                    points="65.25 138.375 60.75 173.25 90.563 152.438"
                                                />
                                                <polygon
                                                    fill="#EA8E3A"
                                                    points="92.25 102.375 95.063 150.188 86.625 125.719"
                                                />
                                                <polygon
                                                    fill="#D87C30"
                                                    points="39.375 138.938 65.25 138.375 60.75 173.25"
                                                />
                                                <polygon
                                                    fill="#EB8F35"
                                                    points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75"
                                                />
                                                <polygon
                                                    fill="#E8821E"
                                                    points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938"
                                                />
                                                <polygon
                                                    fill="#DFCEC3"
                                                    points="60.75 173.25 90.563 152.438 88.313 170.438 88.313 180.563 68.063 176.625"
                                                />
                                                <polygon
                                                    fill="#DFCEC3"
                                                    points="121.5 173.25 150.75 152.438 148.5 170.438 148.5 180.563 128.25 176.625"
                                                    transform="matrix(-1 0 0 1 272.25 0)"
                                                />
                                                <polygon
                                                    fill="#393939"
                                                    points="70.313 112.5 64.125 125.438 86.063 119.813"
                                                    transform="matrix(-1 0 0 1 150.188 0)"
                                                />
                                                <polygon
                                                    fill="#E88F35"
                                                    points="12.375 .563 88.875 58.5 75.938 27"
                                                />
                                                <path
                                                    fill="#8E5A30"
                                                    d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z"
                                                />
                                                <g transform="matrix(-1 0 0 1 211.5 0)">
                                                    <polygon
                                                        fill="#F89D35"
                                                        points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813"
                                                    />
                                                    <polygon
                                                        fill="#D87C30"
                                                        points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375"
                                                    />
                                                    <polygon
                                                        fill="#EA8D3A"
                                                        points="46.125 101.813 65.25 119.813 65.25 137.813"
                                                    />
                                                    <polygon
                                                        fill="#F89D35"
                                                        points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375"
                                                    />
                                                    <polygon
                                                        fill="#EB8F35"
                                                        points="65.25 138.375 60.75 173.25 90 153"
                                                    />
                                                    <polygon
                                                        fill="#EA8E3A"
                                                        points="92.25 102.375 95.063 150.188 86.625 125.719"
                                                    />
                                                    <polygon
                                                        fill="#D87C30"
                                                        points="39.375 138.938 65.25 138.375 60.75 173.25"
                                                    />
                                                    <polygon
                                                        fill="#EB8F35"
                                                        points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75"
                                                    />
                                                    <polygon
                                                        fill="#E8821E"
                                                        points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938"
                                                    />
                                                    <polygon
                                                        fill="#393939"
                                                        points="70.313 112.5 64.125 125.438 86.063 119.813"
                                                        transform="matrix(-1 0 0 1 150.188 0)"
                                                    />
                                                    <polygon
                                                        fill="#E88F35"
                                                        points="12.375 .563 88.875 58.5 75.938 27"
                                                    />
                                                    <path
                                                        fill="#8E5A30"
                                                        d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z"
                                                    />
                                                </g>
                                            </g>
                                        </svg>
                                        &nbsp;&nbsp;&nbsp;MetaMask
                                    </b>
                                </Offcanvas.Body>
                            </Offcanvas>

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <BackgroundImg/>
        </>
    );
};

export default NavigationBar;
