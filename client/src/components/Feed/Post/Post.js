// external
import React from "react";

// components
import Button from "../../Button/Button";

// css
import "./Post.css";

/**
 * Post Component
 *
 * A component that displays a post with its metadata (author, date, title) and actions (View, Edit, Delete).
 *
 * @param {Object} props - Component props
 * @param {string} props.author - The author of the post
 * @param {string} props.date - The date the post was created
 * @param {string} props.title - The title of the post
 * @param {string} props.id - The ID of the post (used for the "View" button link)
 * @param {Function} props.onStartEdit - Callback function triggered when the "Edit" button is clicked
 * @param {Function} props.onDelete - Callback function triggered when the "Delete" button is clicked
 * @returns {React.Element} - Rendered post component
 */
const Post = ({ author, date, title, id, onStartEdit, onDelete }) => {
  return (
    <article className="post">
      <header className="post__header">
        <h3 className="post__meta">
          Posted by {author} on {date}
        </h3>
        <h1 className="post__title">{title}</h1>
      </header>
      {/* Uncomment if you want to include an image and content section */}
      {/* <div className="post__image">
        <Image imageUrl={props.image} contain />
      </div>
      <div className="post__content">{props.content}</div> */}
      <div className="post__actions">
        <Button mode="flat" link={`/posts/${id}`}>
          View
        </Button>
        <Button mode="flat" onClick={onStartEdit}>
          Edit
        </Button>
        <Button mode="flat" design="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </article>
  );
};

export default Post;
