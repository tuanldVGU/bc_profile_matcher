import React from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";


import { useState } from 'react';
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api"
import { useMemo } from 'react';


import PSI from '@openmined/psi.js';
import axios from 'axios';
import geohash from "ngeohash";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const GEO_HASH_LENGTH = 8

function Map() {
 const { isLoaded, loadError } = useLoadScript({googleMapsApiKey: process.env.MAP_API_KEYS})
 const navigate = useNavigate();
 const [markers, setMarker] = useState([{lat: -34.92866, lng: 138.59863}])
 const center = useMemo(() => ({lat: -34.92866, lng: 138.59863}), []) 
 
 const [show, setShow] = useState(false);
 const [match, setMatch] = useState(0)
 

const numClientElements = 10; // Size of the client set to check
const revealIntersection = false; // Allows to reveal the intersection (true)


 const hashPoints = () => {
  return [...new Set(markers.map(x => geohash(x.lat, x.lng, GEO_HASH_LENGTH)))]
 } 

 const submit = () => {
    (async () => {
      const psi = await PSI()
    
      const client = psi.client.createWithNewKey(revealIntersection)

      const clientInputs = hashPoints()
            
      const clientRequest = client.createRequest(clientInputs)
      const serializedClientRequest = clientRequest.serializeBinary()

      // const url = "https://profilematcherapis.herokuapp.com/maps"
      const localUrl = "http://localhost:3000/map"
      axios.post(localUrl, {
          data: Array.from(serializedClientRequest)
      },{
        headers:{
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Credentials':true
        }
      }).then((serverResponse) => {

        const serializedServerResponse = Uint8Array.from(serverResponse.data.serializedServerResponse)
        const serializedServerSetup = Uint8Array.from(serverResponse.data.serializedServerSetup)

        const deserializedServerResponse = psi.response.deserializeBinary(
          serializedServerResponse
        )

        // Deserialize the server setup
        const deserializedServerSetup = psi.serverSetup.deserializeBinary(
          serializedServerSetup
        )
        const intersectionSize = client.getIntersectionSize(
          deserializedServerSetup,
          deserializedServerResponse
        )
        setMatch(intersectionSize)
        // alert('Intersection size is:', intersectionSize)
        setShow(true)
    })

  })()

  }

 const onMapClick = (location) =>{
  if (markers.length < 10) {
    setMarker([...markers, {
      lat: location.latLng.lat(),
      lng: location.latLng.lng()
    }])
  }
 }

 const disabledBtn = () => markers.length < 10

 return (
  // <div>
  //       {isLoaded ? "TRUE": "FALSE"} - {loadError}
  // </div>
  !isLoaded ? <div>
    loading...
  </div> :
  <div className="App" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: "#282c34", flexDirection:'row', flexWrap:'wrap'}}>
    <Modal show={show} onHide={() => setShow(false)} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Match location</Modal.Title>
      </Modal.Header>
      <Modal.Body>{`Woohoo, you have ${match} locations match!`}</Modal.Body>
    </Modal>
    <GoogleMap zoom={12} center={center} mapContainerStyle={{width: '100vw', height: '100vh'}} onClick={(location) => onMapClick(location)}>
      {/* {true && <MarkerF position={markers[0]}></MarkerF>} */}
      {
        markers.map((x,i) => {
          console.log(x)
          return <MarkerF position={x} key={`marker-${i}`}></MarkerF>
        })
      }
    </GoogleMap>
    <ButtonGroup style={{position: "absolute", left: 0, bottom: 30, right: 0, marginLeft: '40%', marginRight: '40%'}}>
      <Button onClick={() => {navigate('/')}}><FontAwesomeIcon icon={faChevronLeft}/></Button>
      <Button onClick={() => {submit()}} disabled={disabledBtn()}>Submit</Button>
    </ButtonGroup>
    
  </div>
 );
}


export default Map;