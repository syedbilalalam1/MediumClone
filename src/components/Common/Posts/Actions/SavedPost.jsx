import React, { useEffect, useState } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { Blog } from "../../../../Context/Context";
import { toast } from "react-toastify";
import useSingleFetch from "../../../hooks/useSingleFetch";

const SavedPost = ({ post }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { currentUser, setAuthModel } = Blog();
  const { data } = useSingleFetch("saved", currentUser?.uid, "");

  useEffect(() => {
    setIsSaved(data && data?.find((item) => item.id === currentUser?.uid)) !==
      -1;
  }, [data, post?.id]);

  const handleSave = async () => {
    try {
      if (!currentUser) return setAuthModel(true);
      const res = await fetch("http://localhost:3000/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post?.id, userId: currentUser?.uid }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success(json.removed ? "Post has been unsaved" : "Post has been saved");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <button onClick={handleSave} className="hover:opacity-60">
        <CiSaveDown2
          className={`text-2xl pointer-event-none
        ${isSaved ? "text-yellow-600" : ""}
        `}
        />
      </button>
    </div>
  );
};

export default SavedPost;
