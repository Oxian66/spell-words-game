import React, {  } from 'react';
import { Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';
import openSocket from 'socket.io-client';
import Login from './components/login/Login';
import Main from './components/main/Main';

export const socket = openSocket('http://localhost:3001');
socket.on('connect', () => {
  console.log('connect new client');
  socket.emit('whose_turn');
});
socket.on('disconnect', () => {
  socket.removeAllListeners();
})


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/game" element={<Main />}></Route>
      </Routes>
      <Toaster />
    </div>
    
  );
}

export default App;
