import '../App.css';
import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";


import { useState } from 'react';
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api"
import { useMemo } from 'react';

// const apiKey = "AIzaSyCB3uMp02Em8tD5xPy-BUfXd6huQt8dxLw"

function Maps() {
 const { isLoaded } = useLoadScript({googleMapsApikey: process.env.MAP_API_KEYS})
 const navigate = useNavigate();
 const [markers, setMarker] = useState([{lat: -34.92866, lng: 138.59863}])
 const center = useMemo(() => ({lat: -34.92866, lng: 138.59863}), []) 
 return (
  !isLoaded ? <div>
    loading...
  </div> :
  <div className="App" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: "#282c34"}}>
    <Button onClick={() => {navigate('/')}}>Back</Button>
    {isLoaded ? "TRUE": "FALSE"}
    <GoogleMap zoom={12} center={center} mapContainerStyle={{width: '60vw', height: '60vh'}}>
      {
        markers.map((x,i) => {
          <Marker lat={x.lat} lng={x.lng} key={`marker-${i}`}></Marker>
        })
      }
    </GoogleMap>
  </div>
 );
}


export default Maps;