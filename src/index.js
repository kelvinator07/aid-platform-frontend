import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { createConsumer } from '@rails/actioncable';
import actionCable from 'actioncable';

const CableApp = {}

CableApp.cable = actionCable.createConsumer('ws://localhost:5000/cable')

const Consumer = createConsumer('ws://localhost:5000/cable');

ReactDOM.render(
  <BrowserRouter>
    <App cableApp={CableApp} consumer={Consumer}/>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
