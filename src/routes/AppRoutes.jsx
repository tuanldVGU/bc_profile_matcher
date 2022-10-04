import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Connect, Home } from '../pages';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
	return (
		<Routes>
			<Route>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
			</Route>
			<Route path='/connect' element={<Connect />} />
			<Route path='*' element={<h1>Page not found</h1>} />
		</Routes>
	);
};

export default AppRoutes;
