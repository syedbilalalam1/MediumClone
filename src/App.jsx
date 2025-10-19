import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Demo from "./components/Demo/Demo";
import DemoHeader from "./components/Demo/DemoHeader";
import { Blog } from "./Context/Context";
import { ToastContainer } from "react-toastify";
import Profile from "./components/Home/Profile/Profile";
import Write from "./components/Home/Write/Write";
import SinglePost from "./components/Common/Posts/SinglePost";
import EditPost from "./components/Common/Posts/EditPost";
import FilterPost from "./components/Demo/FilterPost";
import AIChat from "./components/AIChat";
import ChatBox from "./components/AIChat/ChatBox";
import Upload from "./components/Home/Upload/Upload";
import Library from "./components/Home/Library/Library";
import Stories from "./components/Home/Stories/Stories";
import Stats from "./components/Home/Stats/Stats";

function App() {
  const { currentUser } = Blog();
  return (
    <>
      {!currentUser && <DemoHeader />}
      <ToastContainer />
      {currentUser && <ChatBox />}
      <Routes>
        {currentUser && <Route path="/" element={<Home />} />}
        {!currentUser && <Route path="/demo" element={<Demo />} />}
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/write" element={<Write />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        <Route path="/editPost/:postId" element={<EditPost />} />
        <Route path="/filter/:tag" element={<FilterPost />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<AIChat />} />
            <Route path="/list" element={<Library />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stats" element={<Stats />} />
            <Route
              path="*"
              element={<Navigate to={!currentUser ? "/demo" : "/"} />}
            />
      </Routes>
    </>
  );
}

export default App;
