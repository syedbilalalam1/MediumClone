import React, { useState, useEffect } from "react";
import ProfileHome from "./Activities/ProfileHome";
import ProfileLists from "./Activities/ProfileLists";
import ProfileAbout from "./Activities/ProfileAbout";
import Modal from "../../../utils/Modal";
import { LiaTimesSolid } from "react-icons/lia";
import { IoSettingsSharp } from "react-icons/io5";
import { discoverActions } from "../../../data";
import EditProfile from "./EditProfile";
import { Blog } from "../../../Context/Context";
import { useParams } from "react-router-dom";
import useSingleFetch from "../../hooks/useSingleFetch";
import LeftSidebar from "../Sidebar/LeftSidebar";
import HomeHeader from "../Header/HomeHeader";
import Loading from "../../Loading/Loading";

const Profile = () => {
  const { allUsers, currentUser } = Blog();
  const { userId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [getUserData, setGetUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const activities = [
    {
      title: "Home",
      comp: ProfileHome,
    },
    {
      title: "Lists",
      comp: ProfileLists,
    },
    {
      title: "About",
      comp: ProfileAbout,
    },
  ];
  const [currentActive, setCurrentActive] = useState(activities[0]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${base}/api/users/${userId}`);
        if (res.ok) {
          const userData = await res.json();
          setGetUserData(userData);
        } else {
          // Fallback to allUsers if API fails
          const fallbackUser = allUsers.find((user) => user.id === userId);
          setGetUserData(fallbackUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to allUsers
        const fallbackUser = allUsers.find((user) => user.id === userId);
        setGetUserData(fallbackUser);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, allUsers]);

  // Get actual follower/following counts from user data
  const followersCount = getUserData?.followerIds?.length || 0;
  const followingCount = getUserData?.followingIds?.length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex">
          <LeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (!getUserData) {
    return (
      <div className="min-h-screen bg-white">
        <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex">
          <LeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
            <div className="py-10 px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
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
          <div className="py-10 px-6">
            <section className="flex gap-8 relative">
              {/* users activities  */}
              <div className="flex-1 max-w-3xl">
        <div className="flex items-end gap-6 mb-6">
          <h2 className="text-4xl sm:text-6xl font-bold capitalize text-gray-900 heading-display">
            {getUserData?.username}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 ui-text">
            <span className="font-medium">{followersCount} Followers</span>
            <span className="font-medium">{followingCount} Following</span>
          </div>
        </div>
        <div className="flex items-center gap-8 border-b-2 border-gray-200 pb-4 mb-8">
          {activities.map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrentActive(item)}
              className={`py-2 px-1 text-sm font-medium transition-colors ui-text ${
                item.title === currentActive.title
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {item.title}
            </button>
          ))}
        </div>
        <currentActive.comp
          getUserData={getUserData}
          setEditModal={setEditModal}
        />
      </div>
      {/* button to open the side bar  */}
      <button
        onClick={() => setModal(true)}
        className="fixed top-[8rem] right-0 w-[2rem] h-[2rem] bg-black text-white
        grid place-items-center md:hidden">
        <IoSettingsSharp />
      </button>
      {/* user details  */}
      <Modal modal={modal} setModal={setModal}>
        <div
          className={`w-80 border-l-2 border-gray-300 bg-gray-50 p-8 z-10
        fixed right-0 bottom-0 top-0 md:sticky
        ${modal ? "translate-x-0" : "translate-x-[100%] md:translate-x-0"}
        transition-all duration-500`}>
          {/* icons to close out modal  */}
          <div className="pb-4 text-right">
            <button
              onClick={() => setModal(false)}
              className="inline-block md:hidden">
              <LiaTimesSolid />
            </button>
          </div>
          {/* profile details  */}
          <div className="sticky top-8 flex flex-col space-y-8">
            <div className="text-center">
              <img
                className="w-20 h-20 object-cover rounded-full mb-4 mx-auto"
                src={getUserData?.userImg || getUserData?.avatar || "/profile.jpg"}
                alt="profile-img"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {getUserData?.username}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {getUserData?.bio || "No bio available"}
              </p>
              {currentUser?.id === getUserData?.id && (
                <button
                  onClick={() => setEditModal(true)}
                  className="w-full px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors">
                  Edit Profile
                </button>
              )}
            </div>
            
            {/* Footer Links */}
            <div className="border-t-2 border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">More from Medium</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {discoverActions.map((item) => (
                  <button key={item} className="text-gray-600 hover:text-gray-900 text-left py-1 transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
              {editModal && (
                <EditProfile
                  getUserData={getUserData}
                  editModal={editModal}
                  setEditModal={setEditModal}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
