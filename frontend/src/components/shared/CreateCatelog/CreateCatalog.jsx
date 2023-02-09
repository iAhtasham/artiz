import React, {useEffect, useState} from "react";
import {Container, Row, Col, Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {useAuth} from "../../Utils/context/auth-context";
import {useNavigate} from "react-router-dom";
import MintedNFTModal from "./MintedNFTModal";

const CreateCatalog = () => {
    const {mintNFT, currentUser, WEB3, contract, confirmMinted, host} = useAuth()
    const [file, setFile] = useState()
    const Navigate = useNavigate()
    const [minted, setMinted] = useState(null)
    const [loading, setLoading] = useState(false)

    function uploadFile(event) {
        event.preventDefault();
        if (file == null)
            return
        const document = {
            name: event.target[1].value,
            description: event.target[2].value,
            document: file,
            price: event.target[3].value,
        }
        console.log(document)
        setLoading(true);
        mintNFT(document).then(res => {

            const nft = res.data;
            console.log(nft)
            WEB3.eth.getAccounts().then((accounts) => {
                console.log(nft.price)
                console.log(parseInt(nft.price * 1000000))
                // in solidity values are processed in wei
                contract.methods.mintNFT(parseInt(nft.price * 1000000), nft.url, nft.title, nft.description).send({from: accounts[0]}).then(res => {
                    console.log(res)
                    const result = {
                        blockHash: res.blockHash,
                        blockNumber: res.blockNumber,
                        contractAddress: res.contractAddress,
                        cumulativeGasUsed: res.cumulativeGasUsed,
                        effectiveGasPrice: res.effectiveGasPrice,
                        from: res.from,
                        gasUsed: res.gasUsed,
                        status: res.status,
                        to: res.to,
                        transactionHash: res.transactionHash,
                        transactionIndex: res.transactionIndex,
                        type: res.type
                    }
                    confirmMinted({id: nft._id, trxHash: result.transactionHash, contractAddress: result.contractAddress, blockHash: result.blockHash}).then(res => {
                        setMinted({nft: nft, transaction: result})
                        setLoading(false);
                    }).catch(e => {
                        console.log(e)
                        setLoading(false);
                    });
                }).catch(e => {
                    console.log(e)
                    setLoading(false);
                });
            }).catch(e => {
                console.log(e)
                setLoading(false);
            });
        }).catch(e => {
            console.log(e)
            setLoading(false);
        });
    }

    console.log(minted)

    const changeFile = (event) => {
        console.log("file changed")
        setFile(event.target.files[0])
    }

    return (
        <Container>
            {minted !== null && (
                <MintedNFTModal
                    nftImage={host + minted.nft.url}
                    nftPrice={minted.nft.price + " ETH"}
                    transactionHash={minted.transaction.transactionHash}
                    closeHandler={() => {
                        setMinted(null)
                        Navigate('/')
                    }}
                />
            )}
            <Row className="mt-5">
                <Col sm={3}></Col>
                <Col sm={7}>
                    <h1>Create New Item</h1>
                    <br/>
                    <p>
                        <p style={{color: "red"}}>* Required fields</p>
                    </p>
                    <h4 style={{display: "flex"}}>
                        Image <p>*</p>
                    </h4>
                    <p></p>
                    <Form onSubmit={uploadFile}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label style={{fontSize: "0.8rem", color: "grey"}}>
                                File types supported: JPG, PNG, GIF. Max size: 50 MB
                            </Form.Label>
                            <Form.Control type="file" onChange={changeFile}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>
                                <b style={{display: "flex", marginBottom: "-1rem"}}>
                                    Name <p style={{color: "red"}}>*</p>
                                </b>
                            </Form.Label>
                            <Form.Control type="text" placeholder="Name"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>
                                <b>Description</b>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder={"Provide a detailed description of your item."}
                            />
                            <Form.Text className="text-muted">
                                The description will be included on the item's detail page
                                underneath its image.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>
                                <b style={{display: "flex", marginBottom: "-1rem"}}>
                                    Price <p style={{color: "red"}}>*</p>
                                </b>
                            </Form.Label>
                            <Form.Control type="number" step="any" placeholder="0 Eth"/>
                        </Form.Group>
                        <br/>
                        <hr/>
                        <br/>
                        <Button type="submit" size="lg" disabled={loading}>Create</Button>
                    </Form>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </Container>
    );
};

export default CreateCatalog;
