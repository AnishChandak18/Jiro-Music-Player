import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import Auth from './components/Auth';
import store from './reduxStore/store';
import MusicPLayer from './components/MusicPLayer';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route exact path="/" element={<Auth />} />
        <Route path="/player" element={<MusicPLayer />} />
      </Routes>
    </Provider>
  );
}

export default App;