import React from "react";
import Loading from "../../../Loading/Loading";
import PostsCard from "../../../Common/Posts/PostsCard";
import { Blog } from "../../../../Context/Context";

const ProfileHome = ({ getUserData }) => {
  const { postData, postLoading } = Blog();
  const userPost =
    postData &&
    postData?.filter((post) => post?.userId === getUserData?.id || post?.userId === getUserData?.userId);

  return (
    <div className="space-y-6">
      {userPost.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto text-gray-400">
              <path stroke="currentColor" d="M4.75 21.5h14.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25Z"></path>
              <path stroke="currentColor" strokeLinecap="round" d="M8 8.5h8M8 15.5h5M8 12h8"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600">
            <span className="capitalize">{getUserData?.username}</span> hasn't published any stories yet.
          </p>
        </div>
      )}
      {postLoading ? (
        <Loading />
      ) : (
        userPost &&
        userPost?.map((post, i) => <PostsCard post={post} key={i} />)
      )}
    </div>
  );
};

export default ProfileHome;
