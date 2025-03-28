// external
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

// components
import Image from "../../../components/Image/Image";

// css
import "./SinglePost.css";

/**
 * SinglePost Component
 *
 * A component that fetches and displays a single post's details.
 *
 * @param {Object} props - Component props
 * @param {string} props.token - The authentication token for API requests
 * @returns {React.Element} - Rendered single post component
 */
const SinglePost = ({ token }) => {
  const [post, setPost] = useState({
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  });

  const { postId } = useParams(); // Get postId from URL params

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      const graphqlQuery = {
        query: `
          query FetchSinglePost($postId: ID!) {
            post(id: $postId) {
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
          postId: postId,
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
          throw new Error("Fetching post failed!");
        }

        const postData = resData.data.post;
        setPost({
          title: postData.title,
          author: postData.creator.name,
          image: `${process.env.REACT_APP_API_URL}/${postData.imageUrl}`,
          date: new Date(postData.createdAt).toLocaleDateString("en-US"),
          content: postData.content,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [postId, token]);

  return (
    <section className="single-post" aria-labelledby="post-title">
      <h1 id="post-title">{post.title}</h1>
      <h2>
        Created by {post.author} on {post.date}
      </h2>
      <div className="single-post__image">
        <Image contain imageUrl={post.image} alt={post.title} />
      </div>
      <p>{post.content}</p>
    </section>
  );
};

export default SinglePost;
