import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import ThemeContext from '../ThemeContex'

import styles from './Header.module.scss';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { theme, toggleTheme } = useContext(ThemeContext); 

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to leave?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>FAF BLOG</div>
          </Link>
          <div className={styles.buttons}>
            <Button onClick={toggleTheme} variant="contained">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">New post</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};