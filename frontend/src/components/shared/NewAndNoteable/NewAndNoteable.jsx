import React, {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import nftimage from "../../images/killua.jpg";
import Button from "react-bootstrap/Button";
import ReactCardSlider from "react-card-slider-component";
import {useAuth} from "../../Utils/context/auth-context";

const NewAndNoteable = () => {
    const {currentUser, WEB3, contract, host} = useAuth()
    const [nftList, setNFTs] = useState([])
    const LIMIT = 3;

    useEffect(() => {
        WEB3.eth.getAccounts().then((accounts) => {
            contract.methods.getNFTCount().call({from: accounts[0]}).then(res => {
                const nftCount = parseInt(res)
                let i = 0;
                setNFTs([])
                while (i < nftCount && i < LIMIT) {
                    i++;
                    contract.methods.getNFT(i).call({from: accounts[0]}).then(nftResult => {
                        const nft = {
                            id: nftResult.id,
                            title: nftResult.title,
                            description: nftResult.description,
                            price: nftResult.price,
                            creator: nftResult.creator,
                            owner: nftResult.owner,
                            image: host + nftResult.url,
                        }
                        setNFTs(nfts => [...nfts, nft])
                    })
                }
            });
        });
    }, [1])

    console.log(nftList)

    return (
        <div className="mt-5">
            <h1 style={{fontWeight: "bold"}}>New and Noteable</h1>
            <Container className="mt-2">
                <ReactCardSlider slides={nftList}/>
            </Container>
        </div>
    );
};

export default NewAndNoteable;
