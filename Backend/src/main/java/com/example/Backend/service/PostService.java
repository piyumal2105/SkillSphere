package com.example.Backend.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Backend.model.Comment;
import com.example.Backend.model.Like;
import com.example.Backend.model.Post;
import com.example.Backend.repository.PostRepository;

// PostService.java
@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    // Create a new post
    public Post createPost(Post post) {
        if (post.getUserId() == null || post.getUserId().isEmpty()) {
            throw new IllegalArgumentException("User ID is required");
        }
        post.setUserName("Unknown User");
        post.setCreatedAt(new java.sql.Date(new Date().getTime()));
        post.setUpdatedAt(new java.sql.Date(new Date().getTime()));
        post.setLikes(new ArrayList<>());
        post.setComments(new ArrayList<>());
        return postRepository.save(post);
    }

    // Get all posts (paginated)
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get post by ID
    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow();
    }

    // Get posts by user ID
    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    // Update a post
    public Post updatePost(String id, Post postDetails) {
        Post post = getPostById(id);
        post.setDescription(postDetails.getDescription());
        post.setMediaUrls(postDetails.getMediaUrls());
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    // Delete a post
    public void deletePost(String id) {
        Post post = getPostById(id);
        postRepository.delete(post);
    }

    // Add a comment to a post
    public Post addComment(String postId, Comment comment) {
        Post post = getPostById(postId);
        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(new Date());
        post.getComments().add(comment);
        return postRepository.save(post);
    }

    // Update a comment
    public Post updateComment(String postId, String commentId, Comment commentDetails) {
        Post post = getPostById(postId);
        post.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .ifPresent(c -> {
                    c.setContent(commentDetails.getContent());
                    c.setUpdatedAt(new Date());
                });
        return postRepository.save(post);
    }

    // Delete a comment
    public Post deleteComment(String postId, String commentId, String userId) {
        Post post = getPostById(postId);
        // Check if user is the comment owner or post owner
        boolean isPostOwner = post.getUserId().equals(userId);
        post.setComments(post.getComments().stream()
                .filter(c -> !(c.getId().equals(commentId) && (c.getUserId().equals(userId) || isPostOwner)))
                .collect(Collectors.toList()));
        return postRepository.save(post);
    }

    // Add a like to a post
    public Post addLike(String postId, Like like) {
        Post post = getPostById(postId);
        if (post.getLikes() == null) {
            post.setLikes(new ArrayList<>());
        }
        // Check if user already liked the post
        boolean alreadyLiked = post.getLikes().stream()
                .anyMatch(l -> l.getUserId().equals(like.getUserId()));

        if (!alreadyLiked) {
            like.setCreatedAt(new Date());
            post.getLikes().add(like);
            return postRepository.save(post);
        }
        return post;
    }

    // Remove a like from a post
    public Post removeLike(String postId, String userId) {
        Post post = getPostById(postId);
        post.setLikes(post.getLikes().stream()
                .filter(like -> !like.getUserId().equals(userId))
                .collect(Collectors.toList()));
        return postRepository.save(post);
    }
}
