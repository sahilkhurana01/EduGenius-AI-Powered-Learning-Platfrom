import React, { useState } from 'react';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Mock FAQ data
  const faqs = [
    {
      id: 1,
      question: 'How do I create a new course?',
      answer: 'To create a new course, navigate to the "Courses" section and click on the "Create New Course" button. Follow the step-by-step guide to set up your course content, assignments, and settings.'
    },
    {
      id: 2,
      question: 'How do I invite students to my course?',
      answer: 'You can invite students by going to your course, clicking on "Students" tab, and then using the "Invite Students" button. You can send invitations via email or generate a course code that students can use to join.'
    },
    {
      id: 3,
      question: 'How do I grade assignments?',
      answer: 'To grade assignments, go to the "Assignments" section of your course, select the assignment you want to grade, and click on "View Submissions". You can then review each submission and assign grades and feedback.'
    },
    {
      id: 4,
      question: 'How can I track student progress?',
      answer: 'You can track student progress through the "Students" tab in your course or via the main dashboard that shows overall student activity and performance. You can also generate progress reports for individual students or the entire class.'
    },
    {
      id: 5,
      question: 'How do I set up course completion requirements?',
      answer: 'Course completion requirements can be configured in the "Course Settings" under the "Completion Requirements" tab. There you can specify which assignments, quizzes, or activities students must complete to finish the course.'
    }
  ];
  
  // Support options
  const supportOptions = [
    {
      title: 'Documentation',
      description: 'Browse through our comprehensive documentation',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      )
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video tutorials',
      icon: (
        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      title: 'Community Forum',
      description: 'Get help from the community and other teachers',
      icon: (
        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
        </svg>
      )
    },
    {
      title: 'Contact Support',
      description: 'Get help directly from our support team',
      icon: (
        <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
        </svg>
      )
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
    
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-medium text-gray-900 text-lg">Help & Support</h3>
          <p className="text-sm text-gray-500 mt-1">Find answers and get support for your teaching needs</p>
        </div>
        
        <div className="p-6">
          <div className="flex w-full max-w-xl mx-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {supportOptions.map((option, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="p-2 rounded-lg inline-block">
                {option.icon}
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900">{option.title}</h4>
              <p className="mt-2 text-sm text-gray-500">{option.description}</p>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                <span>Learn more</span>
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-medium text-gray-900 text-lg">Frequently Asked Questions</h3>
          <p className="text-sm text-gray-500 mt-1">Quick answers to common questions</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => (
              <div key={faq.id} className="hover:bg-gray-50 transition-colors duration-150">
                <button
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex justify-between items-start text-left"
                >
                  <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${activeFaq === faq.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    activeFaq === faq.id ? 'max-h-60 py-2 pb-4' : 'max-h-0'
                  }`}
                >
                  <p className="text-sm text-gray-500">{faq.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500">No matching questions found. Try a different search term.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Contact Form */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-medium text-gray-900 text-lg">Still Need Help?</h3>
          <p className="text-sm text-gray-500 mt-1">Send us a message and we'll get back to you</p>
        </div>
        
        <div className="p-6">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport; 