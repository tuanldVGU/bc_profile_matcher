import '../App.css';
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";



function Home() {
const navigate = useNavigate();
 return (
  <div className="App" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: "#282c34"}}>
    <ButtonGroup>
      <Button onClick={() => {navigate('/movies')}}>Movies</Button>
      <Button onClick={() => {navigate('/maps')}} >Maps</Button>
      <Button onClick={() => {navigate('/loginVerida')}} >Login Verida</Button>
    </ButtonGroup>
  </div>
 );
}

export default Home;