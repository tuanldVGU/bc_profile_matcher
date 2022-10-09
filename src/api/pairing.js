import PSI from '@openmined/psi.js';

const revealIntersection = false

export async function Sending (clientInputs) {
  const psi = await PSI()
      
  const client = psi.client.createWithNewKey(revealIntersection)

  const clientRequest = client.createRequest(clientInputs)
  const serializedClientRequest = clientRequest.serializeBinary()
  return {
    psi,
    client,
    serializedClientRequest
  }
}

export async function Processing (serverInputs, clientRequestData ){

  const psi = await PSI()

  const fpr = 0.001; // false positive rate (0.1%)
  const numClientElements = 10; // Size of the client set to check

  const server = psi.server.createWithNewKey(false)

  const serverSetup = server.createSetupMessage(
    fpr,
    numClientElements,
    serverInputs
  )

  console.log(clientRequestData.message)
  const clientRequest = Uint8Array.from(clientRequestData.message)
  console.log(clientRequest)

  const deserializedClientRequest = psi.request.deserializeBinary(
    // clientRequest
    clientRequestData.message
  )

  // Process the client's request and return to the client
  const serverResponse = server.processRequest(deserializedClientRequest)
  const serializedServerResponse = serverResponse.serializeBinary()

  // Serialize the server setup. Will be an Uint8Array.
  const serializedServerSetup = serverSetup.serializeBinary()

  
  return {
    serializedServerResponse,
    serializedServerSetup
  }
}

export async function Responding (psi, client, serverResponse) {
  const serializedServerResponse = Uint8Array.from(serverResponse.serializedServerResponse)
  const serializedServerSetup = Uint8Array.from(serverResponse.serializedServerSetup)
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

  return intersectionSize
}
