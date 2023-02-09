import React, {useEffect, useState} from "react";
import {Button, Row, Col} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../Utils/context/auth-context";
import "./confirmation.css"


const ProfileSettings = () => {
    const {currentUser, getCurrentUser, updateProfile, sendCode, validate} = useAuth()
    const [profile, setProfilePicture] = useState()
    const [banner, setBannerPicture] = useState()
    const Navigate = useNavigate();
    const [confirmation, setConfirmation] = useState(false)
    console.log(currentUser)

    const changeProfilePicture = (event) => {
        setProfilePicture(event.target.files[0])
    }

    const changeBannerPicture = (event) => {
        setBannerPicture(event.target.files[0])
    }

    const submit = (form) => {
        const username = form.target[1].value;
        const email = form.target[2].value;
        const bio = form.target[3].value;
        const user = {
            username: username,
            email: email,
            bio: bio,
            profile: profile,
            banner: banner,
        }
        console.log(user)
        updateProfile(user).then(res => {
            console.log(res)
            if (res.data === "Success") {
                getCurrentUser()
                Navigate("/profile")
            }
        })
        form.preventDefault();
    }


    function toggleConfirmation(event) {
        setConfirmation(!confirmation)
    }

    function sendVerificationCode(event){
        event.preventDefault()
        sendCode().then(res => {
            console.log(res)
            if (res.data === "ok"){
                toggleConfirmation(event)
            }else{
                alert("failed to send email")
            }
        })
    }

    function confirmEmail(event) {
        event.preventDefault()
        let code = ""
        for (let i=0;i<6;i++){
            code+=event.target[i].value
        }
        console.log(code)
        validate(parseInt(code)).then(res => {
            console.log(res)
            if(res.data === "ok"){
                window.location.reload()
            }
        })
    }

    return (
        <div className="mt-5 mb-5">
            {confirmation && <div>
                <div id="myModal" className="m-modal">
                    <div className="m-modal-content">
                        <a onClick={toggleConfirmation}><span className="close">&times;</span></a>
                        <div style={{marginTop: "30px", display: "block"}}>
                            <div className="container d-flex justify-content-center align-items-center">
                                <div className="position-relative">
                                    <form onSubmit={confirmEmail}>
                                        <div className="m-card card p-2 text-center">
                                            <h6>Please enter the one time password <br/> to verify your account</h6>
                                            <div><span>A code has been sent to</span> <small>your email</small></div>
                                            <div id="otp" className="inputs d-flex flex-row justify-content-center mt-2">
                                                <input required className="m-2 text-center form-control rounded" type="text"
                                                       id="first" maxLength="1"/> <input
                                                required className="m-2 text-center form-control rounded" type="text" id="second"
                                                maxLength="1"/> <input required className="m-2 text-center form-control rounded"
                                                                       type="text" id="third" maxLength="1"/> <input
                                                required className="m-2 text-center form-control rounded" type="text" id="fourth"
                                                maxLength="1"/> <input required className="m-2 text-center form-control rounded"
                                                                       type="text" id="fifth" maxLength="1"/> <input
                                                required className="m-2 text-center form-control rounded" type="text" id="sixth"
                                                maxLength="1"/></div>
                                            <div className="mt-4">
                                                <button type="submit" className="btn btn-danger px-4 validate">Validate</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

            {currentUser && <Form className="row" onSubmit={submit}>
                <Col sm={3}/>
                <Col sm={5} className="col-sm-5">
                    <h1>
                        <b>Profile details</b>
                    </h1>
                    <Button
                        bg="primary"
                        onClick={() => {
                            Navigate("/profile");
                        }}
                    >
                        Preview
                    </Button>
                    <br/>
                    <br/>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" defaultValue={currentUser.username} required/>
                        <br/>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" disabled={currentUser.isVerified} defaultValue={currentUser.email}
                                      required/>
                        {currentUser.isVerified === false &&
                        <button className="btn btn-outline-primary float-end m-2"
                                onClick={sendVerificationCode}>Confirm</button>}
                        <br/>
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                            as="textarea"
                            defaultValue={currentUser.bio}
                            required
                            style={{height: "100px"}}
                        />
                        <br/>
                        <Form.Label>Current Wallet Address</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={currentUser.address}
                            disabled={true}
                            required
                        />
                        <br/>
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        style={{height: "3rem", width: "5rem"}}
                    >
                        Save
                    </Button>
                </Col>
                <Col sm={2} className="mt-5">
                    <h5>
                        <b style={{marginLeft: "2rem"}}>Profile Image</b>
                    </h5>
                    <input name="profile_picture" type="file" onChange={changeProfilePicture}/>
                    <br/>
                    <br/>
                    <h5>
                        <b style={{marginLeft: "2rem"}}>Profile Banner</b>
                    </h5>
                    <input name="banner_picture" type="file" onChange={changeBannerPicture}/>
                </Col>
                <Col sm={2}/>
            </Form>}
        </div>
    );
}
export default ProfileSettings;