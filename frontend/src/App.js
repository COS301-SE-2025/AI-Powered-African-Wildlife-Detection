import React, { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Camera from "./pages/Camera";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import useIsMobile from "./hooks/useIsMobile";

function App() {
	const isMobile = useIsMobile();
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={isMobile ? <MobileLayout /> : <WebLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Home />} />
					<Route path="/map" element={<Map />} />
					<Route path="/camera" element={<Camera />} />
					<Route path="/feed" element={<Feed />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/login" element={<Login />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

function WebLayout() {
	return (
		<>
			<div className="web-header">
				<div className="web-heading">BushBuddy</div>
				<div className="web-navbar">
					<Link to={"/home"} className="web-navlink">
						Home
					</Link>
					<Link to={"/map"} className="web-navlink">
						Map
					</Link>
					<Link to={"/camera"} className="web-navlink">
						Camera
					</Link>
					<Link to={"/feed"} className="web-navlink">
						Feed
					</Link>
					<Link to={"/profile"} className="web-navlink">
						Profile
					</Link>
					<Link to={"/login"} className="web-navlink">
						Login
					</Link>
				</div>
			</div>
			<main id="app">
				<Outlet />
			</main>
		</>
	);
}

function MobileLayout() {
	const [currentTab, setCurrentTab] = useState("home");

	return (
		<>
			<main id="app">
				<Outlet />
			</main>
			<div className="mobile-navbar">
				<Link
					to={"/home"}
					className={`mobile-navlink ${currentTab === "home" ? "active" : ""}`}
					onClick={() => setCurrentTab("home")}>
					Home
				</Link>
				<Link
					to={"/map"}
					className={`mobile-navlink ${currentTab === "map" ? "active" : ""}`}
					onClick={() => setCurrentTab("map")}>
					Map
				</Link>
				<Link
					to={"/camera"}
					className={`mobile-navlink ${currentTab === "camera" ? "active" : ""}`}
					onClick={() => setCurrentTab("camera")}>
					Camera
				</Link>
				<Link
					to={"/feed"}
					className={`mobile-navlink ${currentTab === "feed" ? "active" : ""}`}
					onClick={() => setCurrentTab("feed")}>
					Feed
				</Link>
				<Link
					to={"/profile"}
					className={`mobile-navlink ${currentTab === "profile" ? "active" : ""}`}
					onClick={() => setCurrentTab("profile")}>
					Profile
				</Link>
			</div>
		</>
	);
}
