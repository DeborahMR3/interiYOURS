import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import "./App.css";
import RoomFormPage from "./RoomFormPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/create-room" element={<RoomFormPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
