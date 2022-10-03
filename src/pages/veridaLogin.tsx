import { useState , useEffect} from "react";
import { hasSession, VaultAccount } from "@verida/account-web-vault";
import { Network, EnvironmentType, Context } from "@verida/client-ts";
// import { AutoAccount } from '@verida/account-node';

function VeridaLogin() {
  const [veridaContext, setVeridaContext] = useState<Context | undefined>(undefined);
  const [did, setDid] = useState<string>("");
  const CONTEXT_NAME = "Matcher_App"
  const VERIDA_TESTNET_DEFAULT_SERVER = 'https://db.testnet.verida.io:5002/'


  const login = async function () {
    console.log("checkpoint 1")

    const account = new VaultAccount({
        request: {
            logoUrl: "https://developers.verida.io/img/tutorial_login_request_logo_170x170.png",
            openUrl: window.location.href
        },
    });

    // const account = new AutoAccount({
    //     defaultDatabaseServer: {
    //         type: 'VeridaDatabase',
    //         endpointUri: VERIDA_TESTNET_DEFAULT_SERVER
    //     },
    //     defaultMessageServer: {
    //         type: 'VeridaMessage',
    //         endpointUri: VERIDA_TESTNET_DEFAULT_SERVER
    //     }
    // }, {
    //     environment: EnvironmentType.TESTNET,
    //     privateKey: '0x...'
    // });

    console.log("checkpoint 2")

    const context = await Network.connect({
        client: {
            environment: EnvironmentType.TESTNET,
        },
        account: account,
        context: {
            name: CONTEXT_NAME,
        }
    }) 

    console.log("checkpoint 3")

    context ? setVeridaContext(context) : (() => {})()

    const accountDID = await veridaContext?.getAccount().did() || ""
    setDid(accountDID)
    console.log(context)

  };

  const logout = async function () {
      // disconnect the Verida session
      await veridaContext?.getAccount().disconnect(CONTEXT_NAME);
      // reset the internal state
      setVeridaContext(undefined);
  };


  useEffect(() => {
    (async() => {
      if (!veridaContext) {
        // we don't have veridaContext in local state

        // Check if we have a stored session
        //  hasSession is from the package "@verida/account-web-vault"
        //  see below fod links to documentation
        if (hasSession(CONTEXT_NAME)) {
            // we know we have a session already
            login(); // when logged in this will just setup a Verida Context
        }
     }

    })()

  }, []);

  // this.login = this.login.bind(this);
  // this.logout = this.logout.bind(this);

  // if we have a veridaContext we are logged in

  return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: "#282c34"}}>
      {veridaContext ? (
        <div>
            <h3>
                Logged in! Your DID is: <pre>{did}</pre>
            </h3>
            <button onClick={logout}>Logout</button>
        </div>
    ) : (
        <button onClick={login}>Login</button>
    )}
  </div>
  
}

export default VeridaLogin;