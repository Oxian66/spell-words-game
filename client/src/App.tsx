import React, {  } from 'react';
import { Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';
import openSocket from 'socket.io-client';
import Login from './components/login/Login';
import Game from './components/game/Game';

export const socket = openSocket('http://localhost:3001');
socket.on('connect', () => {
  console.log('connect new client');
});
socket.on('disconnect', () => {
  socket.removeAllListeners();
})



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/game" element={<Game />}></Route>
      </Routes>
      <Toaster />
    </div>
    
  );
}

export default App;
