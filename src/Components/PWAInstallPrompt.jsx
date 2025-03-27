import React from 'react';

class PWAInstallPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      installPrompt: null,
      isVisible: false
    };
  }

  componentDidMount() {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.setState({ 
        installPrompt: e,
        isVisible: true
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.setState({ isVisible: false });
    }

    // Store the event listener reference for cleanup
    this.beforeInstallPromptHandler = handleBeforeInstallPrompt;
  }

  componentWillUnmount() {
    // Clean up the event listener when component is unmounted
    window.removeEventListener('beforeinstallprompt', this.beforeInstallPromptHandler);
  }

  handleInstallClick = () => {
    const { installPrompt } = this.state;
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
      this.setState({
        installPrompt: null,
        isVisible: false
      });
    });
  };

  render() {
    const { isVisible } = this.state;

    if (!isVisible) return null;

    return (
      <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 max-w-md mx-auto flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Install EduGenius</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Install our app for a better experience</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => this.setState({ isVisible: false })}
            className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-200"
          >
            Later
          </button>
          <button 
            onClick={this.handleInstallClick}
            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Install
          </button>
        </div>
      </div>
    );
  }
}

export default PWAInstallPrompt; 