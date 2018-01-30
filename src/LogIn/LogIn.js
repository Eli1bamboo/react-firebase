import React, { Component } from 'react'
import firebase from 'firebase'

export default class LogIn extends Component {
  constructor () {
    super()
  }
  handleGoogleAuth = () => {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => console.log(`${result.user.email} ha iniciado sesión`))
      .catch((error) => console.log(`Error ${error.code}: ${error.message}`))
  }

  handleFacebookAuth = () => {
    const provider = new firebase.auth.FacebookAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => console.log(`${result.user.email} ha iniciado sesión`))
      .catch((error) => console.log(`Error ${error.code}: ${error.message}`))
  }
  render () {
    ;<div>
      <button onClick={this.handleGoogleAuth} className='App-btn'>
        Iniciar sesión con Google
      </button>
      <button onClick={this.handleFacebookAuth} className='App-btn'>
        Iniciar sesión con Facebook
      </button>
    </div>
  }
}
