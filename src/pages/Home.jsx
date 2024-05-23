import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import Button from '@mui/material/Button';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import './Home.scss'; 

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const { posts, tags } = useSelector(state => state.posts);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  
  const totalPages = Math.ceil(posts.totalCount / pageSize);

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage(prevPage => prevPage - 1);
  };

  React.useEffect(() =>{
    dispatch(fetchPosts({ page, pageSize }));
    dispatch(fetchTags());
  }, [dispatch, page, pageSize]);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={0}
        aria-label="basic tabs example"
      >
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading? [...Array(5)] : posts.items).map((obj, index) => 
          isPostsLoading ? (
            <Post key={index} isLoading={true}/>
          ): (
            <Post
            id={obj._id}
            title={obj.title}
            imageUrl= {obj.imageUrl}
            user={obj.user}
            createdAt={obj.createdAt}
            viewsCount={obj.viewsCount}
            commentsCount={3}
            tags={obj.tags}
            isEditable={userData?._id == obj.user._id}
          />
          ))}
        <div className="paginationContainer">
        <div className="paginationButtons"></div>
            <Button 
              variant="outlined" 
              disabled={page === 1} 
              onClick={handlePrevPage}
              className="paginationButton"
              startIcon={<NavigateBeforeIcon />}
            >
            </Button>
            <Button 
              variant="outlined" 
              disabled={page === totalPages} 
              onClick={handleNextPage}
              className="paginationButton"
              endIcon={<NavigateNextIcon />}
            >
            </Button>
          </div>
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Elon Musk",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Test comment",
              },
              {
                user: {
                  fullName: "Elvis Enrique",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};