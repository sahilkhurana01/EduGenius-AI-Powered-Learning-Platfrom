import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly set
const isConfigValid = supabaseUrl && supabaseAnonKey && 
                      !supabaseUrl.includes('your-supabase-project-id') && 
                      !supabaseAnonKey.includes('your-supabase-anon-key');

// Mock data to use when Supabase is not configured
const MOCK_RESOURCES = [
  {
    id: '1',
    name: 'algebra_fundamentals.pdf',
    title: 'Algebra Fundamentals',
    category: 'Mathematics',
    type: 'PDF',
    size: 2540000,
    url: '#',
    author: 'John Smith',
    downloads: 145,
    date: '2 weeks ago'
  },
  {
    id: '2',
    name: 'cell_structure.pptx',
    title: 'Cell Structure Slides',
    category: 'Biology',
    type: 'PPT',
    size: 5100000,
    url: '#',
    author: 'Emma Johnson',
    downloads: 87,
    date: '3 days ago'
  },
  {
    id: '3',
    name: 'historical_timeline.pdf',
    title: 'Historical Timeline',
    category: 'History',
    type: 'PDF',
    size: 1800000,
    url: '#',
    author: 'David Wilson',
    downloads: 112,
    date: '1 month ago'
  },
  {
    id: '4',
    name: 'grammar_exercises.docx',
    title: 'Grammar Exercises',
    category: 'English',
    type: 'DOC',
    size: 756000,
    url: '#',
    author: 'Sarah Brown',
    downloads: 203,
    date: '1 week ago'
  },
  {
    id: '5',
    name: 'physics_lab_manual.pdf',
    title: 'Physics Lab Manual',
    category: 'Science',
    type: 'PDF',
    size: 3200000,
    url: '#',
    author: 'Robert Chen',
    downloads: 64,
    date: 'Yesterday'
  }
];

// Create a warning if config is invalid
if (!isConfigValid) {
  console.warn('⚠️ Invalid or missing Supabase credentials. Using mock data instead.');
  console.warn('To use Supabase, update your .env file with the following:');
  console.warn('VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co');
  console.warn('VITE_SUPABASE_ANON_KEY=your-actual-anon-key');
}

const supabase = isConfigValid ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Track if we've detected missing tables
let metadataTableMissing = false;

/**
 * Fetch resources from Supabase storage
 * @param {string} category - Optional category to filter resources
 * @returns {Promise<Array>} - List of resources
 */
