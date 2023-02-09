import React, {useEffect, useState} from "react";
import DefaultCover from "../../images/DefaultCover.jpg";
import DefaultProfile from "../../images/DefaultProfilePic.jpg";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Collected from "./ProfilePages/Collected";
import Created from "./ProfilePages/Created";
import Favorited from "./ProfilePages/Favorited";
import Activity from "./ProfilePages/Activity";
import {useAuth} from "../../Utils/context/auth-context";

const Profile = () => {
    const {currentUser, myNFTs, getNFT, mintedNFTs, WEB3, contract, host} = useAuth()
    const [NFTs, setNFTs] = useState([])
    const [mintedNFT, setMintedNFTs] = useState([])
    useEffect(() => {
        WEB3.eth.getAccounts().then((accounts) => {
            contract.methods.getNFTCount().call({from: accounts[0]}).then(res => {
                const nftCount = parseInt(res)
                let i = 0;
                setNFTs([])
                setMintedNFTs([])
                while (i < nftCount) {
                    i++;
                    contract.methods.getNFT(i).call({from: accounts[0]}).then(nftResult => {
                        const nft = {
                            id: nftResult.id,
                            title: nftResult.title,
                            description: nftResult.description,
                            price: nftResult.price/1000000,
                            creator: nftResult.creator,
                            owner: nftResult.owner,
                            image: host + nftResult.url,
                        }
                        if (nftResult.owner === accounts[0]) {
                            setNFTs(nfts => [...nfts, nft])
                        }
                        if (nft.creator === accounts[0]) {
                            setMintedNFTs(nfts => [...nfts, nft])
                        }
                    })
                }
            });
        });
    }, [1])

    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <div>
            <div style={{display: "flex"}}>
                <input
                    type={"image"}
                    src={currentUser.profileBanner}
                    alt="defaultCover"
                    width="1920px"
                    height="300px"
                />
                <input
                    style={{marginLeft: "-117rem", marginTop: "10rem"}}
                    type={"image"}
                    src={currentUser.profilePic}
                    width="200px"
                    height="200px"
                />
            </div>
            <div style={{marginLeft: "3.3rem"}}>
                <h3 style={{fontWeight: "bold"}}>{currentUser.username}</h3>
                <p>0x51f8...ccf1 &nbsp;&nbsp;&nbsp;Joined {currentUser.joinDate}</p>
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link
                            onClick={() => {
                                setSelectedTab(0);
                            }}
                        >
                            Created
                        </Nav.Link>
                    </Nav.Item>
                    
                </Nav>
                <br/>
                {selectedTab == 0 && <Collected collected={NFTs}/>}
                {selectedTab == 1 && <Created minted={mintedNFT}/>}
                {selectedTab == 2 && <Favorited/>}
                {selectedTab == 3 && <Activity/>}
            </div>
        </div>
    );
};

export default Profile;
