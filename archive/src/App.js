import React, { Component } from 'react';
//import logo from './logo.svg';
//<img src={logo} className="App-logo" alt="logo" />
//import './App.css';
//import Attractor from './attractor.component.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Straaaaaaange Attractors</h2>
        </div>
        <Attractor />
      </div>
    );
  }
}

export default App;
