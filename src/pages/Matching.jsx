import React, { useEffect, useState } from "react";
import { BaseHeader } from "../components/";
import { ButtonGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { io } from "socket.io-client";

import GetUserDetail  from './GetUserDetail'
import ShowUsers from './ShowUsers'

const Matching = (props) => {
	const navigate = useNavigate();

  const [matcher, setMatcher] = useState({  
    socket: null,  
    name: null,
    isGameStarted: false,  
    roomId:null,  
    isRegistered: false
  })
  

  const connect = () => {
    const url = "http://localhost:8081"
    const socket = io(url);
    socket.on("connected", data => {
      console.log(data)
      setMatcher({...matcher, socket: socket })
      console.log(matcher)
    });
    console.log(socket.id)
  }

  useEffect(() => {
    connect()
    console.log("Connected")
  },[])

  const registrationConfirmation = (data) => {
    console.log(data)
    // If registration successfully redirect to player list
    setMatcher({...matcher, isRegistered: data.isRegistered, name: data.name })
    console.log(`Register state: ${data}`)
    console.log({...matcher, isRegistered: data }, matcher)
  };

  const gameStartConfirmation = (data) => {
    // If select opponent player then start game and redirect to game play
    setMatcher({ isGameStarted: data.status, roomId: data.room_id });
  };

	return (
		<div>
			<BaseHeader />
			<div className="App" style={{display: 'flex', paddingTop: 20, paddingLeft: 10, height: '100vh', backgroundColor: "#282c34", flexDirection: 'column'}}>
      <p style={{color: "#fff"}}>Your connection id: {matcher.socket !== null ? matcher.socket.id: "..."}</p>
      <p style={{color: "#fff"}}>Welcome: {matcher.name}</p>
      {
          !matcher.isGameStarted ? !matcher.isRegistered ? <div>
            {matcher.socket
              ? <GetUserDetail socket={matcher.socket} registrationConfirmation={registrationConfirmation} />
              : <p style={{color: "#fff"}}>Loading...</p>}
          </div> :
            // <div>ShowUsers</div>:
            <ShowUsers socket={matcher.socket} gameStartConfirmation={gameStartConfirmation} movies={props.movies} locations={props.locations} name={matcher.name}/> :
            <div>Let's match</div>
            // <GamePlay socket={this..socket} gameId={this.state.gameId} gameData={this.state.gameData} opponentLeft={this.opponentLeft} />
      }
			</div>	
      
		</div>
	);
};

export default Matching;
