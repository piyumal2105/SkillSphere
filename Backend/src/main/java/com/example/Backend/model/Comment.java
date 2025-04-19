package com.example.Backend.model;

import java.util.Date;

public class Comment {
    private String id;
    private String userId;
    private String userName;
    private String content;
    private Date createdAt;
    private Date updatedAt;

    // Getters, setters, constructors
    public Comment() {
    }

    public Comment(String id, String userId, String userName, String content, Date createdAt, Date updatedAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.util.Date createdAt) {
        this.createdAt = (Date) createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.util.Date updatedAt) {
        this.updatedAt = (Date) updatedAt;
    }
}
