import { faTicket, faUserSecret, faMapLocationDot, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import PSI from '@openmined/psi.js'

import { Sending, Processing, Responding } from '../api/pairing'

import Spinner from 'react-bootstrap/Spinner'

const ShowUsers = (props) => {

  const [users, setUsers] = useState({
    data:[]
  })

  const [selected, setSelected] = useState(null)

  const [requests, setRequests] = useState({
    data: []
  })

  const [responses, setResponses] = useState([])

  const getUserData = () => users.data

  useEffect(()=>{
      // setUsers({
      //   data: [{name: 1}]
      // })
      props.socket.on('getOpponentsResponse', data => {
        console.log(data)
        setUsers({
          data: data
        })
      });

      props.socket.on('requestMovies', async (data) => {
        console.log(data)
        setRequests({
          data: [...requests.data, {
          ...data,
          type: 'movies'
          }]
        })
      })

      props.socket.on('requestLocations', async (data) => {
        console.log(data)
        setRequests([...requests, {
          ...data,
          type: 'locations'
        }])

      })


      props.socket.on('gameStarted', data => {
        gameStartConfirmation(data);
      });
    
      props.socket.emit('getOpponents', {});
  },[])

  useEffect(() => {
    props.socket.on('newOpponentAdded', data => {
      console.log(getUserData())
      
      setUsers({
        data: [...getUserData(), data]
      });
    });
  }, [users])

  const updateSelected = (i) => {
    // if (selected == null) {
      setSelected(i)
    // } else {

    // }
  }

  const send = async (i, type) => {
    const psi = await PSI()
      
    const client = psi.client.createWithNewKey(false)
  
    const clientRequest = client.createRequest(type == "movies" ? props.movies : props.locations)
    const serializedClientRequest = clientRequest.serializeBinary()

    props.socket.emit('targetMatching', {
      sender: props.socket.id,
      senderName: props.name,
      id: users.data[i].id,
      message: serializedClientRequest,
      type: type
    })

    console.log(users.data[i])

    setResponses({
    [`${users.data[i].name}_movies`]: {
      name: users.data[i].name,
      type: type,
      match: null
    } , ...responses})

    props.socket.on('resultMatching', async (serverResponse) => {
      console.log(serverResponse)
      const { serializedServerResponse, serializedServerSetup } = serverResponse
      // const serializedServerResponse = Uint8Array.from(serverResponse.serializedServerResponse)
      // const serializedServerSetup = Uint8Array.from(serverResponse.serializedServerSetup)
      console.log(serializedServerResponse)
      console.log(serializedServerSetup)
    
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
    
      const updated = {[`${serverResponse.senderName}_${serverResponse.type}`]: {
        name: serverResponse.senderName,
        type: serverResponse.type,
        match: intersectionSize
      } ,  ...responses}
      setResponses(updated)
    })
  }

  const processRequest = async (data, type) => {
    const serverData = type == 'movies' ? props.movies : props.locations

    const {serializedServerResponse, serializedServerSetup} = await Processing(serverData, data)
    props.socket.emit('responseMatching', {
      senderName: props.name,
      target: data.sender,
      serializedServerResponse,
      serializedServerSetup,
      type: type
    })
    console.log({
      senderName: props.name,
      target: data.sender,
      serializedServerResponse,
      serializedServerSetup,
      type: type
    })

  }

  return (
    <div>
        <div style={{display: "grid", gridTemplateColumns: "50% 50%", color: '#fff'}}>

          <div className="user-box">
            <p>Available users:</p>
            <div style={{display: "flex", flexDirection: 'row', flexWrap: 'wrap'}}>
              {
                users.data.map((x,i) => (
                  <div key={`User-${i}`} className={`user-block ${selected == i ? 'user-selected' : ''}`} onClick={() => updateSelected(i)}>
                    <span style={{marginRight: 10, marginTop: 3, fontSize: 25}}><FontAwesomeIcon icon={faUserSecret}></FontAwesomeIcon> {x.name}</span>
                    <ButtonGroup>
                      <Button onClick={() => send(i,"movies")}> <FontAwesomeIcon icon={faTicket}></FontAwesomeIcon> </Button>
                      <Button onClick={() => send(i,"locations")}><FontAwesomeIcon icon={faMapLocationDot}></FontAwesomeIcon></Button>
                    </ButtonGroup>
                  </div>
                ))
              }
            </div>

          </div>

          <div style={{display: "grid", gridTemplateRows: "50% 50%"}}>
            <div className="user-box">
              <p>Requests for pairing</p>
              <div style={{display: "flex", flexDirection: 'row', flexWrap: 'wrap'}}>
              {
                requests.data.map((x,i) => (
                  <div key={`Request-${i}`} className={`user-block`}>
                    <span style={{marginRight: 10, marginTop: 3, fontSize: 25}}><FontAwesomeIcon icon={faUserSecret}></FontAwesomeIcon> {x.senderName}</span>
                    <span>{x.type === 'movies' ? <FontAwesomeIcon icon={faTicket}></FontAwesomeIcon> : <FontAwesomeIcon icon={faMapLocationDot}></FontAwesomeIcon>}</span>
                    <Button onClick={() => processRequest(x, x.type)}> <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon> </Button>
                  </div>
                ))
              }
              </div>
            </div>

            <div className="user-box">
              <p>Responses for pairing</p>
              <div style={{display: "flex", flexDirection: 'row', flexWrap: 'wrap'}}>
                {
                  Object.values(responses).map((x,i) => (
                    <div key={`Request-${i}`} className={`user-block`}>
                      <span style={{marginRight: 10, marginTop: 3, fontSize: 25}}><FontAwesomeIcon icon={faUserSecret}></FontAwesomeIcon> {x.name}</span>
                      <span style={{marginRight: 10}}>{x.type === 'movies' ? <FontAwesomeIcon icon={faTicket}></FontAwesomeIcon> : <FontAwesomeIcon icon={faMapLocationDot}></FontAwesomeIcon>}</span>
                      {x.match == null ? <Spinner size="sm" animation="grow" variant="success"/>: (<span style={{borderRadius: "50%", backgroundColor: '#fff', color: '#282c34', padding: "3px 8px"}}>{x.match}</span>)}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          

      </div>
    </div>
  )
}

export default ShowUsers