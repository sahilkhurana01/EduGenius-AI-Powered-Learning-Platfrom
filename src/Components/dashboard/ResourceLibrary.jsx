import React, { useState, useEffect, useRef } from 'react';
import { fetchResources, getResourceCategories, uploadResource, incrementDownloadCount } from '../../utils/supabaseClient';

const ResourceLibrary = ({ userRole = 'student' }) => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    title: '',
    category: '',
    author: ''
  });

  useEffect(() => {
    loadResourcesAndCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'All Resources') {
      loadResourcesByCategory(selectedCategory);
    } else {
      loadResourcesAndCategories();
    }
  }, [selectedCategory]);

  const loadResourcesAndCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      let resourcesData, categoriesData;
      
      try {
        resourcesData = await fetchResources();
      } catch (err) {
        if (err.message.includes('books bucket not found')) {
          setError('Supabase books bucket not found');
          throw err;
        } else if (err.message.includes('resource_metadata')) {
          setError('The resource_metadata table does not exist');
          resourcesData = [];
        } else {
          setError('Failed to load resources. Please try again later.');
          throw err;
        }
      }
      
      try {
        categoriesData = await getResourceCategories();
      } catch (err) {
        console.error('Error loading categories:', err);
        categoriesData = [{ name: 'All Resources', count: resourcesData.length }];
      }

      setResources(resourcesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading resources:', err);
      
      if (!error) {
        if (err.message.includes('books bucket not found')) {
          setError('Supabase books bucket not found');
        } else if (err.message.includes('resource_metadata')) {
          setError('The resource_metadata table does not exist');
        } else {
          setError('Failed to load resources. Please try again later.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loadResourcesByCategory = async (category) => {
    setLoading(true);
    setError(null);

    try {
      let resourcesData;
      
      try {
        resourcesData = await fetchResources(category);
        setResources(resourcesData);
      } catch (err) {
        if (err.message.includes('books bucket not found')) {
          setError('Supabase books bucket not found');
        } else if (err.message.includes('resource_metadata')) {
          setError('The resource_metadata table does not exist');
          setResources([]);
        } else {
          setError('Failed to load resources for this category.');
          console.error('Error loading resources by category:', err);
        }
      }
    } catch (err) {
      console.error('Error loading resources by category:', err);
      setError('Failed to load resources for this category.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      // Auto-fill title from filename
      setUploadMetadata({
        ...uploadMetadata,
        title: file.name.replace(/\.[^/.]+$/, '')
      });
    }
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setUploadMetadata({
      ...uploadMetadata,
      [name]: value
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    
    try {
      const result = await uploadResource(uploadFile, uploadMetadata);
      
      if (result.success) {
        alert('File uploaded successfully!');
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadMetadata({ title: '', category: '', author: '' });
        // Reload resources to show the new file
        loadResourcesAndCategories();
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Upload failed. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (resource) => {
    try {
      // Increment download count in the background
      incrementDownloadCount(resource.name);
      
      // Ask for confirmation before downloading
      if (confirm(`Do you want to download "${resource.title}"?`)) {
        // Open the file in a new tab for viewing
        window.open(resource.url, '_blank');
        
        // Trigger browser's download dialog
        const link = document.createElement('a');
        link.href = resource.url;
        link.download = resource.name; // This forces download instead of navigation
        link.target = "_blank"; // Ensure it doesn't use the current tab
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Download failed. Please try again later.');
    }
  };

  // Filter resources based on search query
  const filteredResources = searchQuery
    ? resources.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : resources;

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Configuration warning banner - show only when using mock data */}
      {error && error.includes('Failed to load resources') && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Using mock data. To connect to Supabase, update your <span className="font-mono">.env</span> file with your actual Supabase credentials.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && error.includes('resource_metadata') && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Working in storage-only mode. For full functionality, create the <span className="font-mono">resource_metadata</span> table in your Supabase database. See the SUPABASE_SETUP.md file for instructions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && error.includes('books bucket not found') && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                The <span className="font-mono">books</span> storage bucket was not found. Please create a bucket named <span className="font-mono">books</span> in your Supabase storage. See the SUPABASE_SETUP.md file for instructions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Resource Library</h2>
        <p className="text-sm text-gray-500">Access teaching materials and student resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Categories sidebar */}
        <div className="md:border-r border-gray-200 p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <h3 className="font-medium text-gray-700 mb-2 text-sm">Categories</h3>
          <div className="h-64 overflow-y-auto pr-2">
            {loading && !categories.length ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button 
                      className={`flex justify-between items-center w-full px-2 py-1.5 text-left rounded-md hover:bg-gray-100 text-sm transition-colors ${
                        selectedCategory === category.name ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{category.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="mt-4">
            <button 
              className="w-full bg-blue-600 text-white rounded-md py-2 text-sm hover:bg-blue-700 transition-colors"
              onClick={handleUploadClick}
            >
              Upload Resource
            </button>
          </div>
        </div>
        
        {/* Resources list */}
        <div className="col-span-2 p-4">
          {loading && !resources.length ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading resources...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No resources found.</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria.</p>
              )}
            </div>
          ) : (
            <div className="h-[350px] overflow-y-auto pr-2">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                    <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Downloads</th>
                    <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                    <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="py-3 flex items-center">
                        <span className={`
                          h-8 w-8 rounded-md flex items-center justify-center font-semibold text-xs text-white
                          ${resource.type === 'PDF' ? 'bg-red-500' : 
                            resource.type === 'PPT' ? 'bg-orange-500' : 
                            resource.type === 'DOC' ? 'bg-blue-500' : 
                            resource.type === 'XLS' ? 'bg-green-500' : 
                            resource.type === 'Image' ? 'bg-purple-500' : 'bg-gray-500'}
                        `}>
                          {resource.type}
                        </span>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">{resource.title}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(resource.size)}</p>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600 hidden md:table-cell">{resource.category}</td>
                      <td className="py-3 text-sm text-gray-600 hidden md:table-cell">{resource.downloads}</td>
                      <td className="py-3 text-sm text-gray-600">{resource.date}</td>
                      <td className="py-3 text-sm">
                        <button 
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          onClick={() => handleDownload(resource)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Resource</h3>
            
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                />
                {uploadFile && (
                  <p className="mt-1 text-xs text-gray-500">Selected file: {uploadFile.name} ({formatFileSize(uploadFile.size)})</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={uploadMetadata.title}
                  onChange={handleMetadataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter resource title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={uploadMetadata.category}
                  onChange={handleMetadataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter category (e.g., Mathematics, Science)"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={uploadMetadata.author}
                  onChange={handleMetadataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter author name"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={uploading || !uploadFile}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;

