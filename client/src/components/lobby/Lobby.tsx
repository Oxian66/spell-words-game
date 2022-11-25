import React, { useState, useEffect } from "react";
import { Typography, Badge } from 'antd';
import { socket } from "../../App";

interface Player {
  id: string;
  playerName: string;
}


const Lobby = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => {
    socket.on('players', (pl) => {
      console.log('pl', pl);
      setPlayers(pl)
    })
    
  },[]);

  return (
    <>
      {players.map((player:Player) => (
        <Typography>example player: {player.playerName} </Typography>
      ))}
    </>
  )
};

export default Lobby;