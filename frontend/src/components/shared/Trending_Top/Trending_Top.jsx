import React, {useEffect, useState} from "react";
import {Row, Col} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Top from "./Tabs/Top";
import Trending from "./Tabs/Trending";
import NewAndNoteable from "../NewAndNoteable/NewAndNoteable";
import "./Trending_Top.css";
import {useAuth} from "../../Utils/context/auth-context";

const Trending_Top = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <div style={{paddingLeft: "3rem"}}>
            <br/>
            
            <NewAndNoteable/>
        </div>
    );
};

export default Trending_Top;
