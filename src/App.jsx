import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import "./App.css";
import RoomPage from "./components/RoomPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/room/:roomId" element={<RoomPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
