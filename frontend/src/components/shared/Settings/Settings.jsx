import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import ProfileSettings from "./Pages/ProfileSettings";
import Alert from "react-bootstrap/Alert";

const Settings = () => {
  const [show, setShow] = useState(false);
  const [pageShow, setPageShow] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div style={{ marginLeft: "2rem", marginTop: "1rem" }}>
      <Alert key="dark" variant="dark" style={{ width: "96vw" }}>
        <Button variant="primary" onClick={handleShow}>
          Settings
        </Button>
      </Alert>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ fontSize: "2rem" }}>
            Settings
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            fontSize: "1rem",
            textDecoration: "underline",
          }}
        >
          <ul className="cursor-pointer" onClick={() => {}}>
            Profile
          </ul>
          <ul
            className="cursor-pointer"
            onClick={() => {
              setPageShow(0);
            }}
          >
            Featured Items
          </ul>
          <ul
            className="cursor-pointer"
            onClick={() => {
              setPageShow(1);
            }}
          >
            Notification
          </ul>
          <ul
            className="cursor-pointer"
            onClick={() => {
              setPageShow(2);
            }}
          >
            Offers
          </ul>
          <ul
            className="cursor-pointer"
            onClick={() => {
              setPageShow(3);
            }}
          >
            Account Support
          </ul>
          <ul
            className="cursor-pointer"
            onClick={() => {
              setPageShow(4);
            }}
          >
            Earning
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      {pageShow === 0 && <ProfileSettings />}
    </div>
  );
};

export default Settings;
