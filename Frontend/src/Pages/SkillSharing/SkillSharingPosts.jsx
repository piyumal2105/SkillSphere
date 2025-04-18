import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SkillSharingPosts.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function SkillSharingPosts() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newPost, setNewPost] = useState({
    description: "",
    mediaFiles: [],
    mediaUrls: [],
  });

  const [comments, setComments] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }

    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/posts`);
      const updatedPosts = response.data.map((post) => {
        const updatedMediaUrls = post.mediaUrls.map((url) => {
          if (!url.startsWith("http")) {
            return `${API_BASE_URL}/${url}`;
          }
          return url;
        });
        return { ...post, mediaUrls: updatedMediaUrls };
      });
      setPosts(updatedPosts);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("You can only upload a maximum of 3 files");
      return;
    }

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length !== files.length) {
      alert("Only images and videos are allowed");
    }

    const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setNewPost({
      ...newPost,
      mediaFiles: validFiles,
      mediaUrls: previewUrls,
    });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!newPost.description.trim() && newPost.mediaFiles.length === 0) {
      alert("Please add a description or media files");
      return;
    }

    try {
      const uploadedUrls = newPost.mediaUrls;

      const postData = {
        userId: user.id,
        userName: user.name,
        description: newPost.description,
        mediaUrls: uploadedUrls,
      };

      const response = await axios.post(
        `${API_BASE_URL}/posts/user/${user.id}`,
        postData
      );
      setPosts([response.data, ...posts]);

      setNewPost({
        description: "",
        mediaFiles: [],
        mediaUrls: [],
      });
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setComments({
      ...comments,
      [postId]: value,
    });
  };

  const handleAddComment = async (postId) => {
    if (!comments[postId] || !comments[postId].trim()) {
      return;
    }

    try {
      const commentData = {
        userId: user.id,
        userName: user.name,
        content: comments[postId],
      };

      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/comments`,
        commentData
      );

      setPosts(
        posts.map((post) => (post.id === postId ? response.data : post))
      );
      setComments({ ...comments, [postId]: "" });
    } catch (err) {
      setError("Failed to add comment");
      console.error(err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/posts/${postId}/comments/${commentId}?userId=${user.id}`
      );
      setPosts(
        posts.map((post) => (post.id === postId ? response.data : post))
      );
    } catch (err) {
      setError("Failed to delete comment");
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      const alreadyLiked =
        post.likes && post.likes.some((like) => like.userId === user.id);

      let response;
      if (alreadyLiked) {
        response = await axios.delete(
          `${API_BASE_URL}/posts/${postId}/likes/${user.id}`
        );
      } else {
        const likeData = {
          userId: user.id,
          userName: user.name,
        };
        response = await axios.post(
          `${API_BASE_URL}/posts/${postId}/likes`,
          likeData
        );
      }

      setPosts(
        posts.map((post) => (post.id === postId ? response.data : post))
      );
    } catch (err) {
      setError("Failed to update like");
      console.error(err);
    }
  };

  const isPostLikedByUser = (post) => {
    return post.likes && post.likes.some((like) => like.userId === user?.id);
  };

  return (
    <div className="skill-sharing-page">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <h1>Skill Sharing Posts</h1>
      </header>

      <div className="post-create-section">
        <h2>Share Your Skills</h2>
        <form onSubmit={handlePostSubmit} className="post-form">
          <textarea
            placeholder="Describe what you're sharing..."
            value={newPost.description}
            onChange={(e) =>
              setNewPost({ ...newPost, description: e.target.value })
            }
            className="post-textarea"
          />

          <div className="media-upload">
            <label htmlFor="media-files" className="media-label">
              Add Photos/Videos (Max 3)
            </label>
            <input
              type="file"
              id="media-files"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {newPost.mediaUrls.length > 0 && (
            <div className="media-previews">
              {newPost.mediaUrls.map((url, index) => (
                <div key={index} className="media-preview">
                  {/\.(jpe?g|png|gif)$/i.test(url) ? (
                    <img src={url} alt="Preview" />
                  ) : (
                    <video src={url} controls />
                  )}
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="post-button">
            Share Post
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="posts-section">
        <h2>Community Posts</h2>

        {loading && <div className="loading-spinner">Loading...</div>}

        {posts.length === 0 && !loading ? (
          <div className="no-posts">No posts yet. Be the first to share!</div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Profile"
                    className="post-user-icon"
                  />
                  <div className="post-user-info">
                    <span className="post-username">{post.userName}</span>
                    <span className="post-time">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="post-description">{post.description}</p>

                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="post-media">
                    {post.mediaUrls.map((url, index) => (
                      <div key={index} className="media-item">
                        {/\.(jpe?g|png|gif)$/i.test(url) ? (
                          <img src={url} alt="Post media" />
                        ) : (
                          <video src={url} controls />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="post-actions">
                  <button
                    className={`like-button ${
                      isPostLikedByUser(post) ? "liked" : ""
                    }`}
                    onClick={() => handleLike(post.id)}
                  >
                    {isPostLikedByUser(post) ? "❤️" : "🤍"}{" "}
                    {post.likes?.length || 0}{" "}
                    {post.likes?.length === 1 ? "Like" : "Likes"}
                  </button>
                </div>

                <div className="comments-section">
                  <h4>Comments ({post.comments?.length || 0})</h4>

                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comments[post.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post.id, e.target.value)
                      }
                      className="comment-input"
                    />
                    <button
                      className="comment-button"
                      onClick={() => handleAddComment(post.id)}
                    >
                      Add Comment
                    </button>
                  </div>

                  <div className="comments-list">
                    {post.comments?.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <p className="comment-author">
                          {comment.userName}:{" "}
                          <span className="comment-content">
                            {comment.content}
                          </span>
                        </p>
                        {comment.userId === user?.id && (
                          <button
                            className="delete-comment"
                            onClick={() =>
                              handleDeleteComment(post.id, comment.id)
                            }
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
