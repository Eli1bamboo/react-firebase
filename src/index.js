import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import App from './App';
import './index.css';

firebase.initializeApp({
	apiKey: 'AIzaSyBBQtmRy9wdvpDrqkWWocuU8EnK-9Ac06s',
	authDomain: 'pseudogram-e8c8e.firebaseapp.com',
	databaseURL: 'https://pseudogram-e8c8e.firebaseio.com',
	projectId: 'pseudogram-e8c8e',
	storageBucket: 'pseudogram-e8c8e.appspot.com',
	messagingSenderId: '58949207534'
});

ReactDOM.render(<App />, document.getElementById('root'));
