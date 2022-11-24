import React, { ChangeEvent, useState } from "react";
import { Layout, Input, Button, Typography} from "antd";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const handleUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleClick = () => {
    navigate("/game", {state: userName});
  };

  return (
    <Layout
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#A09ABC",
      }}
    > 
      <Typography.Title italic>Welcome to a spell game</Typography.Title>
      <Typography.Title level={5} italic>You got 1 point for 3 letters word, 2 points for word not less 6 letters and 3 points for more.</Typography.Title>
      <Input.Group
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Input
          style={{ width: "40%", borderRadius: '7px' }}
          onChange={handleUserName}
          placeholder="Enter your name"
          onPressEnter={() => handleClick()}
        />
        <Button
          type="primary"
          onClick={() => handleClick()}
          disabled={userName.length < 3}
          style={{ borderRadius: '7px' }}
        >
          Submit
        </Button>
      </Input.Group>
    </Layout>
  );
};
export default Login;
