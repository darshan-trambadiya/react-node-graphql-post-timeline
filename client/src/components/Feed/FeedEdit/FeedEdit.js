// external
import React, { useState, useEffect } from "react";

// components
import Backdrop from "../../Backdrop/Backdrop";
import Modal from "../../Modal/Modal";
import Input from "../../Form/Input/Input";
import FilePicker from "../../Form/Input/FilePicker";
import Image from "../../Image/Image";

// utils
import { required, length } from "../../../utils/validators";
import { generateBase64FromImage } from "../../../utils/image";

// Initial form state
const POST_FORM = {
  title: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5, max: 50 })],
  },
  image: {
    value: "",
    valid: false,
    touched: false,
    validators: [required],
  },
  content: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5, max: 5000 })],
  },
};

/**
 * FeedEdit Component
 *
 * A component for editing or creating a post. It includes a form with fields for title, image, and content.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.editing - Whether the component is in editing mode
 * @param {Object} [props.selectedPost] - The post being edited (if in editing mode)
 * @param {Function} props.onCancelEdit - Callback function triggered when editing is canceled
 * @param {Function} props.onFinishEdit - Callback function triggered when editing is finished
 * @param {boolean} [props.loading] - Whether the component is in a loading state
 * @returns {React.Element} - Rendered form for editing or creating a post
 */
const FeedEdit = ({
  editing,
  selectedPost,
  onCancelEdit,
  onFinishEdit,
  loading,
}) => {
  const [postForm, setPostForm] = useState(POST_FORM);
  const [formIsValid, setFormIsValid] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Update form when editing a selected post
  useEffect(() => {
    if (editing && selectedPost) {
      const updatedForm = {
        title: {
          ...POST_FORM.title,
          value: selectedPost.title,
          valid: true,
        },
        image: {
          ...POST_FORM.image,
          value: selectedPost.imagePath,
          valid: true,
        },
        content: {
          ...POST_FORM.content,
          value: selectedPost.content,
          valid: true,
        },
      };
      setPostForm(updatedForm);
      setFormIsValid(true);
      setImagePreview(
        `${process.env.REACT_APP_API_URL}/${selectedPost.imagePath}`
      );
    }
  }, [editing, selectedPost]);

  // Handle input changes
  const postInputChangeHandler = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      generateBase64FromImage(files[0])
        .then((b64) => setImagePreview(b64))
        .catch(() => setImagePreview(null));
    }

    let isValid = true;
    for (const validator of postForm[name].validators) {
      isValid = isValid && validator(value);
    }

    const updatedForm = {
      ...postForm,
      [name]: {
        ...postForm[name],
        valid: isValid,
        value: files ? files[0] : value,
      },
    };

    let isFormValid = true;
    for (const inputName in updatedForm) {
      isFormValid = isFormValid && updatedForm[inputName].valid;
    }

    setPostForm(updatedForm);
    setFormIsValid(isFormValid);
  };

  // Handle input blur
  const inputBlurHandler = (input) => {
    setPostForm((prevForm) => ({
      ...prevForm,
      [input]: {
        ...prevForm[input],
        touched: true,
      },
    }));
  };

  // Handle canceling the edit
  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview(null);
    onCancelEdit();
  };

  // Handle accepting the edit
  const acceptPostChangeHandler = () => {
    const post = {
      title: postForm.title.value,
      image: postForm.image.value,
      content: postForm.content.value,
    };
    onFinishEdit(post);
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview(null);
  };

  // Render the form only if in editing mode
  if (!editing) return null;

  return (
    <>
      <Backdrop onClick={cancelPostChangeHandler} open={editing} />
      <Modal
        title={selectedPost ? "Edit Post" : "New Post"}
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={loading}
      >
        <form>
          <Input
            id="title"
            label="Title"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("title")}
            valid={postForm.title.valid}
            touched={postForm.title.touched}
            value={postForm.title.value}
          />
          <FilePicker
            id="image"
            label="Image"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("image")}
            valid={postForm.image.valid}
            touched={postForm.image.touched}
          />
          <div className="new-post__preview-image">
            {!imagePreview && <p>Please choose an image.</p>}
            {imagePreview && <Image imageUrl={imagePreview} contain left />}
          </div>
          <Input
            id="content"
            label="Content"
            control="textarea"
            rows="5"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("content")}
            valid={postForm.content.valid}
            touched={postForm.content.touched}
            value={postForm.content.value}
          />
        </form>
      </Modal>
    </>
  );
};

export default FeedEdit;
