import { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
      // Show the install prompt
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA installation');
      } else {
        console.log('User dismissed the PWA installation');
      }
      // Clear the saved prompt since it can't be used again
      setInstallPrompt(null);
      setIsVisible(false);
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 max-w-md mx-auto flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">Install EduGenius</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Install our app for a better experience</p>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => setIsVisible(false)}
          className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-200"
        >
          Later
        </button>
        <button 
          onClick={handleInstallClick}
          className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt; 