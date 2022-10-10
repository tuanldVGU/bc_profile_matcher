import React, { useEffect } from "react";
import { Bars } from "react-loader-spinner";
import VeridaLoginBtn from "../assets/images/connect_with_verida_dark.png";
import { ReactComponent as VeridaLogo } from "../assets/images/verida_logo.svg";
import useAuth from "../hooks/useAuth";
import VeridaClient from "../api/veridaClient";

const Connect = () => {
	const { connectVault, isLoading } = useAuth();

	useEffect(() => {
		// Auto Login if user already login
		if (VeridaClient.hasSession()) {
			connectVault();
		}
	}, []);

	return (
		<div className='login-container'>
			<div className='connect'>
				{isLoading ? (
					<React.Fragment>
						<Bars height='100' width='100' color='#000' ariaLabel='loading' />
						<p>Connecting...</p>
					</React.Fragment>
				) : (
					<React.Fragment>
						<VeridaLogo className='connect-svg' alt='verida-logo' />
						<h3>React Starter Demo</h3>
						<p>Use the button below to connect with Verida Vault</p>
						<button onClick={connectVault}>
							<img src={VeridaLoginBtn} alt='verida-btn' />
						</button>
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

export default Connect;
