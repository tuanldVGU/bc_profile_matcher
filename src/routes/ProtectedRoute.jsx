import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import VeridaClient from '../api/veridaClient';

const ProtectedRoute = ({ children }) => {
	let auth = VeridaClient.connected;
	let location = useLocation();

	if (!auth) {
		// Redirect them to the /login page, but save the current location they were
		// trying to go to when they were redirected. This allows us to send them
		// along to that page after they login, which is a nicer user experience
		// than dropping them off on the home page.
		return <Navigate to='/connect' state={{ from: location }} replace />;
	}

	return children;
};

export default ProtectedRoute;
