import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";
import axios from '../../axios';

export const AddPost = () => {
  const isAuth = useSelector(selectIsAuth);

  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageURL, setImageURL] = React.useState("");
  const inputFileRef = React.useRef(null);

  const handleChangerFile = async(event) => {
    try{
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const {data} = await axios.post('/upload', formData);
      setImageURL(data.url);
    } catch (err){
      console.warn(err);
      alert('Upload error');
    }
  };

  const onClickRemoveImage = () => {
    setImageURL('');
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

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
      },
    }),
    []
  );

  if(!window.localStorage.getItem('token') && !isAuth){
    return <Navigate to="/"/>;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={()=> inputFileRef.current.click()} variant="outlined" size="large">
        Upload preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangerFile} hidden/>
      {imageURL &&(
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
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={e => setTags(e.target.value)}       
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={value}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button size="large" variant="contained">
          Post
        </Button>
        <Button size="large">Cancel</Button>
      </div>
    </Paper>
  );
};
