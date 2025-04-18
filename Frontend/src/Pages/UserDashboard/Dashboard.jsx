import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="profile-area">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile"
            className="profile-icon"
          />
          <span className="username">
            {user ? `Welcome, ${capitalizeName(user.name)}` : "Loading..."}
          </span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <h2>Your Dashboard</h2>

        <div className="dashboard-grid">
          <div className="card" onClick={() => navigate("/skill-sharing")}>
            <h3>📷 Skill Sharing Posts</h3>
            <p>Share photos, videos, and tips with the community.</p>
          </div>

          <div className="card" onClick={() => navigate("/learning-progress")}>
            <h3>📘 Learning Progress</h3>
            <p>Update your progress using predefined templates.</p>
          </div>

          <div className="card" onClick={() => navigate("/learning-plan")}>
            <h3>📅 Learning Plans</h3>
            <p>Create and update your structured learning journey.</p>
          </div>

          <div
            className="card"
            onClick={() => navigate(`/profile/${user?.id}`)}
          >
            <h3>👤 Profile</h3>
            <p>View your skill posts, plans, and followers.</p>
          </div>
        </div>
      </main>

      <style>{`
        .dashboard-page {
          font-family: sans-serif;
          padding: 20px;
          background: #f0f4f8;
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .profile-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .profile-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .username {
          font-size: 1.1rem;
          font-weight: 600;
          color: #3b82f6;
        }

        .logout-button {
          background: #3b82f6;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .logout-button:hover {
          background: #2563eb;
        }

        .dashboard-content h2 {
          margin-bottom: 20px;
          color: #1f2937;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .card {
          background: white;
          padding: 24px;
          border-radius: 10px;
          border-left: 5px solid #3b82f6;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .card h3 {
          color: #3b82f6;
          margin-bottom: 10px;
        }

        .card p {
          color: #4b5563;
        }
      `}</style>
    </div>
  );
}
