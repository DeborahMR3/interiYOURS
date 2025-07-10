import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import "./App.css";
import LayoutView from "./components/LayoutView";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/layout-view" element={<LayoutView />}></Route>
      </Routes>
    </>
  );
}

export default App;
