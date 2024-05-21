import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from '../axios';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

export const FullPost = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setData(response.data);
      } catch (err) {
        console.warn(err);
        alert('Error while getting the post');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost={true} />;
  }

  if (!data) {
    return <div>Error fetching post data</div>;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl= {data.imageUrl}
        // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isEditable
        isFullPost
      >
        <p>
          {data.text}
        </p>
      </Post>
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
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
