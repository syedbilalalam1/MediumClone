import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { Blog } from "../../../Context/Context";
import FollowBtn from "../../Home/UserToFollow/FollowBtn";
import { readTime } from "../../../utils/helper";
import moment from "moment/moment";
import Actions from "../Posts/Actions/Actions";
import Like from "./Actions/Like";
import Comment from "./Actions/Comment";
import SharePost from "./Actions/SharePost";
import SavedPost from "../Posts/Actions/SavedPost";
import Comments from "../Comments/Comments";
import LeftSidebar from "../../Home/Sidebar/LeftSidebar";
import HomeHeader from "../../Home/Header/HomeHeader";

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, allUsers } = Blog();

  // increment page views
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender?.current) {
      const incrementPageView = async () => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          await fetch(`${base}/api/posts/${postId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ $inc: { pageViews: 1 } }),
          });
        } catch (error) {
          // non-blocking
        }
      };
      incrementPageView();
    }
    isInitialRender.current = false;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPost = async () => {
      setLoading(true);
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${base}/api/posts/${postId}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load post");
        const p = await res.json();
        setPost(p);
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    return () => controller.abort();
  }, [postId]);

  // Fetch user data when post is loaded
  useEffect(() => {
    if (post?.userId) {
      const fetchUserData = async () => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const res = await fetch(`${base}/api/users/${post.userId}`);
          if (res.ok) {
            const user = await res.json();
            setUserData(user);
          } else {
            // Fallback to allUsers
            const fallbackUser = allUsers.find(u => u.id === post.userId);
            setUserData(fallbackUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to allUsers
          const fallbackUser = allUsers.find(u => u.id === post.userId);
          setUserData(fallbackUser);
        }
      };
      fetchUserData();
    }
  }, [post?.userId, allUsers]);

  const { title, desc, postImg, videoUrl, kind, username, created, userId } = post;
  const userImg = userData?.userImg || userData?.avatar;

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex min-h-screen">
        <LeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
          {loading ? (
            <Loading />
          ) : (
            <div className="flex justify-start items-start min-h-screen" style={{ paddingLeft: 'var(--post-left-offset)' }}>
              <section className="w-full px-8 py-12" style={{ maxWidth: 'var(--post-max-width)' }}>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6 font-sohne">{title}</h1>
            <div className="flex items-center gap-3 py-6 border-b border-gray-200">
              <img
                onClick={() => navigate(`/profile/${userId}`)}
                className="w-12 h-12 object-cover rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                src={userData?.userImg || userData?.avatar || "/profile.jpg"}
                alt="user-img"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 ui-text">{username}</span>
                  {currentUser && currentUser?.uid !== userId && (
                    <FollowBtn userId={userId} />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 ui-text">
                  {readTime({ __html: desc })} min read · {moment(created).fromNow()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center py-4 border-b border-gray-200">
              <div className="flex items-center gap-6">
                <Like postId={postId} />
                <Comment />
                {post && <SavedPost post={post} />}
                <SharePost />
                {currentUser && (currentUser?.id === post?.userId || currentUser?.uid === post?.userId) && (
                  <Actions postId={postId} title={title} desc={desc} />
                )}
              </div>
            </div>
            <div className="mt-8">
              {kind === 'video' && videoUrl ? (
                <div className="w-full mb-8">
                  <video
                    className="w-full h-[400px] object-cover rounded-lg"
                    src={videoUrl}
                    controls
                    preload="metadata"
                  />
                </div>
              ) : postImg ? (
                <img
                  className="w-full h-[400px] object-cover rounded-lg mb-8"
                  src={postImg}
                  alt="post-img"
                />
              ) : null}
              {kind === 'video' && videoUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-ui">Description</h3>
                  <div
                    className="prose prose-lg max-w-none text-gray-800 leading-relaxed body-text"
                    dangerouslySetInnerHTML={{ __html: desc }}
                  />
                </div>
              )}
              {kind !== 'video' && (
                <div
                  className="prose prose-lg max-w-none text-gray-800 leading-relaxed body-text"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              )}
            </div>
              </section>
              <Comments postId={postId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
