import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './ConfirmationModal';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref as dbRef, set, onValue, remove } from "firebase/database";
import { storage, database } from "../firebase";

// Inline SVG Icons
const UploadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const LoadingSpinner = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingFileName, setDeletingFileName] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch posts from Firebase Realtime Database
  const getAllPhotos = () => {
    const photosRef = dbRef(database, "photos");
    onValue(photosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const photoList = Object.entries(data).map(([key, value]) => ({
          id: key, // Use the key as the ID
          url: value.url,
          name: value.name,
        }));
        setPosts(photoList);
      } else {
        setPosts([]);
      }
      setIsLoading(false);
    }, (error) => {
      toast.error('Failed to fetch posts');
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getAllPhotos();
  }, []);

  // Drag & drop configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => files[0] && setSelectedFile(files[0]),
  });

  // Upload handler
  const handleUpload = async (event) => {
    event.stopPropagation();
    if (!selectedFile) return;

    try {
      setUploadProgress(10); // Simulate progress start
      const fileRef = storageRef(storage, `photos/${selectedFile.name}`);
      
      // Upload file to Firebase Storage
      await uploadBytes(fileRef, selectedFile, {
        onUploadProgress: (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
      });

      // Get download URL
      const downloadURL = await getDownloadURL(fileRef);

      // Save metadata to Realtime Database
      const photoRef = dbRef(database, `photos/${selectedFile.name}`);
      await set(photoRef, {
        url: downloadURL,
        name: selectedFile.name,
      });

      toast.success('Upload successful!');
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
      setUploadProgress(0);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deletingFileName) return;

    try {
      const fileRef = storageRef(storage, `photos/${deletingFileName}`);
      const photoRef = dbRef(database, `photos/${deletingFileName}`);

      // Delete from Storage and Database
      await deleteObject(fileRef);
      await remove(photoRef);

      toast.success('Post deleted');
    } catch (error) {
      toast.error('Delete failed: ' + error.message);
    } finally {
      setShowDeleteModal(false);
      setDeletingFileName(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(to_bottom_right,#1F2937,#111827)] m-0 p-0">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post?"
      />

      {/* Header for Mobile */}
      <header className="md:hidden w-full p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <div className="flex w-full min-h-[calc(100vh-64px)] m-0">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 p-6 bg-[rgba(31,41,55,0.9)] glass transform transition-transform duration-300 md:static md:translate-x-0 z-50 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <h2 className="text-2xl font-bold text-white mb-8 hidden md:block">Admin Dashboard</h2>
          <nav className="space-y-4">
            <button className="w-full p-3 text-left rounded-lg bg-[linear-gradient(to_right,#6B48FF,#00DDEB)] text-white hover:opacity-90 transition-opacity">
              Manage Posts
            </button>
          </nav>
        </aside>

        {/* Overlay for Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full p-4 md:p-6 m-0">
          <h1 className="text-3xl font-bold text-white mb-6">Manage Posts</h1>

          {/* Upload Section */}
          <div
            {...getRootProps()}
            className={`w-full p-6 md:p-8 rounded-xl glass mb-6 md:mb-8 cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-[2px] border-blue-400 bg-[rgba(55,65,81,0.5)]'
                : 'border-[2px] border-dashed border-gray-600 hover:border-gray-500'
            } ${selectedFile && 'border-green-400'}`}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg shadow-lg animate-[fadeIn_0.5s_ease-in-out]"
                />
                <div className="w-full max-w-xs bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-[linear-gradient(to_right,#6B48FF,#00DDEB)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <button
                  onClick={handleUpload}
                  className="px-6 py-2 bg-[linear-gradient(to_right,#6B48FF,#00DDEB)] text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                  disabled={uploadProgress > 0}
                >
                  {uploadProgress > 0 ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner className="w-5 h-5 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Confirm Upload'
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 text-gray-300">
                <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-lg">{isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}</p>
                <p className="text-sm">Supported formats: JPG, PNG, WEBP</p>
              </div>
            )}
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative group glass rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={post.url}
                    alt={post.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => {
                      setDeletingFileName(post.name);
                      setShowDeleteModal(true);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <TrashIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;