import React from "react";
import { BaseHeader } from "../components/";
import { ButtonGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();
	return (
		<div>
			<BaseHeader />
			<div className="App" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: "#282c34"}}>
			<ButtonGroup>
				<Button onClick={() => {navigate('/movie')}}>Movies</Button>
				<Button onClick={() => {navigate('/map')}} >Maps</Button>
			</ButtonGroup>
		</div>
		</div>
	);
};

export default Home;
