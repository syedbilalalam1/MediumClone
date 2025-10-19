import React from "react";
import { LiaUserSolid } from "react-icons/lia";
import { MdOutlineLocalLibrary } from "react-icons/md";
import { BiSpreadsheet } from "react-icons/bi";
import { HiOutlineChartBar } from "react-icons/hi";
import { LiaEditSolid } from "react-icons/lia";
import { Blog } from "../../../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import { secretEmail } from "../../../utils/helper";
 
import { toast } from "react-toastify";

const UserModal = ({ setModal, sidebarOpen }) => {
  const { currentUser, setCurrentUser } = Blog();
  const userModal = [
    {
      title: "Profile",
      icon: <LiaUserSolid />,
      path: `/profile/${currentUser?.id || currentUser?.uid}`,
    },
    {
      title: "Library",
      icon: <MdOutlineLocalLibrary />,
      path: "/list",
    },
    {
      title: "Stories",
      icon: <BiSpreadsheet />,
      path: "/stories",
    },
    {
      title: "Stats",
      icon: <HiOutlineChartBar />,
      path: "/stats",
    },
  ];

  const navigate = useNavigate(null);
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      navigate("/demo", { replace: true });
      toast.success("User has been logged out");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <section
      className="absolute w-[18rem] p-6 bg-white right-0 top-[100%]
    shadows rounded-md z-[60] text-gray-500">
      {/* Username */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 heading-ui">
          {currentUser?.username || currentUser?.displayName || "User"}
        </h3>
        <p className="text-sm text-gray-600 ui-text">{secretEmail(currentUser?.email)}</p>
      </div>

      {!sidebarOpen && (
        <>
          <Link
            to="/write"
            className="flex md:hidden items-center gap-1 text-gray-500 mt-4">
            <span className="text-3xl">
              <LiaEditSolid />
            </span>
            <span className="text-sm mt-2">Write</span>
          </Link>
          <div className="flex flex-col gap-4 border-b border-gray-300 pb-5 mt-4">
            {userModal.map((link, i) => (
              <Link
                onClick={() => setModal(false)}
                className="flex items-center gap-2 text-gray-500 hover:text-black/70"
                key={i}
                to={link.path}>
                <span className="text-2xl">{link.icon}</span>
                <h2 className="text-md">{link.title}</h2>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Sign Out */}
      <div className="pt-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-500 hover:text-black/70 w-full text-left">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"></path>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </section>
  );
};

export default UserModal;
