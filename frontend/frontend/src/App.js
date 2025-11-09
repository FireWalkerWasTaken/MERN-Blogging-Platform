import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Posts from "./components/Posts";
import CreatePost from "./components/CreatePost";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { token, logout } = useAuth();

  return (
    <Router>
      <nav>
        <Link to="/">Posts</Link> |{" "}
        {token ? (
          <>
            <Link to="/create">Create</Link> | <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
