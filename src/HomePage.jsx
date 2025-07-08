import "./HomePage.css";
import { useLocation } from "react-router-dom";
const HomePage = () => {
  const location = useLocation();
  const { message } = location.state;
  return <>{message && <p>{message}</p>}</>;
};

export default HomePage;
