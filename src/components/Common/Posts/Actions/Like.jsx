import React, { useEffect, useState } from "react";
import { PiHandsClappingDuotone } from "react-icons/pi";
import { Blog } from "../../../../Context/Context";
import { toast } from "react-toastify";
import useSingleFetch from "../../../hooks/useSingleFetch";
import { formatNum } from "../../../../utils/helper";

const Like = ({ postId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesData, setLikesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, setAuthModel } = Blog();

  const { data } = useSingleFetch("likes", postId, "");

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      setLikesData(data);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setIsLiked(
      likesData && likesData.findIndex((item) => item.userId === (currentUser?.id || currentUser?.uid)) !== -1
    );
  }, [likesData, currentUser]);

  // Function to refresh likes data
  const refreshLikes = async () => {
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${base}/api/likes/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setLikesData(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error refreshing likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (!currentUser) return setAuthModel(true);
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${base}/api/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUser?.id || currentUser?.uid }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like post');
      }
      
      // Refresh likes data to get updated count and state
      await refreshLikes();
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <button 
      onClick={handleLike} 
      disabled={loading}
      className="flex items-center gap-1 text-sm disabled:opacity-50"
    >
      <PiHandsClappingDuotone
        className={`text-xl ${isLiked ? "text-black" : "text-gray-500"}`}
      />
      <span>{formatNum(likesData?.length || 0)}</span>
    </button>
  );
};

export default Like;
