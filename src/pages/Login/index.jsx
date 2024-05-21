import React, { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form';

import styles from "./Login.module.scss";
import { Password } from "@mui/icons-material";
import { fetchUserData, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, setError, formState:{errors, isValid} }=useForm({
    defaultValue: {
      email: 'test1@test.com',
      password: '123455'
    },
    mode:'all',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchUserData(values));

    if(!data.payload){
      return alert('Authorization failed');
    }

    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if(isAuth){
    return <Navigate to="/"/>;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Sign In
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
        className={styles.field}
        label="E-Mail"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        type="email"
        {...register('email', {required: 'Enter E-mail'})}
        fullWidth
      />
      <TextField className={styles.field} label="Password"
      error={Boolean(errors.email?.message)}
      helperText={errors.password?.message}
      {...register('password', {required: 'Enter password'})}
      fullWidth />
      <Button isabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Sign In
      </Button></form>
    </Paper>
  );
};
