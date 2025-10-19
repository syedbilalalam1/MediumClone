import React, { useState, useEffect } from "react";
import { readTime } from "../../../utils/helper";
import moment from "moment/moment";
import Like from "./Actions/Like";
import Comment from "./Actions/Comment";
import { Blog } from "../../../Context/Context";
import Actions from "./Actions/Actions";
import { useNavigate } from "react-router-dom";

const PostsCard = ({ post }) => {
  if (!post) {
    return null;
  }

  const {
    title = "",
    desc = "",
    created = Date.now(),
    postImg = "",
    videoUrl = "",
    kind = "text",
    id: postId = "",
    userId = "",
    username = ""
  } = post || {};
  const { currentUser, allUsers } = Blog();
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  // Fetch user data for profile picture
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const res = await fetch(`${base}/api/users/${userId}`);
          if (res.ok) {
            const user = await res.json();
            setUserData(user);
          } else {
            // Fallback to allUsers if API fails
            const fallbackUser = allUsers?.find(u => u.id === userId);
            setUserData(fallbackUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to allUsers
          const fallbackUser = allUsers?.find(u => u.id === userId);
          setUserData(fallbackUser);
        }
      };
      fetchUserData();
    }
  }, [userId, allUsers]);

  return (
    <section className="py-6 border-b border-gray-100 last:border-b-0">
      <div
        onClick={() => navigate(`/post/${postId}`)}
        className="flex flex-col sm:flex-row gap-4 cursor-pointer">
        <div className="flex-[2.5]">
          <div className="flex items-center gap-2 pb-2">
            <img
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${userId}`);
              }}
              className="w-6 h-6 object-cover rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              src={userData?.userImg || userData?.avatar || "/profile.jpg"}
              alt="user-profile"
            />
            <p className="font-medium text-gray-600 text-sm ui-text">{username}</p>
          </div>
          <h2 className="text-2xl font-bold line-clamp-2 leading-7 text-gray-900 mb-2 font-sohne">
            {title}
          </h2>
          <div
            className="text-gray-600 line-clamp-2 leading-5 text-sm body-text"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        </div>
        {(postImg || videoUrl) && (
          <div className="flex-[1]">
            {kind === 'video' && videoUrl ? (
              <div className="relative w-full h-32 rounded-sm overflow-hidden bg-gray-100">
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  poster=""
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : postImg ? (
              <img
                src={postImg}
                alt="postImg"
                className="w-full h-32 object-cover rounded-sm"
              />
            ) : null}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between w-full md:w-[70%] mt-4">
        <p className="text-xs text-gray-500">
          {readTime({ __html: desc || "" })} min read · {moment(created || Date.now()).format("MMM DD")}
        </p>
        <div className="flex items-center gap-4">
          <Like postId={postId} />
          <Comment />
          {(currentUser?.id === userId || currentUser?.uid === userId) && (
            <Actions postId={postId} title={title} desc={desc} />
          )}
        </div>
      </div>
    </section>
  );
};

export default PostsCard;
