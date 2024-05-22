import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { useSelector } from 'react-redux';
import { useNavigate, Navigate } from "react-router-dom";
import axios from '../../axios';

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";

export const AddPost = () => {
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  const [text, setText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageURL, setImageURL] = React.useState("");
  const inputFileRef = React.useRef(null);

  const handleChangerFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageURL(data.url);
    } catch (err) {
      console.warn(err);
      alert('Upload error');
    }
  };

  const onClickRemoveImage = () => {
    setImageURL('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        imageURL,
        tags: tags.split(',').map(tag => tag.trim()),
        text
      };
  
      console.log("Submitting fields:", fields);
  
      const { data } = await axios.post('/posts', fields);
      const id = data._id;
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      if (err.response) {

        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        alert(`Error: ${err.response.data.message || 'An error occurred while creating the post. Please try again later.'}`);
      } else if (err.request) {

        console.error('Request data:', err.request);
        alert('No response received from the server. Please check your network connection.');
      } else {
        console.error('Error message:', err.message);
        alert('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
        uniqueId: "add_post_editor", // Add a uniqueId here
      },
    }),
    []
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Upload preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangerFile} hidden />
      {imageURL && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageURL}`} alt={"Uploaded"} />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
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
