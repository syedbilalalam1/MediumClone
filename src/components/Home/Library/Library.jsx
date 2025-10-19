import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../../Context/Context";
import { toast } from "react-toastify";
import CreateListModal from "./CreateListModal";
import LeftSidebar from "../Sidebar/LeftSidebar";
import HomeHeader from "../Header/HomeHeader";

const Library = () => {
  const { currentUser } = Blog();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Your lists");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    "Your lists",
    "Saved lists", 
    "Highlights",
    "Reading history",
    "Responses"
  ];

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${base}/api/lists?userId=${currentUser.id || currentUser.uid}`);
      if (!response.ok) throw new Error('Failed to fetch lists');
      const data = await response.json();
      setLists(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (listData) => {
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${base}/api/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...listData,
          userId: currentUser.id || currentUser.uid,
          username: currentUser.username || currentUser.displayName || "Anonymous"
        })
      });

      if (!response.ok) throw new Error('Failed to create list');
      
      const newList = await response.json();
      setLists(prev => [newList, ...prev]);
      setShowCreateModal(false);
      toast.success("List created successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex">
          <LeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
            <div className="max-w-6xl mx-auto py-10 px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
          <div className="max-w-6xl mx-auto py-10 px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 heading-display">Your library</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                New list
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 mb-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === "Your lists" && (
              <div>
                {lists.length === 0 ? (
                  <div className="bg-green-600 rounded-lg p-12 relative min-h-[300px] flex items-center">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="absolute top-6 right-6 text-white hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
                        <path fill="currentColor" fillRule="evenodd" d="m13.792 4.6-4.29 4.29-4.29-4.29-.612.613 4.29 4.29-4.29 4.29.613.612 4.29-4.29 4.29 4.29.612-.613-4.29-4.29 4.29-4.29"></path>
                      </svg>
                    </button>
                    
                    <div className="flex items-center justify-between w-full">
                      {/* Left side - Text and Button */}
                      <div className="flex-1 max-w-md">
                        <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                          Create a list to easily organize and share stories
                        </h3>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
                        >
                          Start a list
                        </button>
                      </div>
                      
                      {/* Right side - Icon */}
                      <div className="flex-1 flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="283" height="174" fill="none" viewBox="0 0 283 174">
                          <circle cx="141.5" cy="87.5" r="141.5" fill="#E8F3E8" opacity="0.15"></circle>
                          <circle cx="141.5" cy="87.5" r="29.5" fill="#fff"></circle>
                          <path fill="#0F730C" fillRule="evenodd" d="M148.714 74.322a.656.656 0 0 1 1.308.067v3.278h3.278a.656.656 0 1 1 0 1.31h-3.278v3.278a.655.655 0 1 1-1.311 0v-3.277h-3.278a.655.655 0 0 1 0-1.311h3.278v-3.278zm-13.77 4c-.724 0-1.311.587-1.311 1.311v17.68l7.467-5.744a.66.66 0 0 1 .8 0l7.467 5.744V87.5a.655.655 0 1 1 1.311 0v11.144a.656.656 0 0 1-1.055.52l-8.123-6.248-8.123 6.248a.655.655 0 0 1-1.055-.52v-19.01a2.62 2.62 0 0 1 2.622-2.623h5.245a.655.655 0 0 1 0 1.311z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {lists.map((list) => (
                      <div key={list.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={currentUser?.userImg || currentUser?.avatar || "/profile.jpg"}
                                alt={currentUser?.username}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-600 font-medium">{list.username}</span>
                              <span className="text-sm text-gray-400">·</span>
                              <span className="text-sm text-gray-400">
                                {new Date(list.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{list.name}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">
                                {list.postIds.length === 0 ? 'No stories' : `${list.postIds.length} ${list.postIds.length === 1 ? 'story' : 'stories'}`}
                              </p>
                              {list.isPrivate && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" fill="none" viewBox="0 0 8 11" className="text-gray-500">
                                  <path fill="currentColor" fillRule="evenodd" d="M2.182 2.608C2.182 1.612 2.992.79 4 .79c1.007 0 1.818.823 1.818 1.817v2.061H2.182zm4.37 2.061h-.007V2.608C6.545 1.166 5.398 0 4 0 2.601 0 1.455 1.162 1.455 2.608v2.061h-.006a1.4 1.4 0 0 0-1.025.465A1.66 1.66 0 0 0 0 6.25V9.42c0 .207.036.413.109.605.072.192.179.366.313.513.135.147.295.263.471.343s.365.12.556.12H6.55a1.4 1.4 0 0 0 1.025-.465c.271-.296.424-.698.424-1.116V6.25c0-.207-.036-.413-.109-.605a1.6 1.6 0 0 0-.313-.513 1.45 1.45 0 0 0-.471-.343 1.35 1.35 0 0 0-.556-.12" clipRule="evenodd"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path fill="currentColor" fillRule="evenodd" d="M4.385 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.41.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.02.2-1.41.59-.4.39-.59.86-.59 1.41m5.62 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.03.2-1.42.59s-.58.86-.58 1.41m5.6 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.43.59s1.03-.2 1.42-.59.58-.86.58-1.41-.2-1.02-.58-1.41a1.93 1.93 0 0 0-1.42-.59c-.56 0-1.04.2-1.43.59s-.58.86-.58 1.41" clipRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab !== "Your lists" && (
              <div className="text-center py-12">
                <p className="text-gray-500">This feature is coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateList}
        />
      )}
    </div>
  );
};

export default Library;
