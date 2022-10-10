import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./assets/css/index.css"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import "./assets/fonts/Sora-Regular.ttf";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft,  faTicket, faMapLocationDot, faUserSecret } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronLeft)
library.add(faTicket)
library.add(faMapLocationDot)
library.add(faUserSecret)

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
