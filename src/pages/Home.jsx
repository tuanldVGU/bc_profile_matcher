import React from "react";
import { BaseHeader } from "../components/";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faMapLocationDot, faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
const Home = (props) => {
	const navigate = useNavigate();
	return (
		<div>
			<BaseHeader />
			<div className="App" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: "#282c34", flexDirection: 'column'}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
					<div onClick={() => {navigate('/movie')}} className="profile-item">
						<h1>
							<FontAwesomeIcon icon={faTicket}></FontAwesomeIcon>
						</h1>
						
						<span>Movies</span>
						<span>{props.movies.length < 10 ? <span style={{color: '#F51720'}}><FontAwesomeIcon icon={faTriangleExclamation}></FontAwesomeIcon> </span>: <span style={{color: "#75E6DA"}}> <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon></span>} </span>
					</div>
					<div onClick={() => {navigate('/map')} }  className="profile-item">
						<h1>
							<FontAwesomeIcon icon={faMapLocationDot}></FontAwesomeIcon>
						</h1>
						<span>Locations</span>
						<span>{props.locations.length < 10 ? <span style={{color: '#F51720'}}><FontAwesomeIcon icon={faTriangleExclamation}></FontAwesomeIcon> </span>: <span style={{color: "#75E6DA"}}> <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon></span>} </span>
					</div>
				</div>	
				<Button onClick={() => {navigate('/match')} } disabled={ props.movies.length < 10 && props.locations.length < 10 }>Compare with people</Button>
			</div>
		</div>
	);
};

export default Home;
