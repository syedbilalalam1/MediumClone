import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Blog } from "../../../Context/Context";

const LeftSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { currentUser } = Blog();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path fill="currentColor" stroke="currentColor" strokeLinejoin="round" d="M4.5 21.25V10.875a.25.25 0 0 1 .1-.2l7.25-5.438a.25.25 0 0 1 .3 0l7.25 5.438a.25.25 0 0 1 .1.2V21.25a.25.25 0 0 1-.25.25h-4.5a.25.25 0 0 1-.25-.25v-5.5a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v5.5a.25.25 0 0 1-.25.25h-4.5a.25.25 0 0 1-.25-.25Z"></path>
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m22 9-9.1-6.825a1.5 1.5 0 0 0-1.8 0L2 9"></path>
        </svg>
      )
    },
    {
      name: "Library",
      href: "/list",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" d="M6.44 6.69a1.5 1.5 0 0 1 1.06-.44h9a1.5 1.5 0 0 1 1.06.44l.354-.354-.353.353A1.5 1.5 0 0 1 18 7.75v14l-5.694-4.396-.306-.236-.306.236L6 21.75v-14c0-.398.158-.78.44-1.06Z"></path>
          <path stroke="currentColor" strokeLinecap="round" d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5"></path>
        </svg>
      )
    },
    {
      name: "Profile",
      href: currentUser ? `/profile/${currentUser.id || currentUser.uid}` : "/demo",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="4.5" stroke="currentColor"></circle>
          <path stroke="currentColor" strokeLinecap="round" d="M3.5 21.5v-4.342C3.5 15.414 7.306 14 12 14s8.5 1.414 8.5 3.158V21.5"></path>
        </svg>
      )
    },
    {
      name: "Stories",
      href: "/stories",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" d="M4.75 21.5h14.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25Z"></path>
          <path stroke="currentColor" strokeLinecap="round" d="M8 8.5h8M8 15.5h5M8 12h8"></path>
        </svg>
      )
    },
    {
      name: "Stats",
      href: "/stats",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" d="M2.75 19h4.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25ZM9.75 19h4.5a.25.25 0 0 0 .25-.25V8.25a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25ZM16.75 19h4.5a.25.25 0 0 0 .25-.25V4.25a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v14.5c0 .138.112.25.25.25Z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className={`fixed xl:static left-0 top-0 h-screen overflow-y-auto bg-white border-r border-gray-200 transform transition-transform duration-300 font-sohne ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } w-60 z-40`}
    >
      {/* Navigation Items */}
      <div className="px-4 pt-4">
        {navItems.map((item) => (
          <div key={item.name} className="mb-1">
            <Link
              to={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.href 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-gray-600">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 my-4 border-t border-gray-200"></div>

      {/* Following Section */}
      <div className="px-4">
        <Link
          to="/me/following-feed/writers"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-600">
            <path fill="currentColor" d="M3.497 14.306a4.4 4.4 0 0 0-.99 1.489 4 4 0 0 0-.759.51c-.369.324-.498.613-.498.853V21.5a.5.5 0 0 1-1 0v-4.342c0-.632.346-1.174.838-1.605.492-.433 1.176-.8 1.977-1.097q.21-.078.432-.15m9.753-.806c2.39 0 4.578.359 6.185.956.801.298 1.485.664 1.977 1.097.492.431.838.973.838 1.605V21.5a.5.5 0 0 1-1 0v-4.342c0-.24-.13-.53-.498-.853s-.93-.638-1.666-.911c-1.47-.546-3.533-.894-5.836-.894s-4.367.348-5.836.894c-.737.273-1.298.588-1.666.91-.369.325-.498.614-.498.854V21.5a.5.5 0 0 1-1 0v-4.342c0-.632.346-1.174.838-1.605.492-.433 1.176-.8 1.977-1.097 1.607-.597 3.794-.956 6.185-.956m0-11.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10m-4.998.1c-.44.45-.822.957-1.129 1.512A4 4 0 0 0 5.25 7c0 1.428.749 2.68 1.874 3.388.308.555.69 1.063 1.132 1.512a5.001 5.001 0 0 1-.004-9.8m4.998.9a4 4 0 1 0 0 8 4 4 0 0 0 0-8"></path>
          </svg>
          <span>Following</span>
        </Link>

      </div>

      {/* Screen overlay for small screens */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px] xl:hidden z-30"
        />
      )}
    </div>
  );
};

export default LeftSidebar;