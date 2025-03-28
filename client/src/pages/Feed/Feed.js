// external
import React, { useState, useEffect, useCallback } from "react";

// components
import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";

// css
import "./Feed.css";

/**
 * Feed Component
 *
 * A component that manages and displays a feed of posts, including creating, editing, and deleting posts.
 *
 * @param {Object} props - Component props
 * @param {string} props.token - The authentication token for API requests
 * @returns {React.Element} - Rendered feed component
 */
const Feed = ({ token }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user status and posts on component mount
  useEffect(() => {
    fetchUserStatus();
    loadPosts();
  }, []);

  // Fetch user status
  const fetchUserStatus = async () => {
    const graphqlQuery = {
      query: `
        {
          user {
            status
          }
        }
      `,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const resData = await response.json();
      if (resData.errors) {
        throw new Error("Fetching status failed!");
      }
      setStatus(resData.data.user.status);
    } catch (err) {
      setError(err);
    }
  };

  // Load posts
  const loadPosts = useCallback(
    async (direction) => {
      setPostsLoading(true);
      let page = postPage;
      if (direction === "next") {
        page++;
        setPostPage(page);
      } else if (direction === "previous") {
        page--;
        setPostPage(page);
      }

      const graphqlQuery = {
        query: `
        query FetchPosts($page: Int) {
          posts(page: $page) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }
      `,
        variables: {
          page: page,
        },
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/graphql`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
          }
        );
        const resData = await response.json();
        if (resData.errors) {
          throw new Error("Fetching posts failed!");
        }
        setPosts(
          resData.data.posts.posts.map((post) => ({
            ...post,
            imagePath: post.imageUrl,
          }))
        );
        setTotalPosts(resData.data.posts.totalPosts);
      } catch (err) {
        setError(err);
      } finally {
        setPostsLoading(false);
      }
    },
    [postPage, token]
  );

  // Handle status update
  const statusUpdateHandler = async (event) => {
    event.preventDefault();
    const graphqlQuery = {
      query: `
        mutation UpdateUserStatus($userStatus: String!) {
          updateStatus(status: $userStatus) {
            status
          }
        }
      `,
      variables: {
        userStatus: status,
      },
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const resData = await response.json();
      if (resData.errors) {
        throw new Error("Updating status failed!");
      }
      console.log(resData);
    } catch (err) {
      setError(err);
    }
  };

  // Handle new post creation
  const newPostHandler = () => {
    setIsEditing(true);
  };

  // Handle starting post edit
  const startEditPostHandler = (postId) => {
    const loadedPost = posts.find((p) => p._id === postId);
    setIsEditing(true);
    setEditPost(loadedPost);
  };

  // Handle canceling post edit
  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  // Handle finishing post edit
  const finishEditHandler = async (postData) => {
    setEditLoading(true);
    const formData = new FormData();
    formData.append("image", postData.image);
    if (editPost) {
      formData.append("oldPath", editPost.imagePath);
    }

    try {
      const fileResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/post-image`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        }
      );
      const fileResData = await fileResponse.json();
      const imageUrl = fileResData.filePath || "undefined";

      let graphqlQuery;
      if (editPost) {
        graphqlQuery = {
          query: `
            mutation UpdateExistingPost($postId: ID!, $title: String!, $content: String!, $imageUrl: String!) {
              updatePost(id: $postId, postInput: {title: $title, content: $content, imageUrl: $imageUrl}) {
                _id
                title
                content
                imageUrl
                creator {
                  name
                }
                createdAt
              }
            }
          `,
          variables: {
            postId: editPost._id,
            title: postData.title,
            content: postData.content,
            imageUrl: imageUrl,
          },
        };
      } else {
        graphqlQuery = {
          query: `
            mutation CreateNewPost($title: String!, $content: String!, $imageUrl: String!) {
              createPost(postInput: {title: $title, content: $content, imageUrl: $imageUrl}) {
                _id
                title
                content
                imageUrl
                creator {
                  name
                }
                createdAt
              }
            }
          `,
          variables: {
            title: postData.title,
            content: postData.content,
            imageUrl: imageUrl,
          },
        };
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const resData = await response.json();
      if (resData.errors) {
        throw new Error(resData.errors[0].message || "Post operation failed!");
      }

      const post = {
        _id: resData.data[editPost ? "updatePost" : "createPost"]._id,
        title: resData.data[editPost ? "updatePost" : "createPost"].title,
        content: resData.data[editPost ? "updatePost" : "createPost"].content,
        creator: resData.data[editPost ? "updatePost" : "createPost"].creator,
        createdAt:
          resData.data[editPost ? "updatePost" : "createPost"].createdAt,
        imagePath:
          resData.data[editPost ? "updatePost" : "createPost"].imageUrl,
      };

      setPosts((prevPosts) => {
        let updatedPosts = [...prevPosts];
        if (editPost) {
          const postIndex = prevPosts.findIndex((p) => p._id === editPost._id);
          updatedPosts[postIndex] = post;
        } else {
          updatedPosts.unshift(post);
        }
        return updatedPosts;
      });

      setIsEditing(false);
      setEditPost(null);
      if (!editPost) {
        loadPosts();
      }
    } catch (err) {
      setError(err);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle post deletion
  const deletePostHandler = async (postId) => {
    setPostsLoading(true);
    const graphqlQuery = {
      query: `
        mutation {
          deletePost(id: "${postId}")
        }
      `,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const resData = await response.json();
      if (resData.errors) {
        throw new Error("Deleting the post failed!");
      }
      loadPosts();
    } catch (err) {
      setError(err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Handle error
  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorHandler error={error} onHandle={errorHandler} />
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
      />
      <section className="feed__status">
        <form onSubmit={statusUpdateHandler}>
          <Input
            type="text"
            placeholder="Your status"
            control="input"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          />
          <Button mode="flat" type="submit">
            Update
          </Button>
        </form>
      </section>
      <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section className="feed">
        {postsLoading && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Loader />
          </div>
        )}
        {posts.length <= 0 && !postsLoading ? (
          <p style={{ textAlign: "center" }}>No posts found.</p>
        ) : null}
        {!postsLoading && (
          <Paginator
            onPrevious={() => loadPosts("previous")}
            onNext={() => loadPosts("next")}
            lastPage={Math.ceil(totalPosts / 2)}
            currentPage={postPage}
          >
            {posts.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                author={post.creator.name}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                image={post.imageUrl}
                content={post.content}
                onStartEdit={() => startEditPostHandler(post._id)}
                onDelete={() => deletePostHandler(post._id)}
              />
            ))}
          </Paginator>
        )}
      </section>
    </>
  );
};

export default Feed;
