import React, { useEffect, useState } from "react";
import { Blog } from "../../../Context/Context";
import { toast } from "react-toastify";
import useSingleFetch from "../../hooks/useSingleFetch";
import { useLocation } from "react-router-dom";

const FollowBtn = ({ userId }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const { currentUser } = Blog();

  const { data, loading } = useSingleFetch("users", currentUser?.uid, "");

  useEffect(() => {
    setIsFollowed(data && data?.findIndex((item) => item.id === userId) !== -1);
  }, [data, userId]);

  const handleFollow = async () => {
    try {
      if (!currentUser) return;
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${base}/api/follows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: currentUser?.id || currentUser?.uid, followeeId: userId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Follow failed");
      toast.success(json.following ? "User is Followed" : "User is Unfollowed");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { pathname } = useLocation();

  return (
    <>
      <button
        onClick={handleFollow}
        className={`${
          pathname === "/" ? "border border-black" : ""
        } px-3 py-[0.2rem] rounded-full
        ${isFollowed ? "text-gray-500 border-none" : ""}`}>
        {isFollowed ? "Following" : "Follow"}
      </button>
    </>
  );
};

export default FollowBtn;