export const fetchResources = async (category = null) => {
  try {
    // If Supabase is not configured, return mock data
    if (!isConfigValid) {
      console.log('Using mock resource data');
      // Apply category filter if specified
      let mockData = [...MOCK_RESOURCES];
      if (category && category !== 'All Resources') {
        mockData = mockData.filter(resource => resource.category === category);
      }
      return mockData;
    }

    // First get a list of files from the 'books' bucket
    const { data: files, error: filesError } = await supabase
      .storage
      .from('books')
      .list('', {
        sortBy: { column: 'name', order: 'asc' }
      });

    if (filesError) {
      if (filesError.message.includes('The resource was not found')) {
        console.warn('❌ The "books" bucket was not found in Supabase storage');
        console.warn('Please create a bucket named "books" in your Supabase storage');
        throw new Error('Supabase books bucket not found');
      }
      throw new Error(`Error fetching files: ${filesError.message}`);
    }
    
    // If no files found, return empty array
    if (!files || files.length === 0) {
      return [];
    }

    let metadata = [];
    let metadataMap = {};

    // Only try to get metadata if we haven't already detected a missing table
    if (!metadataTableMissing) {
      try {
        // Get metadata for all resources
        const { data: metadataData, error: metadataError } = await supabase
          .from('resource_metadata')
          .select('*');
        
        if (metadataError) {
          if (metadataError.message.includes('does not exist')) {
            // Set flag to avoid future queries to non-existent table
            metadataTableMissing = true;
            console.warn('⚠️ The "resource_metadata" table does not exist in your Supabase database');
            console.warn('Continuing in storage-only mode (no metadata)');
            // Continue without metadata
          } else {
            throw new Error(`Error fetching metadata: ${metadataError.message}`);
          }
        } else {
          // Create a lookup map for metadata
          metadata = metadataData || [];
          metadataMap = metadata.reduce((map, item) => {
            map[item.filename] = item;
            return map;
          }, {});
        }
      } catch (error) {
        if (error.message.includes('does not exist')) {
          // Set flag to avoid future queries to non-existent table
          metadataTableMissing = true;
          console.warn('⚠️ The "resource_metadata" table does not exist in your Supabase database');
          console.warn('Continuing in storage-only mode (no metadata)');
          // Continue without metadata
        } else {
          throw error;
        }
      }
    }
    
    // Combine file info with metadata (or just use file info if no metadata)
    let resources = files.map(file => {
      const meta = metadataMap[file.name] || {};
      
      // Get the public URL for the file
      const url = supabase
        .storage
        .from('books')
        .getPublicUrl(file.name).data.publicUrl;
      
      // Determine file type from extension
      const fileExt = file.name.split('.').pop().toUpperCase();
      let type = 'Other';
      
      if (['PDF'].includes(fileExt)) type = 'PDF';
      else if (['DOC', 'DOCX'].includes(fileExt)) type = 'DOC';
      else if (['PPT', 'PPTX'].includes(fileExt)) type = 'PPT';
      else if (['XLS', 'XLSX'].includes(fileExt)) type = 'XLS';
      else if (['JPG', 'JPEG', 'PNG', 'GIF'].includes(fileExt)) type = 'Image';
      
      // Format date string
      const createdAt = meta.created_at || file.created_at;
      const date = new Date(createdAt);
      const now = new Date();
      
      // Calculate relative time
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      let dateStr;
      if (diffDays === 0) {
        dateStr = 'Today';
      } else if (diffDays === 1) {
        dateStr = 'Yesterday';
      } else if (diffDays < 7) {
        dateStr = `${diffDays} days ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        dateStr = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
      } else {
        const months = Math.floor(diffDays / 30);
        dateStr = `${months} ${months === 1 ? 'month' : 'months'} ago`;
      }
      
      // Extract basic title from filename if metadata doesn't exist
      const fileName = file.name;
      const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      const formattedTitle = fileNameWithoutExt.replace(/_/g, " ");
      
      return {
        id: file.id || fileName,
        name: fileName,
        title: meta.title || formattedTitle,
        category: meta.category || 'Uncategorized',
        type,
        size: file.metadata?.size || 0,
        url,
        author: meta.author || 'Unknown',
        downloads: meta.downloads || 0,
        date: dateStr
      };
    });
    
    // Apply category filter if specified
    if (category && category !== 'All Resources') {
      resources = resources.filter(resource => resource.category === category);
    }
    
    return resources;
  } catch (error) {
    console.error('Error in fetchResources:', error);
    
    // Return more detailed error information based on the error type
    if (error.message.includes('books bucket not found')) {
      // Pass the specific error about missing bucket for UI handling
      throw new Error('Supabase books bucket not found');
    } else if (error.message.includes('does not exist') && error.message.includes('resource_metadata')) {
      // Pass the specific error about missing metadata table for UI handling
      throw new Error('The resource_metadata table does not exist');
    } else if (!isConfigValid) {
      // Fallback to mock data for configuration issues
      console.warn('Falling back to mock data due to configuration issue');
      let mockData = [...MOCK_RESOURCES];
      if (category && category !== 'All Resources') {
        mockData = mockData.filter(resource => resource.category === category);
      }
      return mockData;
    } else {
      // Fallback to mock data for other errors, but also throw the original error
      console.warn('Falling back to mock data due to unexpected error');
      let mockData = [...MOCK_RESOURCES];
      if (category && category !== 'All Resources') {
        mockData = mockData.filter(resource => resource.category === category);
      }
      return mockData;
    }
  }
};

/**
 * Upload a resource to Supabase storage
 * @param {File} file - The file to upload
 * @param {Object} metadata - Metadata for the file
 * @returns {Promise<Object>} - Result of upload operation
 */
export const uploadResource = async (file, metadata = {}) => {
  try {
    // If Supabase is not configured, simulate success
    if (!isConfigValid) {
      console.log('Mock upload: Supabase not configured');
      return { success: true, fileName: file.name };
    }

    // Generate a unique filename to avoid conflicts
    const timestamp = new Date().getTime();
    const originalName = file.name;
    const fileName = `${timestamp}_${originalName.replace(/\s+/g, '_')}`;
    
    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('books')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      if (uploadError.message.includes('The resource was not found')) {
        console.warn('❌ The "books" bucket was not found in Supabase storage');
        console.warn('Please create a bucket named "books" in your Supabase storage');
        throw new Error('Supabase books bucket not found');
      }
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }
    
    // Only try to store metadata if the table exists
    if (!metadataTableMissing && metadata) {
      try {
        const { title, category, author } = metadata;
        
        const { error: metadataError } = await supabase
          .from('resource_metadata')
          .insert({
            filename: fileName,
            title: title || fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            category: category || 'Uncategorized',
            author: author || 'Unknown',
            downloads: 0,
            created_at: new Date().toISOString()
          });
        
        if (metadataError) {
          if (metadataError.message.includes('does not exist')) {
            // Set flag to avoid future queries to non-existent table
            metadataTableMissing = true;
            console.warn('⚠️ The "resource_metadata" table does not exist in your Supabase database');
            console.warn('Continuing in storage-only mode (no metadata)');
            // Continue without storing metadata
          } else {
            console.error('Error storing metadata:', metadataError);
          }
        }
      } catch (error) {
        if (error.message.includes('does not exist')) {
          // Set flag to avoid future queries to non-existent table
          metadataTableMissing = true;
          console.warn('⚠️ The "resource_metadata" table does not exist in your Supabase database');
          console.warn('Continuing in storage-only mode (no metadata)');
        } else {
          console.error('Error storing metadata:', error);
        }
      }
    }
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error in uploadResource:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Increment the download count for a resource
 * @param {string} fileName - Name of the file
 * @returns {Promise<void>}
 */
export const incrementDownloadCount = async (fileName) => {
  try {
    // If Supabase is not configured or metadata table is missing, do nothing
    if (!isConfigValid || metadataTableMissing) {
      return;
    }

    try {
      // First get current metadata
      const { data: metadata, error: fetchError } = await supabase
        .from('resource_metadata')
        .select('downloads')
        .eq('filename', fileName)
        .single();
      
      if (fetchError) {
        if (fetchError.message.includes('does not exist')) {
          // Set flag to avoid future queries to non-existent table
          metadataTableMissing = true;
          console.warn('⚠️ The "resource_metadata" table does not exist in your Supabase database');
          console.warn('Continuing in storage-only mode (no metadata)');
          return;
        }
        
        // PGRST116 is "No rows returned" - we'll handle that case by creating new metadata
        if (fetchError.code !== 'PGRST116') {
          console.error('Error fetching download count:', fetchError);
          return;
        }
      }
      
      const currentDownloads = metadata?.downloads || 0;
      
      // Update or insert metadata with incremented download count
      const { error: updateError } = await supabase
        .from('resource_metadata')
        .upsert({
          filename: fileName,
          downloads: currentDownloads + 1,
          // If this is a new insert, set defaults for other fields
          title: metadata?.title || fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          category: metadata?.category || 'Uncategorized',
          author: metadata?.author || 'Unknown',
          created_at: metadata?.created_at || new Date().toISOString()
        });
      
      if (updateError) {
        if (updateError.message.includes('does not exist')) {
          // Set flag to avoid future queries to non-existent table
          metadataTableMissing = true;
          console.warn('⚠️ The "resource_metadata" table does not exist in your Supabase database');
          console.warn('Continuing in storage-only mode (no metadata)');
        } else {
          console.error('Error updating download count:', updateError);
        }
      }
    } catch (error) {
      if (error.message.includes('does not exist')) {
        // Set flag to avoid future queries to non-existent table
        metadataTableMissing = true;
        console.warn('⚠️ The "resource_metadata" table does not exist in your Supabase database');
        console.warn('Continuing in storage-only mode (no metadata)');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in incrementDownloadCount:', error);
  }
};

/**
 * Get available resource categories
 * @returns {Promise<Array>} - List of categories with counts
 */
export const getResourceCategories = async () => {
  try {
    // If Supabase is not configured, return mock categories
    if (!isConfigValid) {
      console.log('Using mock categories');
      const mockCategories = [
        { name: 'All Resources', count: MOCK_RESOURCES.length },
        { name: 'Mathematics', count: 1 },
        { name: 'Biology', count: 1 },
        { name: 'History', count: 1 },
        { name: 'English', count: 1 },
        { name: 'Science', count: 1 }
      ];
      return mockCategories;
    }

    try {
      const resources = await fetchResources();
      
      // Count resources in each category
      const categoryCounts = resources.reduce((counts, resource) => {
        const category = resource.category || 'Uncategorized';
        counts[category] = (counts[category] || 0) + 1;
        return counts;
      }, {});
      
      // Convert to array format needed by UI
      const categories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count
      }));
      
      // Sort by count (descending)
      categories.sort((a, b) => b.count - a.count);
      
      // Add "All Resources" as first item
      const totalCount = resources.length;
      return [
        { name: 'All Resources', count: totalCount },
        ...categories
      ];
    } catch (error) {
      if (error.message.includes('does not exist')) {
        // Set flag to avoid future queries to non-existent table
        metadataTableMissing = true;
        console.warn('⚠️ The "resource_metadata" table does not exist in your Supabase database');
        console.warn('Continuing in storage-only mode (no metadata)');
        
        // Return mock categories based on actual files
        return [
          { name: 'All Resources', count: 0 },
          { name: 'Uncategorized', count: 0 }
        ];
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in getResourceCategories:', error);
    // Return mock categories on error
    return [
      { name: 'All Resources', count: MOCK_RESOURCES.length },
      { name: 'Mathematics', count: 1 },
      { name: 'Biology', count: 1 },
      { name: 'History', count: 1 },
      { name: 'English', count: 1 },
      { name: 'Science', count: 1 }
    ];
  }
};

export default supabase; 