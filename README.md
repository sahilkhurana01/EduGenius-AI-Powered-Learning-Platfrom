# Supabase Resource Integration for LoginPage

This project integrates Supabase storage and database features to manage educational resources in the application. This implementation connects to a Supabase bucket called "books" to store and retrieve resources such as PDFs, documents, presentations, etc.

## Features Implemented

- Browse resources with categorization and filtering
- Search resources by title, category, or author
- Download resources with download tracking
- Upload new resources with metadata
- User-role based access (student/teacher)

## Installation and Setup

1. Install Supabase client library:
   ```
   npm install @supabase/supabase-js
   ```

2. Configure Environment Variables:
   Create or update your `.env` file with Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-supabase-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Supabase Database Setup:
   - Create a storage bucket called `books`
   - Create a table called `resource_metadata` with columns:
     - `id` (uuid, primary key)
     - `filename` (text, unique)
     - `title` (text)
     - `category` (text)
     - `author` (text)
     - `downloads` (integer)
     - `created_at` (timestamp with time zone)

## File Structure

The implementation consists of these key files:

1. `src/utils/supabaseClient.js` - Supabase connection and utility functions
2. `src/Components/dashboard/ResourceLibrary.jsx` - UI component for resource management
3. Dashboard integrations in both student and teacher interfaces

## Usage Instructions

### Adding to Student Dashboard

```jsx
import ResourceLibrary from './dashboard/ResourceLibrary';

// Inside your component's return statement
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-4">Resources</h2>
  <ResourceLibrary userRole="student" />
</div>
```

### Adding to Teacher Dashboard

```jsx
import ResourceLibrary from './dashboard/ResourceLibrary';

// Inside your component's return statement
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-4">Class Resources</h2>
  <ResourceLibrary userRole="teacher" />
</div>
```

## Testing the Integration

1. Ensure Supabase credentials are correctly set in `.env`
2. Verify the Supabase bucket and table are properly configured
3. Test uploading a resource using the component's UI
4. Test downloading resources and verify download count increments
5. Test category filtering and search functionality

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Ensure the storage bucket permissions allow the operations you're attempting
4. Check network requests to identify specific API failures

## Future Enhancements

- Advanced permission controls based on user role
- File preview capability for supported document types
- Version tracking for uploaded resources
- Commenting and rating system for resources
