import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../../Context/Context";
import LeftSidebar from "../Sidebar/LeftSidebar";
import HomeHeader from "../Header/HomeHeader";

const Stories = () => {
  const { currentUser, postData } = Blog();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Drafts");
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    "Drafts",
    "Published", 
    "Unlisted",
    "Submissions"
  ];

  useEffect(() => {
    const fetchUserStories = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${base}/api/posts?userId=${currentUser.id || currentUser.uid}`);
        const stories = await response.json();
        setUserStories(stories || []);
      } catch (error) {
        console.error('Error fetching user stories:', error);
        setUserStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStories();
  }, [currentUser]);

  const getStoriesByStatus = (status) => {
    // For now, we'll use all stories as "Published" since we don't have status field yet
    // In a real app, you'd filter by actual status
    return status === "Published" ? userStories : [];
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
              <h1 className="text-3xl font-bold text-gray-900 heading-display">Stories</h1>
              <Link
                to="/write"
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                Import a story
              </Link>
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
            <div>
              {getStoriesByStatus(activeTab).length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto text-gray-400">
                      <path stroke="currentColor" d="M4.75 21.5h14.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25Z"></path>
                      <path stroke="currentColor" strokeLinecap="round" d="M8 8.5h8M8 15.5h5M8 12h8"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    You have no stories in {activeTab.toLowerCase()}.
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Why not start writing one?
                  </p>
                  <Link
                    to="/write"
                    className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
                  >
                    Start writing
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {getStoriesByStatus(activeTab).map((story) => (
                    <div key={story.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                          <div 
                            className="text-gray-600 line-clamp-2 mb-3"
                            dangerouslySetInnerHTML={{ __html: story.desc }}
                          />
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{new Date(story.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{story.tags?.join(', ') || 'No tags'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/editPost/${story.id}`}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </Link>
                          <button className="text-gray-400 hover:text-gray-600 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                              <path fill="currentColor" fillRule="evenodd" d="M4.385 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.41.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.02.2-1.41.59-.4.39-.59.86-.59 1.41m5.62 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59s1.02-.2 1.41-.59c.4-.39.59-.86.59-1.41s-.2-1.02-.59-1.41a1.93 1.93 0 0 0-1.41-.59c-.55 0-1.03.2-1.42.59s-.58.86-.58 1.41m5.6 0c0 .55.2 1.02.58 1.41.4.4.87.59 1.43.59s1.03-.2 1.42-.59.58-.86.58-1.41-.2-1.02-.58-1.41a1.93 1.93 0 0 0-1.42-.59c-.56 0-1.04.2-1.43.59s-.58.86-.58 1.41" clipRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;
