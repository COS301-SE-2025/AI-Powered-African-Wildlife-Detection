import React from "react";
import "./App.css";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Camera from "./pages/Camera";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
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
