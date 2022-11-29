import React, { useState, useEffect, useRef,  } from "react";
import { Button, Card, Layout, Typography, Spin, } from "antd";
import { useLocation } from "react-router-dom";
import cl from "./game.module.css";
import toast from "react-hot-toast";
import { socket } from "../../App";
import { Letter, Point } from '../interfaces';

const Game = (): React.ReactElement => {
  const [pushLetters, setPushLetters] = useState<Letter[]>([]);
  const [larr, setLarr] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [oldPoint, setOldPoint] = useState<Point | null>(null);
  const [isTurnNow, setIsTurnNow] = useState<boolean | null>(null);
  const location = useLocation();
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isNeighbours = (point1: Point | null, point2: Point): boolean => {
    if (point1 === null) return true;
    const dx = Math.abs(point1.x - point2.x);
    const dy = Math.abs(point1.y - point2.y);
    if (dx <= 1 && dy <= 1) return true;
    return false;
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const id = e.currentTarget.getAttribute("name");
    const coords = JSON.parse(e.currentTarget.getAttribute('data-coords')!);
    let pl = pushLetters;
    if (isNeighbours(oldPoint, coords)) {
      setOldPoint(coords);
      pl = [...pushLetters, ...larr.filter((l) => l.id === id)];
      setLarr(larr.map((l) => (l.id === id ? { ...l, selected: true } : l)));
      setPushLetters(pl);
    } else {
      toast.error('You can\'t do it')  
    }
    
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
    ref.current = setTimeout(
      (x) => {
        socket.emit("player_input", x);
        setPushLetters([]);
        setOldPoint(null);
        setLarr(larr.map((l) => ({ ...l, selected: false })));
      },
      3000,
      pl
    );
  };

  useEffect(() => {
    setLoading(true);
    socket.on("game", (letters: Letter[]) => {
      setLarr(letters.map((el) => ({ ...el, selected: false })));
      setTimeout(() => setLoading(false), 1000);
    });
    socket.on('set_player_input', (isTurn) => setIsTurnNow(isTurn.message));
    socket.on("update_letters", (letters: Letter[]) => {
      setLarr(letters.map((el) => ({ ...el, selected: false })));
    });
    socket.on(
      "user_input",
      ({ isCorrect, score }: { isCorrect: boolean; score: number }) => {
        if (isCorrect) {
          toast.success("correct");
          setScore((p) => p + score);
          setPushLetters([]);
        } else {
          toast.error("incorrect");
        }
      }
    );
    socket.emit("game");
    socket.emit("get_player", location.state);
  }, []);

  useEffect(() => {
    console.log(pushLetters);
  }, [pushLetters]);

  return (
      <Layout style={{'alignItems': 'center'}}>
        <Typography.Title italic>{`Hello ${location.state}`}</Typography.Title>
        <Typography.Title
          level={5}
          italic
        >{`Score: ${score}`}</Typography.Title>
        {!loading ? (
          <Layout.Content>
            <Card bordered>
              <div className={cl.wrap}>
                {larr.map((letter, i) => (
                  <div key={letter.id}>
                    <Button
                    disabled={isTurnNow ? false : true}
                      data-coords={JSON.stringify({ x: i % 8, y: Math.trunc(i / 8) })}
                      onClick={handleClick}
                      name={letter.id}
                      type={letter.selected ? "primary" : "ghost"}
                      shape="circle"
                      style={{ margin: "0.5rem" }}
                    >
                      {letter.value}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </Layout.Content>
        ) : (
          <Spin />
        )}
      </Layout>

  );
};
export default Game;
