import React, { useState, } from "react";
import Game from '../game/Game';
import Lobby from '../lobby/Lobby';

const Main = () => {
  return (
    <>
      <Lobby />
      <Game />
    </>
  )
};
export default Main;