import React from 'react';
import { render } from 'react-dom';
import App from './App';

const element = <App />;
const container = document.getElementById('root');

render(element, container);

if (ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
