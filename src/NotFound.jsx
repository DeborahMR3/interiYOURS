import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <h2>Page Not Found</h2>
      <p>
        Sorry, the room you're looking for does not exist. Please navigate back
        to the home page using the button below
      </p>
      <button onClick={() => navigate("/home")}>Go to Home Page</button>
    </>
  );
};

export default NotFound;
