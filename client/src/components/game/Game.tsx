import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Layout, Typography, Spin } from "antd";
import { useLocation } from "react-router-dom";
import cl from "./game.module.css";

import toast from "react-hot-toast";
import { socket } from "../../App";
interface Letter {
  id: string;
  value: string;
  selected?: boolean;
}

const Game = (): React.ReactElement => {
  const [pushLetters, setPushLetters] = useState<Letter[]>([]);
  const [larr, setLarr] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const id = e.currentTarget.getAttribute("name");
    const pl = [...pushLetters, ...larr.filter((l) => l.id === id)];
    setLarr(larr.map(l => l.id === id ? {...l, selected: true } : l));
    setPushLetters(pl);
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
    ref.current = setTimeout(
      (x) => {
        socket.emit("player_input", x);
        setPushLetters([]);
        setLarr(larr.map((l) => ({...l, selected: false })));
      },
      3000,
      pl
    );
  };
  useEffect(() => {
    setLoading(true);
    socket.on("game", (letters: Letter[]) => {
      setLarr(letters.map(el => ({ ...el, selected: false })));
      setTimeout(() => setLoading(false), 1000);
    });
    socket.on("update_letters", (letters: Letter[]) => {
      setLarr(letters.map(el => ({ ...el, selected: false })));
    });
    socket.on("user_input", ({ isCorrect, score }: { isCorrect: boolean, score: number }) => {
      if (isCorrect) {
        toast.success("correct");
        setScore((p) => p + score);
        setPushLetters([]);
      } else {
        toast.error("incorrect");
      }
    });
    socket.emit("game");
  }, []);

  useEffect(() => {
    console.log(pushLetters);
  }, [pushLetters]);

  return (
    <Layout
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography.Title italic>{`Hello ${location.state}`}</Typography.Title>
      <Typography.Title level={5} italic>{`Score: ${score}`}</Typography.Title>
      {!loading ? (
        <Layout.Content>
          <Card bordered>
            <div className={cl.wrap}>
              {larr.map((letter) => (
                <div key={letter.id}>
                  <Button
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
      <img src="/cute-toast-cat.png" alt="cat" className={cl.cat_animation} />
    </Layout>
  );
};
export default Game;
