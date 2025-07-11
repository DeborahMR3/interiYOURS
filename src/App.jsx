// import { Routes, Route } from "react-router-dom";
// import LoginPage from "./LoginPage";
// import HomePage from "./components/HomePage";
// // import "./App.css";
// import "./styling/App.css";
// import RoomPage from "./RoomPage";
// import RoomFormPage from "./RoomFormPage";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import "./components/styling/App.css";
import RoomPage from "./RoomPage";
import RoomFormPage from "./RoomFormPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/room/:roomId" element={<RoomPage />}></Route>
        <Route path="/create-room" element={<RoomFormPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
