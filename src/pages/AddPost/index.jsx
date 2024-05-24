import React, { useContext, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { selectIsAuth } from "../../redux/slices/auth";
import { ThemeContext } from "../../components/ThemeContex";

export const AddPost = () => {
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const { id } = useParams();
  const inputFileRef = useRef(null);
  const titleRef = useRef(null);
  const tagsRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then((response) => {
          const data = response.data;
          setTitle(data.title);
          setText(data.text);
          setImageURL(data.imageURL);
          setTags(data.tags.join(", "));
        })
        .catch((err) => {
          console.warn(err);
          alert("Error while getting post");
        });
    }
  }, [id]);

  const handleChangerFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageURL(data.url);
    } catch (err) {
      console.warn(err);
      alert("Upload error");
    }
  };

  const onClickRemoveImage = () => {
    setImageURL("");
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        imageURL,
        tags: tags.split(",").map((tag) => tag.trim()),
        text,
      };

      const { data } = await axios.post("/posts", fields);
      const postId = data._id;
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error("Error creating post:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        alert(
          `Error: ${
            err.response.data.message ||
            "An error occurred while creating the post. Please try again later."
          }`
        );
      } else if (err.request) {
        console.error("Request data:", err.request);
        alert(
          "No response received from the server. Please check your network connection."
        );
      } else {
        console.error("Error message:", err.message);
        alert("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30, backgroundColor: theme === "dark" ? "#333" : "#fff" }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Upload preview
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangerFile}
        hidden
      />
      {imageURL && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Delete
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageURL}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        inputRef={titleRef}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        inputRef={tagsRef}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
        style={{ color: theme === "dark" ? "white" : "inherit" }}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={(value) => setText(value)}
        placeholder= "Enter text..."
        style={{ backgroundColor: theme === "dark" ? "#333" : "#fff", color: theme === "dark" ? "#fff" : "#000" }}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Post
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};