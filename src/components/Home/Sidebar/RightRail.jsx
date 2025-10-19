import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../../Context/Context";
import { toast } from "react-toastify";

const RightRail = ({ sidebarOpen }) => {
  const { postData, allUsers, currentUser } = Blog();
  const [followingUsers, setFollowingUsers] = useState(new Set());

  // Get recent posts for "Staff Picks" (using actual data)
  const recentPosts = postData?.slice(0, 3) || [];
  
  // Get random users for "Who to Follow" (using actual data)
  const suggestedUsers = allUsers?.filter(user => user.id !== currentUser?.id).slice(0, 3) || [];

  // Handle follow/unfollow
  const handleFollow = async (userId) => {
    if (!currentUser) {
      toast.error("Please log in to follow users");
      return;
    }

    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${base}/api/follows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: currentUser.id || currentUser.uid,
          followeeId: userId
        })
      });

      if (!response.ok) throw new Error('Failed to follow user');

      const result = await response.json();
      
      if (result.following) {
        setFollowingUsers(prev => new Set([...prev, userId]));
        toast.success("You're now following this user");
      } else {
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        toast.success("You've unfollowed this user");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Popular topics with predefined keywords
  const getPopularTopics = () => {
    const predefinedTopics = [
      "Programming",
      "Self Improvement", 
      "Writing",
      "Relationships",
      "Machine Learning",
      "Politics",
      "Cryptocurrency",
      "Technology",
      "Business",
      "Health",
      "Education",
      "Design"
    ];
    
    // If we have post data, try to use actual tags, otherwise use predefined
    if (postData && postData.length > 0) {
      const topicCounts = {};
      postData.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => {
            topicCounts[tag] = (topicCounts[tag] || 0) + 1;
          });
        }
      });
      
      const actualTopics = Object.entries(topicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 7)
        .map(([topic]) => topic);
        
      // If we have actual topics, use them, otherwise use predefined
      return actualTopics.length > 0 ? actualTopics : predefinedTopics.slice(0, 7);
    }
    
    return predefinedTopics.slice(0, 7);
  };

  const popularTopics = getPopularTopics();

  return (
        <div className={`w-80 flex-shrink-0 transition-all duration-300 border-l border-gray-200 ${
          sidebarOpen ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
        }`}>
          <div className="sticky top-0 h-screen p-6">
        
        {/* Staff Picks */}
        <div className="mb-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Staff Picks</h2>
          </div>
          
          <div className="space-y-3">
            {recentPosts.slice(0, 2).map((post) => (
              <div key={post.id} className="space-y-1">
                {/* Author info */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span>by</span>
                    <Link to={`/profile/${post.userId}`} className="hover:text-gray-900">
                      {post.username}
                    </Link>
                  </div>
                </div>
                
                {/* Article title */}
                <Link to={`/post/${post.id}`} className="block">
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-gray-700 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </Link>
                
                {/* Meta info */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{new Date(post.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3">
            <Link to="/" className="text-xs text-gray-600 hover:text-gray-900">
              See the full list
            </Link>
          </div>
        </div>

        {/* Recommended Topics */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommended topics</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {popularTopics.slice(0, 6).map((topic) => (
              <Link
                key={topic}
                to={`/filter/${topic}`}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
          <Link to="/" className="text-xs text-gray-600 hover:text-gray-900">
            See more topics
          </Link>
        </div>

        {/* Who to Follow */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Who to follow</h2>
          <div className="space-y-3">
            {suggestedUsers.slice(0, 2).map((user) => (
              <div key={user.id} className="flex items-start gap-2">
                <Link to={`/profile/${user.id}`}>
                  <img 
                    src={user.userImg || user.avatar || "/profile.jpg"} 
                    alt={user.username}
                    className="w-6 h-6 rounded-full"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${user.id}`} className="block">
                    <h3 className="text-xs font-semibold text-gray-900 hover:text-gray-700 truncate">
                      {user.username}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                    {user.bio || "Writer on Medium"}
                  </p>
                </div>
                <button 
                  onClick={() => handleFollow(user.id)}
                  className={`px-2 py-1 text-xs border rounded-full transition-colors ${
                    followingUsers.has(user.id) 
                      ? 'border-gray-400 bg-gray-100 text-gray-700' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {followingUsers.has(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link to="/" className="text-xs text-gray-600 hover:text-gray-900">
              See more suggestions
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
};

export default RightRail;
