import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../../Context/Context";
import LeftSidebar from "../Sidebar/LeftSidebar";
import HomeHeader from "../Header/HomeHeader";

const Stats = () => {
  const { currentUser, postData, allUsers } = Blog();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Stories");
  const [stats, setStats] = useState({
    stories: 0,
    views: 0,
    reads: 0,
    followers: 0,
    subscribers: 0
  });
  const [loading, setLoading] = useState(true);

  const tabs = [
    "Stories",
    "Audience"
  ];

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Get user's stories
        const userStories = postData?.filter(post => post.userId === (currentUser.id || currentUser.uid)) || [];
        
        // Get follower count
        const user = allUsers?.find(u => u.id === (currentUser.id || currentUser.uid));
        const followerCount = user?.followerIds?.length || 0;
        
        // Calculate total views and reads (simulated for now)
        const totalViews = userStories.reduce((sum, story) => sum + (story.views || 0), 0);
        const totalReads = userStories.reduce((sum, story) => sum + (story.reads || 0), 0);
        
        setStats({
          stories: userStories.length,
          views: totalViews,
          reads: totalReads,
          followers: followerCount,
          subscribers: 0 // We don't have subscribers yet
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser, postData, allUsers]);

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
                <div className="grid grid-cols-4 gap-6 mb-8">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 heading-display">Stats</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Monthly</span>
                <span>•</span>
                <span>October 1, 2025 – Today (UTC)</span>
                <span>•</span>
                <span>Updated hourly</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.stories}</div>
                <div className="text-sm text-gray-600">Stories</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.views}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.reads}</div>
                <div className="text-sm text-gray-600">Reads</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.followers}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
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
            {activeTab === "Stories" && (
              <div>
                {stats.stories === 0 ? (
                  <div className="text-center py-16">
                    <div className="mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto text-gray-400">
                        <path stroke="currentColor" d="M4.75 21.5h14.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25Z"></path>
                        <path stroke="currentColor" strokeLinecap="round" d="M8 8.5h8M8 15.5h5M8 12h8"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      You haven't published any stories yet.
                    </h3>
                    <Link
                      to="/write"
                      className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
                    >
                      Start writing
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                      <div className="grid grid-cols-3 gap-6 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">Story</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Views</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Reads</div>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {postData?.filter(post => post.userId === (currentUser.id || currentUser.uid)).map((story) => (
                        <div key={story.id} className="p-6">
                          <div className="grid grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">{story.title}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(story.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="text-gray-900">
                              {story.views || 0}
                            </div>
                            <div className="text-gray-900">
                              {story.reads || 0}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Audience" && (
              <div className="text-center py-16">
                <div className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto text-gray-400">
                    <path fill="currentColor" d="M3.497 14.306a4.4 4.4 0 0 0-.99 1.489 4 4 0 0 0-.759.51c-.369.324-.498.613-.498.853V21.5a.5.5 0 0 1-1 0v-4.342c0-.632.346-1.174.838-1.605.492-.433 1.176-.8 1.977-1.097q.21-.078.432-.15m9.753-.806c2.39 0 4.578.359 6.185.956.801.298 1.485.664 1.977 1.097.492.431.838.973.838 1.605V21.5a.5.5 0 0 1-1 0v-4.342c0-.24-.13-.53-.498-.853s-.93-.638-1.666-.911c-1.47-.546-3.533-.894-5.836-.894s-4.367.348-5.836.894c-.737.273-1.298.588-1.666.91-.369.325-.498.614-.498.854V21.5a.5.5 0 0 1-1 0v-4.342c0-.632.346-1.174.838-1.605.492-.433 1.176-.8 1.977-1.097 1.607-.597 3.794-.956 6.185-.956m0-11.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10m-4.998.1c-.44.45-.822.957-1.129 1.512A4 4 0 0 0 5.25 7c0 1.428.749 2.68 1.874 3.388.308.555.69 1.063 1.132 1.512a5.001 5.001 0 0 1-.004-9.8m4.998.9a4 4 0 1 0 0 8 4 4 0 0 0 0-8"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Audience insights coming soon
                </h3>
                <p className="text-gray-600">
                  We're working on bringing you detailed audience analytics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
