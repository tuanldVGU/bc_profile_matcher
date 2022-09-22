import '../App.css';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import PSI from '@openmined/psi.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";



function Movies() {

  const navigate = useNavigate();

  const numClientElements = 10; // Size of the client set to check
  const revealIntersection = false; // Allows to reveal the intersection (true)

  const [show, setShow] = useState(false);
  const [match, setMatch] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const movies = ["Iron Man (2008)", "The Incredible Hulk (2008)", "Iron Man 2 (2010)", "Thor (2011)", "Captain America: The First Avenger (2011)", "The Avengers (2012)", "Iron Man 3 (2013)", "Thor: The Dark World (2013)", "Captain America: The Winter Soldier (2014)", "Guardians of the Galaxy (2014)", "Avengers: Age of Ultron (2015)", "Ant-Man (2015)", "Captain America: Civil War (2016)", "Doctor Strange (2016)", "Guardians of the Galaxy Vol. 2 (2017)","Spider-Man: Homecoming (2017)", "Thor: Ragnarok (2017)", " Black Panther (2018)", "Avengers: Infinity War (2018)", "Ant-Man and the Wasp (2018)", "Captain Marvel (2019)", "Avengers: Endgame (2019)", "Spider-Man: Far from Home (2019)", "Guardians of the Galaxy Vol. 3 (2023)"]

  const [selected, setSelected] = useState([])

  const isSelected = (str) => selected.includes(str)

  const uniqueInsert = (str) => {
    
    const unique = selected.every(x => str !== x)
    console.log(unique)
    if (unique & selected.length < numClientElements){
      setSelected([...selected, str])
    }
  }

  const submit = () => {
      (async () => {
        const psi = await PSI()
      
        const client = psi.client.createWithNewKey(revealIntersection)

        const clientInputs = selected
              
        const clientRequest = client.createRequest(clientInputs)
        const serializedClientRequest = clientRequest.serializeBinary()

        const url = "https://profilematcherapis.herokuapp.com/movies"
        const localUrl = "http://localhost:8081/movies"
        axios.post(url, {
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
          handleShow()
      })

    })()

  }

  return (
    <div className="App">

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Match movies</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Woohoo, you have ${match} movies!`}</Modal.Body>
      </Modal>
      <section className="App-header">
        <Button onClick={() => {navigate('/')}}>Back</Button>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          What is your favourite movies?
        </p>
        <div
        style= {{
            paddingHorizontal: 100,
            paddingTop: 0,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {
              movies.map((x,i) => <Button key={`test-${i}`}  onClick={() =>uniqueInsert(x)}  style= {{
                width: "30%",
                height: 40,
                display: 'flex',
                borderWidth: 2,
                borderColor: isSelected(x) ?  'red' : '#fff',
                borderStyle: 'solid',
                borderRadius: 5,
                margin: 5,
                backgroundColor: 'transparent',
                color: '#fff'
              }}>
                <p style= {{
                  width: "100%",
                  fontSize: 15,
                  textAlign: 'center'
                }}>
                {x}
                </p>
              </Button>)
            }
        </div> 
        {selected.length}

        <Button type="button" onClick={() => submit()} style={{width: "100%"}}>Submit</Button>

      </section>
      
    </div>
  );
}

export default Movies;