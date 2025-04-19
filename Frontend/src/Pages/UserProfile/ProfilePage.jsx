import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash, Edit, MessageCircle, Heart } from "lucide-react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [userData, setUserData] = useState(null);

  // Get userId from localStorage
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserPosts();

    // Only fetch user data if we have a valid userId
    if (loggedInUserId) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      // Check if your endpoint is /api/user/ or /api/users/
      const response = await axios.get(
        `http://localhost:8080/api/user/${loggedInUserId}`
      );
      setUserData(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      // Don't set any user data, component will use defaults
    }
  };
  const fetchUserPosts = async () => {
    setIsLoading(true);
    try {
      // Check if we have a userId before making the request
      if (!loggedInUserId) {
        setError("User not logged in. Please log in to view posts.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/posts/user/${loggedInUserId}`
      );
      setUserPosts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:8080/api/posts/${postId}`);
        // Update state to remove the deleted post
        setUserPosts(userPosts.filter((post) => post.id !== postId));
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const startEditing = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setEditContent("");
  };

  const saveEdit = async (postId) => {
    try {
      const postToUpdate = userPosts.find((post) => post.id === postId);
      const updatedPost = { ...postToUpdate, content: editContent };

      const response = await axios.put(
        `http://localhost:8080/api/posts/${postId}`,
        updatedPost
      );

      // Update the post in the state
      setUserPosts(
        userPosts.map((post) => (post.id === postId ? response.data : post))
      );

      setEditingPost(null);
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post. Please try again.");
    }
  };

  const addLike = async (postId) => {
    try {
      const likeData = { userId: loggedInUserId };
      await axios.post(
        `http://localhost:8080/api/posts/${postId}/likes`,
        likeData
      );
      fetchUserPosts(); // Refresh posts to show updated like count
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const removeLike = async (postId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/posts/${postId}/likes/${loggedInUserId}`
      );
      fetchUserPosts(); // Refresh posts to show updated like count
    } catch (err) {
      console.error("Error removing like:", err);
    }
  };

  const isPostLiked = (post) => {
    return (
      post.likes && post.likes.some((like) => like.userId === loggedInUserId)
    );
  };

  const renderTabs = () => (
    <div className="profile-tabs">
      <button
        className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
        onClick={() => setActiveTab("posts")}
      >
        My Posts
      </button>
      <button
        className={`tab-button ${activeTab === "liked" ? "active" : ""}`}
        onClick={() => setActiveTab("liked")}
      >
        Liked Posts
      </button>
      <button
        className={`tab-button ${activeTab === "saved" ? "active" : ""}`}
        onClick={() => setActiveTab("saved")}
      >
        Saved Items
      </button>
    </div>
  );

  const renderPostContent = (post) => {
    if (editingPost === post.id) {
      return (
        <div className="edit-content">
          <textarea
            className="edit-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
          />
          <div className="edit-actions">
            <button className="cancel-button" onClick={cancelEditing}>
              Cancel
            </button>
            <button className="save-button" onClick={() => saveEdit(post.id)}>
              Save
            </button>
          </div>
        </div>
      );
    }
    return <p className="post-content">{post.content}</p>;
  };

  const renderPosts = () => {
    if (isLoading)
      return <div className="loading-message">Loading posts...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (userPosts.length === 0)
      return <div className="empty-message">No posts found.</div>;

    return (
      <div className="posts-container">
        {userPosts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-info">
                <h3 className="post-title">
                  {post.description || "Untitled Post"}
                </h3>
                <p className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Only show edit/delete for the post owner */}
              {post.userId === loggedInUserId && (
                <div className="post-actions">
                  <button
                    onClick={() => startEditing(post)}
                    className="action-button edit-button"
                    disabled={editingPost === post.id}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="action-button delete-button"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              )}
            </div>

            {renderPostContent(post)}

            <div className="post-footer">
              <button
                className={`like-button ${isPostLiked(post) ? "liked" : ""}`}
                onClick={() =>
                  isPostLiked(post) ? removeLike(post.id) : addLike(post.id)
                }
              >
                <Heart
                  size={18}
                  className="like-icon"
                  fill={isPostLiked(post) ? "currentColor" : "none"}
                />
                <span>{post.likes ? post.likes.length : 0}</span>
              </button>

              <div className="comment-count">
                <MessageCircle size={18} className="comment-icon" />
                <span>{post.comments ? post.comments.length : 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return renderPosts();
      case "liked":
        return <div className="coming-soon">Liked posts coming soon...</div>;
      case "saved":
        return <div className="coming-soon">Saved items coming soon...</div>;
      default:
        return renderPosts();
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {userData && userData.profileImage ? (
              <img src={userData.profileImage} alt="Profile" />
            ) : (
              <div className="default-avatar"></div>
            )}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">
              {userData ? userData.username : "My Profile"}
            </h2>
            <p className="profile-username">
              {userData ? `@${userData.username}` : "@username"}
            </p>
          </div>
        </div>

        {renderTabs()}
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;
