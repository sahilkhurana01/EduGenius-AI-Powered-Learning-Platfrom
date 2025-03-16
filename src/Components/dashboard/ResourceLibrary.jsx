import React from 'react';

const ResourceLibrary = () => {
  // Mock resources data
  const resources = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      type: 'PDF',
      category: 'Mathematics',
      size: '2.4 MB',
      downloads: 145,
      date: '2 weeks ago'
    },
    {
      id: 2,
      title: 'Cell Structure Slides',
      type: 'PPT',
      category: 'Biology',
      size: '5.1 MB',
      downloads: 87,
      date: '3 days ago'
    },
    {
      id: 3,
      title: 'Historical Timeline',
      type: 'PDF',
      category: 'History',
      size: '1.8 MB',
      downloads: 112,
      date: '1 month ago'
    },
    {
      id: 4,
      title: 'Grammar Exercises',
      type: 'DOC',
      category: 'English',
      size: '756 KB',
      downloads: 203,
      date: '1 week ago'
    },
    {
      id: 5,
      title: 'Physics Lab Manual',
      type: 'PDF',
      category: 'Science',
      size: '3.2 MB',
      downloads: 64,
      date: 'Yesterday'
    }
  ];

  // Mock categories
  const categories = [
    { name: 'All Resources', count: 54 },
    { name: 'Mathematics', count: 12 },
    { name: 'Science', count: 18 },
    { name: 'English', count: 9 },
    { name: 'History', count: 7 },
    { name: 'Art', count: 5 },
    { name: 'Music', count: 3 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
            />
          </div>
          
          <h3 className="font-medium text-gray-700 mb-2 text-sm">Categories</h3>
          <div className="h-64 overflow-y-auto pr-2">
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.name}>
                  <button className="flex justify-between items-center w-full px-2 py-1.5 text-left rounded-md hover:bg-gray-100 text-sm transition-colors">
                    <span className="text-gray-700">{category.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{category.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4">
            <button className="w-full bg-blue-600 text-white rounded-md py-2 text-sm hover:bg-blue-700 transition-colors">
              Upload Resource
            </button>
          </div>
        </div>
        
        {/* Resources list */}
        <div className="col-span-2 p-4">
          <div className="h-[350px] overflow-y-auto pr-2">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Downloads</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-3 flex items-center">
                      <span className={`
                        h-8 w-8 rounded-md flex items-center justify-center font-semibold text-xs text-white
                        ${resource.type === 'PDF' ? 'bg-red-500' : 
                          resource.type === 'PPT' ? 'bg-orange-500' : 
                          resource.type === 'DOC' ? 'bg-blue-500' : 'bg-gray-500'}
                      `}>
                        {resource.type}
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{resource.title}</p>
                        <p className="text-xs text-gray-500">{resource.size}</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600 hidden md:table-cell">{resource.category}</td>
                    <td className="py-3 text-sm text-gray-600 hidden md:table-cell">{resource.downloads}</td>
                    <td className="py-3 text-sm text-gray-600">{resource.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary; 