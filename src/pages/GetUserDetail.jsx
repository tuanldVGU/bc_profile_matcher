import React, { useEffect, useState } from "react"
// import VeridaClient from "../api/veridaClient"
import Form from 'react-bootstrap/Form'
import { ToastContainer, Toast, Button, InputGroup } from 'react-bootstrap'

const GetUserDetail = (props) => {

  const [name, setName] = useState({value: ""})
  const [show, setShow] = useState(false);

  useEffect(()=>{
    props.socket.on('checkUserDetailResponse', data => {
      console.log(name.value);
      !data ? setShow(true) : props.registrationConfirmation({
        isRegistered: data,
        name: name.value
      })
    });
  },[name])

  const checkName = () => {
    // console.log(`checkUser: ${VeridaClient.profile.did}`)
    // props.socket.emit('checkUserDetail', { "id":  props.socket.id, "did": VeridaClient.profile.did })
    props.socket.emit('checkUserDetail', { "id":  props.socket.id, "did": name.value })
  }
  return (<Form>
    <ToastContainer className="p-3" position='top-end'>
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Error</strong>
          <small>now</small>
        </Toast.Header>
        <Toast.Body>Name already existed!</Toast.Body>
      </Toast>
    </ToastContainer>

    <InputGroup className="mb-3">
      <Form.Control type="text" placeholder="Enter your virtualName:" onChange={e => {setName({value: e.target.value})}}/>

      <Button variant="primary" onClick={() =>{checkName()}}>
        Join
      </Button>
    </InputGroup>

  </Form>)
}

export default GetUserDetail