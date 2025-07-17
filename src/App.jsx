import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import "./components/styling/App.css";
import RoomPage from "./RoomPage";
import RoomFormPage from "./RoomFormPage";
import NotFound from "./NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/room/:roomId" element={<RoomPage />}></Route>
        <Route path="/create-room" element={<RoomFormPage />}></Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
