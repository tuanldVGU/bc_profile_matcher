import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Connect, Home, Map, Movie, Match } from '../pages';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
	const [movies, setMovies] = useState([])
	const [locations, setLocations] = useState([])

	return (
		<Routes>
			<Route>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<Home movies={movies} locations={locations}/>
						</ProtectedRoute>
					}
				/>
			</Route>
			<Route path='/map' element= {
				<ProtectedRoute>
					<Map markers={locations} setMarker={setLocations}/>
				</ProtectedRoute>
			}></Route>
			<Route path='/movie' element= {
				<ProtectedRoute>
					<Movie selected={movies} setSelected={setMovies}/>
				</ProtectedRoute>
			}></Route>
			<Route path='/match' element= {
				<ProtectedRoute>
					<Match movies={movies} locations={locations}/>
				</ProtectedRoute>
			}></Route>
			<Route path='/connect' element={<Connect />} />
			<Route path='*' element={<h1>Page not found</h1>} />
		</Routes>
	);
};

export default AppRoutes;
