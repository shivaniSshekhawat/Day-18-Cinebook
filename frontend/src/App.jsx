import { useEffect, useState } from "react";
import { getShows } from "./api";
import ShowGrid from "./components/ShowGrid";
import SeatGrid from "./components/SeatGrid";
import Login from "./components/Login";
import Register from "./components/Register";
import api from "./api";

export default function App() {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      api.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
    }
  }, []);

  useEffect(() => {
    if (user) {
      getShows().then(res => {
        console.log("🚀 ~ App ~ res:", res)
        setShows(res.data)
      });
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
      alert("Booking Successful! 🎉");
      window.history.replaceState({}, document.title, "/");
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setSelectedShow(null);
  };

  if (!user) {
    return (
      <div className="app">
        <h1>🎬 Cinebook</h1>
        <div className="auth-container">
          {isRegistering ? (
            <Register onLogin={handleLogin} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <button 
            className="toggle-auth" 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>🎬 Cinebook</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {!selectedShow && (
        <ShowGrid shows={shows} onSelect={setSelectedShow} />
      )}

      {selectedShow && (
        <SeatGrid
          show={selectedShow}
          onBack={() => setSelectedShow(null)}
        />
      )}
    </div>
  );
}
