import React from "react";
import Loading from "../../Loading/Loading";
import PostsCard from "./PostsCard";
import { Blog } from "../../../Context/Context";

const Posts = ({ posts }) => {
  const { postData, postLoading } = Blog();
  const displayPosts = posts || postData;
  
  return (
    <section className="flex flex-col">
      {postLoading ? (
        <Loading />
      ) : (
        displayPosts &&
        displayPosts?.map((post, i) => <PostsCard post={post} key={i} />)
      )}
    </section>
  );
};

export default Posts;
