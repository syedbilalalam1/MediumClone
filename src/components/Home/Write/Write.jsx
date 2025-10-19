import React, { useState } from "react";
import ReactQuill from "react-quill";
import Preview from "./Preview";
import { Blog } from "../../../Context/Context";
import HomeHeader from "../Header/HomeHeader";

const Write = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const { publish, setPublish } = Blog();

  const handlePublish = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!description.trim()) {
      alert("Please enter some content");
      return;
    }
    setPublish(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader sidebarOpen={false} setSidebarOpen={() => {}} />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 heading-ui">Write a story</h1>
              <button
                onClick={handlePublish}
                disabled={!title.trim() || !description.trim()}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  title.trim() && description.trim()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Publish
              </button>
            </div>
            
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              className="text-4xl outline-none w-full mb-6 heading-display"
            />
            <ReactQuill
              theme="bubble"
              value={description}
              onChange={setDescription}
              placeholder="Tell Your Story..."
              className="write my-5"
            />
            
            <div
              className={`${
                publish ? "visible opacity-100" : "invisible opacity-0"
              } transition-all duration-200`}>
              <Preview
                setPublish={setPublish}
                description={description}
                title={title}
              />
            </div>
      </div>
    </div>
  );
};

export default Write;
