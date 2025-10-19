import React, { useRef, useState } from "react";
import { Blog } from "../../../Context/Context";
import { toast } from "react-toastify";
import HomeHeader from "../Header/HomeHeader";

const Upload = () => {
  const { currentUser } = Blog();
  const [caption, setCaption] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef(null);

  const pickFile = () => inputRef.current?.click();

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async () => {
    try {
      console.log('🎬 Starting video upload process...');
      console.log('📝 Caption:', caption);
      console.log('📁 Video file:', videoFile);
      console.log('👤 Current user:', currentUser);
      
      if (!videoFile || !caption.trim()) {
        toast.error("Video and caption are required");
        return;
      }
      if (!currentUser) {
        toast.error("Please log in to upload videos");
        return;
      }
      
      setUploading(true);
      setUploadProgress(0);
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // Use FormData for file upload instead of base64
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('folder', 'videos');
      
      console.log('📤 Uploading video to Cloudinary...');
      
      // Simulate progress for video upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
      
      const upRes = await fetch(`${base}/api/upload/video`, {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!upRes.ok) {
        const errorText = await upRes.text();
        console.error('❌ Upload error response:', errorText);
        throw new Error(`Upload failed: ${upRes.status}`);
      }
      
      const upJson = await upRes.json();
      console.log('✅ Video uploaded successfully to Cloudinary:', upJson);

      const postData = {
        userId: currentUser?.id || currentUser?.uid || '',
        username: currentUser?.username || currentUser?.displayName || 'Anonymous',
        title: caption.substring(0, 80),
        desc: caption,
        videoUrl: upJson.url,
        kind: 'video',
        tags: [],
        postImg: ''
      };
      
      console.log('💾 Saving post to MongoDB:', postData);
      
      const postRes = await fetch(`${base}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      
      if (!postRes.ok) {
        const errorData = await postRes.json();
        console.error('❌ Post save error:', errorData);
        throw new Error(errorData.error || 'Failed to save post');
      }
      
      const postJson = await postRes.json();
      console.log('✅ Post saved successfully:', postJson);
      toast.success('Video uploaded successfully');
      setCaption("");
      setVideoFile(null);
      setUploadProgress(0);
    } catch (e) {
      console.error('❌ Upload error:', e);
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader sidebarOpen={false} setSidebarOpen={() => {}} />
      
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-green-600">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 heading-display">Upload Video</h1>
          <p className="text-lg text-gray-600 ui-text">Share your story with the world</p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Caption Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What's your video about?
            </label>
            <textarea
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Write a compelling caption for your video..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Help people discover your content</span>
              <span className="text-xs text-gray-400">{caption.length}/500</span>
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose your video
            </label>
            
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />

            {!videoFile ? (
              <div 
                onClick={pickFile}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-gray-400 group-hover:text-green-500">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload a video</h3>
                  <p className="text-gray-500 mb-4">Drag and drop your video here, or click to browse</p>
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
                    Choose File
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-green-600">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.75 21.5h14.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25Z"></path>
                        <path stroke="currentColor" strokeLinecap="round" d="M8 8.5h8M8 15.5h5M8 12h8"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{videoFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={pickFile}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Uploading video...</span>
                <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleSubmit}
            disabled={uploading || !videoFile || !caption.trim()}
            className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
              uploading || !videoFile || !caption.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              'Upload Video'
            )}
          </button>

          {/* Tips Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-blue-600 mt-0.5">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"></path>
              </svg>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Upload Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Keep videos under 100MB for best performance</li>
                  <li>• Write engaging captions to increase views</li>
                  <li>• Use clear, well-lit footage for better quality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;


