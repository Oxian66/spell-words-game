import React, { useState, useEffect, } from "react";
import { Typography, Badge, Avatar } from 'antd';
import { socket } from "../../App";
import { Player } from '../interfaces';


const Lobby = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [score, setScore] = useState(0);
  useEffect(() => {
    socket.on('players', (pl) => {
      console.log('pl', pl);
      setPlayers(pl);
    });
   
  },[]);
  let count = 1;

  return (
    <>
      {players.map((player:Player) => (
        <React.Fragment key={player.id}>
        <Badge count={1}>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
        </Badge>
        <Typography.Title level={4}>{`Player ${count++}: ${player.playerName}`}</Typography.Title>
        </React.Fragment> 
      ))}
    </>
  )
};

export default Lobby;