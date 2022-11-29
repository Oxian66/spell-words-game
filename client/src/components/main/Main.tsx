import { Row, Col } from 'antd';
import React, { useState, } from "react";
import Game from '../game/Game';
import Lobby from '../lobby/Lobby';
import cl from '../game/game.module.css';

const Main = () => {
  
  return (

    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around" align="middle">
      <Col span={6}>
        <Lobby />
      </Col>
  
      <Col span={6} style={{"marginTop": "2rem"}}>
        <Game />
      </Col>
      <Col span={6}>
        <img src="/cute-toast-cat.png" alt="cat" className={cl.cat_animation} />
      </Col>
    </Row>

  )
};
export default Main;