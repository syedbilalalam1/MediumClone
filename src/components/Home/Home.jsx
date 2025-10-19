import React, { useState, useEffect } from "react";
import Posts from "../Common/Posts/Posts";
import LeftSidebar from "./Sidebar/LeftSidebar";
import RightRail from "./Sidebar/RightRail";
import HomeHeader from "./Header/HomeHeader";
import { Blog } from "../../Context/Context";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("For you");
  const [visiblePosts, setVisiblePosts] = useState(10);
  const { postData } = Blog();

  const sections = ["For you", "Featured"];

  // Get paginated posts
  const getPaginatedPosts = () => {
    return postData?.slice(0, visiblePosts) || [];
  };

  // Load more posts when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (visiblePosts < (postData?.length || 0)) {
          setVisiblePosts(prev => prev + 3); // Load 3 more posts
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visiblePosts, postData]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        {/* Left Sidebar */}
        <LeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
            {/* Main Content - Dynamic positioning based on sidebar state */}
            <div className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? 'ml-60' : 'ml-0'
            }`}>
              <div className="max-w-4xl mx-auto">
                <div className="py-10 px-6">
                  {/* Section Tabs */}
                  <div className="flex space-x-8 mb-8 border-b border-gray-200">
                    {sections.map((section) => (
                      <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`pb-2 text-sm font-medium transition-colors ui-text ${
                          activeSection === section
                            ? "text-gray-900 border-b-2 border-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {section}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  {activeSection === "For you" && (
                    <Posts posts={getPaginatedPosts()} />
                  )}

                  {activeSection === "Featured" && (
                    <div className="text-center py-16">
                      <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto text-gray-400">
                          <path stroke="currentColor" d="M4.75 21.5h14.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25Z"></path>
                          <path stroke="currentColor" strokeLinecap="round" d="M8 8.5h8M8 15.5h5M8 12h8"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No featured stories
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Featured stories from the publications you follow will appear here.
                      </p>
                      <button className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
                        Okay, got it
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
        
        {/* Right Rail - Dynamic positioning based on sidebar state */}
        <div className={`w-80 flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-0'
        }`}>
          <RightRail sidebarOpen={sidebarOpen} />
        </div>
      </div>
    </div>
  );
};

export default Home;
