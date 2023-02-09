import React, {useCallback, useState} from "react";
import {Routes, Route} from "react-router-dom";
import NavigationBar from "./components/shared/NavigationBar";
import Footer from "./components/shared/Footer/Footer";
import TrendingTop from "./components/shared/Trending_Top/Trending_Top";
import BuyPage from "./components/shared/BuyPage/BuyPage";
import AllNFTs from "./components/shared/AllNFTs/AllNFTs";
import Profile from "./components/shared/Profile/Profile";
import CreateCatalog from "./components/shared/CreateCatelog/CreateCatalog";
import ConnectWallet from "./components/shared/ConnectWallet/ConnectWallet";
import Settings from "./components/shared/Settings/Settings";
import {AuthProvider} from "./components/Utils/context/auth-context";
import "./App.css";
import ProtectedRoute from "./components/Utils/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <NavigationBar/>
                <Routes>
                    <Route path="/" element={<AllNFTs/>}/>
                    <Route path="/*" element={<div style={{width: "100%", height: "100vh"}}>
                        404 Page not found.
                    </div>}/>
                    <Route path="/login" element={<ConnectWallet/>}/>
                    <Route path="/all-nfts" element={<AllNFTs/>}/>
                    <Route path="/all-nfts/:search" element={<AllNFTs/>}/>
                    <Route path="/buy-page/:id" element={<BuyPage/>}/>
                    <Route path="/create-catelog" element={<ProtectedRoute/>}>
                        <Route exact path="/create-catelog" element={<CreateCatalog/>}/>
                    </Route>
                    <Route path="/settings" element={<ProtectedRoute/>}>
                        <Route exact path="/settings" element={<Settings/>}/>
                    </Route>
                    <Route path="/profile" element={<ProtectedRoute/>}>
                        <Route exact path="/profile" element={<Profile/>}/>
                    </Route>
                </Routes>
                <Footer className="sticky-footer"/>
            </div>
        </AuthProvider>
    );
}

export default App;
