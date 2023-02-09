import React, {useContext, useEffect, useState} from "react"
import axios from "axios";
import Web3 from "web3";
import {createAlchemyWeb3} from "@alch/alchemy-web3";


const nft_abi = require("../../../contracts/NFTs.sol/NFTs.json")

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const host = "http://13.59.107.226:4000/"
    const [currentUser, setCurrentUser] = useState()
    const [contract, setContract] = useState(null)
    const [WEB3, setWeb3] = useState(null)
    const [loading, setLoading] = useState(true)
    const [ethLoading, setEthLoading] = useState(false)

    const API_URL = "https://eth-goerli.alchemyapi.io/v2/qFzNk0b9fzurqe-yexnAoVRu1FwLlU3v"
    const API_KEY = "qFzNk0b9fzurqe-yexnAoVRu1FwLlU3v"
    const PRIVATE_KEY = "81750a12184561b5b48071934a65188c2a638cd479dcdf342843b3de681ae9d6"
    const CONTRACT_ADDRESS_bk = "0x0c241630BD4ca3a6F02f561253547A110D77AD1a"
    const CONTRACT_ADDRESS = "0x4616B51f0a6069B422B48433E553622d9fAdD874"

    useEffect(() => {
        const w = createAlchemyWeb3(API_URL)
        setWeb3(w)
        const c = new w.eth.Contract(nft_abi.abi, CONTRACT_ADDRESS);
        setContract(c);
        setEthLoading(true)
        getCurrentUser().then(res => {
            setLoading(false)
        })
    }, [1])

    // contract

    function sendCode() {
        return axios({
            method: "POST",
            withCredentials: true,
            url: host + "requestCode"
        })
    }


    function validate(token) {
        return axios({
            method: "POST",
            data: {
                token: token
            },
            withCredentials: true,
            url: host + "validate"
        })
    }

    function login(callback) {
        window.ethereum.request({method: 'eth_requestAccounts'})
            .then(accounts => {
                if (accounts.length < 1) {
                    callback("Error")
                } else {
                    axios({
                        method: "post",
                        withCredentials: true,
                        url: host + "request_validation",
                        data: {
                            address: accounts[0]
                        }
                    }).then((res) => {
                        let address = res.data.address
                        let nonce = res.data.nonce + ""
                        let hash = Web3.utils.sha3(nonce)
                        const web3 = new Web3(window.ethereum);
                        web3.eth.personal.sign(hash, address).then(signature => {
                            axios({
                                method: "post",
                                withCredentials: true,
                                url: host + "login",
                                data: {
                                    address: address,
                                    nonce: nonce,
                                    signature: signature
                                }
                            }).then(login => {
                                callback(login)
                            })
                        })
                    })
                }
            })
    }

    async function getCurrentUser() {
        await axios({
            method: "get",
            withCredentials: true,
            url: host + "user",
        }).then((res) => {
            setCurrentUser(res.data.user)
        })
    }

    async function getCurrentUserPromise() {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                withCredentials: true,
                url: host + "user",
            }).then((res) => {
                setCurrentUser(res.data.user)
                resolve()
            }).catch(error => reject(error))
        })
    }


    function updateProfile(user) {
        if (user.banner || user.profile) {
            let data = new FormData();
            let url = host + "update_profile"
            data.append('username', user.username)
            data.append('email', user.email)
            data.append('bio', user.bio)
            if (user.banner && user.profile) {
                data.append('banner', user.banner, user.banner);
                data.append('profile', user.profile, user.profile);
            } else if (user.banner) {
                data.append('banner', user.banner, user.banner);
                url = host + "upload_banner"
            } else if (user.profile) {
                url = host + "upload_profile_picture"
                data.append('profile', user.profile, user.profile);
            }
            return axios({
                method: "post",
                withCredentials: true,
                url: url,
                data: data,
            })
        } else {
            return axios({
                method: "post",
                withCredentials: true,
                url: host + "update_profile_only",
                data: user,
            })
        }
    }

    function mintNFT(nft) {
        let data = new FormData();
        data.append('name', nft.name);
        data.append('description', nft.description);
        data.append('price', nft.price);
        data.append('image', nft.document, nft.document);
        console.log(data)
        return axios({
            method: "post",
            withCredentials: true,
            url: host + "mintToBlockChain",
            data: data,
        })
    }

    function makeOffer(offer) {
        return axios({
            method: "post",
            withCredentials: true,
            url: host + "makeOffer",
            data: offer
        })
    }

    function allOffers(nft) {
        return axios({
            method: "get",
            withCredentials: true,
            url: host + `/offers/${nft}`,
        })
    }

    function getNFT(contract, token) {
        return axios({
            method: "get",
            withCredentials: true,
            url: `${host}${contract}/${token}`,
        })
    }

    function myNFTs() {
        return axios({
            method: "get",
            withCredentials: true,
            url: host + "mynft",
        })
    }

    function allNFTs() {
        return axios({
            method: "get",
            withCredentials: true,
            url: host + "all_nfts",
        })
    }

    function mintedNFTs() {
        return axios({
            method: "get",
            withCredentials: true,
            url: host + "minted",
        })
    }


    function addBannerPicture(user) {
        let data = new FormData();
        data.append('image', user.document, user.document);
        data.append('username', user.username)
        return axios({
            method: "post",
            withCredentials: true,
            url: host + "upload_banner",
            data: data,
        })
    }


    function logout() {
        return axios({
            method: "post",
            withCredentials: true,
            url: host + "logout",
        })
    }

    function accept(offer) {
        return axios({
            method: "post",
            withCredentials: true,
            url: host + `accept`,
            data: {offer: offer}
        })
    }

    function decline(offer) {
        return axios({
            method: "post",
            withCredentials: true,
            url: host + `decline`,
            data: {offer: offer}
        })
    }

    function process(offer) {
        return axios({
            method: "post",
            withCredentials: true,
            url: host + `processed`,
            data: {offer: offer}
        })
    }

    function confirmMinted(minted) {
        return axios({
            method: "post",
            withCredentials: true,
            url: host + "confirmMinted",
            data: minted,
        })
    }

    const value = {
        currentUser,
        setCurrentUser,
        login,
        logout,
        getCurrentUser,
        updateProfile,
        validate,
        sendCode,
        mintNFT,
        myNFTs,
        getCurrentUserPromise,
        getNFT,
        mintedNFTs,
        allNFTs,
        contract,
        WEB3,
        makeOffer,
        allOffers,
        accept,
        decline,
        process,
        confirmMinted,
        host
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && ethLoading && children}
        </AuthContext.Provider>
    )
}