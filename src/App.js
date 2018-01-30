import React, { Component } from 'react'
import firebase from 'firebase'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import './App.css'
import FileUpload from './FileUpload'

class App extends Component {
  constructor () {
    super()
    this.state = {
      user: null,
      pictures: []
    }

    this.handleUpload = this.handleUpload.bind(this)
  }

  componentWillMount () {
    // Cada vez que el método 'onAuthStateChanged' se dispara, recibe un objeto (user)
    // Lo que hacemos es actualizar el estado con el contenido de ese objeto.
    // Si el usuario se ha autenticado, el objeto tiene información.
    // Si no, el usuario es 'null'
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        user
      })
    })

    firebase.database().ref('pictures').on('child_added', (snapshot) => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
    })
  }

  handleLogout () {
    firebase
      .auth()
      .signOut()
      .then((result) => console.log(`${result.user.email} ha iniciado sesión`))
      .catch((error) => console.log(`Error ${error.code}: ${error.message}`))
  }

  handleUpload (event) {
    const file = event.target.files[0]
    const storageRef = firebase.storage().ref(`fotos/${file.name}`)
    const task = storageRef.put(file)

    // Listener que se ocupa del estado de la carga del fichero
    task.on(
      'state_changed',
      (snapshot) => {
        // Calculamos el porcentaje de tamaño transferido y actualizamos
        // el estado del componente con el valor
        let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100
        this.setState({
          uploadValue: percentage
        })
      },
      (error) => {
        // Ocurre un error
        console.error(error.message)
      },
      () => {
        // Subida completada
        // Obtenemos la URL del fichero almacenado en Firebase storage
        // Obtenemos la referencia a nuestra base de datos 'pictures'
        // Creamos un nuevo registro en ella
        // Guardamos la URL del enlace en la DB
        const record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: task.snapshot.downloadURL
        }
        const dbRef = firebase.database().ref('pictures')
        const newPicture = dbRef.push()
        newPicture.set(record)
      }
    )
  }

  renderLoginButton () {
    if (!this.state.user) {
      return <LogIn />
    } else {
      return (
        <div>
          <nav className='blue darken-4'>
            <div className='nav-wrapper container'>
              <a href='#' className='left brand-logo'>
                appName
              </a>
              <ul className='navbar right'>
                <li>
                  <img
                    width='32'
                    className='avatar circle responsive-img'
                    src={this.state.user.photoURL}
                  />
                </li>
                <li> {this.state.user.displayName} </li>
                <li>
                  <button
                    className='waves-effect waves-light btn blue darken-1'
                    onClick={this.handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </nav>
          <div className='row'>
            <FileUpload onUpload={this.handleUpload} />
          </div>
          <div className='row'>
            {this.state.pictures
              .map((picture) => (
                <div className='col s12 m3'>
                  <div className='card'>
                    <div className='card-image'>
                      <img src={picture.image} />
                    </div>
                    <div className='card-content'>
                      <p>
                        <img
                          width='32'
                          className='circle'
                          src={picture.photoURL}
                          alt={picture.displayName}
                        />
                        {picture.displayName}
                      </p>
                    </div>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        </div>
      )
    }
  }

  render () {
    return (
      <MuiThemeProvider>
        <Header user={this.state.user} />
        {this.renderLoginButton()}
      </MuiThemeProvider>
    )
  }
}

export default App
