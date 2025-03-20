/**
 * Service for text-to-speech functionality
 */
export const speechService = {
    // The speech synthesis interface
    synth: typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null,
    
    // Current utterance being spoken
    currentUtterance: null,
    
    // Speaking status
    isSpeaking: false,
    
    /**
     * Check if speech synthesis is supported
     * @returns {boolean} - Whether speech synthesis is supported
     */
    isSupported: function() {
        return !!this.synth;
    },
    
    /**
     * Speak text aloud
     * @param {string} text - Text to be spoken
     * @param {Object} options - Speech options
     * @param {string} options.lang - Language code (e.g., 'en-US', 'hi-IN')
     * @param {string} options.voice - Voice name (optional)
     * @param {number} options.rate - Speech rate (0.1 to 10, default 1)
     * @param {number} options.pitch - Speech pitch (0 to 2, default 1)
     * @param {number} options.volume - Speech volume (0 to 1, default 1)
     * @returns {boolean} - Whether speaking was initiated successfully
     */
    speak: function(text, options = {}) {
        // Check if speech synthesis is supported
        if (!this.isSupported()) {
            console.warn('Speech synthesis is not supported in this browser');
            return false;
        }
      
        try {
            // Cancel any ongoing speech
            this.stop();
            
            // Create a new utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set language if provided
            if (options.lang) {
                utterance.lang = options.lang;
            }
            
            // Set options
            if (options.voice) {
                // Make sure voices are loaded
                let voices = this.synth.getVoices();
                
                // If voices aren't loaded yet, try to wait for them
                if (voices.length === 0 && 'onvoiceschanged' in this.synth) {
                    console.log('No voices available yet, waiting for them to load...');
                    
                    // Try again in a moment
                    setTimeout(() => {
                        voices = this.synth.getVoices();
                        const selectedVoice = voices.find(voice => voice.name === options.voice);
                        if (selectedVoice) utterance.voice = selectedVoice;
                        
                        this._startSpeaking(utterance);
                    }, 100);
                    
                    return true;
                }
                
                const selectedVoice = voices.find(voice => voice.name === options.voice);
                if (selectedVoice) utterance.voice = selectedVoice;
            }
            
            if (options.rate) utterance.rate = options.rate;
            if (options.pitch) utterance.pitch = options.pitch;
            if (options.volume) utterance.volume = options.volume;
            
            return this._startSpeaking(utterance);
        } catch (error) {
            console.error('Error in speech synthesis:', error);
            return false;
        }
    },
    
    /**
     * Internal method to start speaking
     * @private
     * @param {SpeechSynthesisUtterance} utterance - The utterance to speak
     * @returns {boolean} - Whether speaking was initiated successfully
     */
    _startSpeaking: function(utterance) {
        try {
            // Set up event handlers
            utterance.onstart = () => {
                this.isSpeaking = true;
            };
            
            utterance.onend = () => {
                this.isSpeaking = false;
                this.currentUtterance = null;
            };
            
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                this.isSpeaking = false;
                this.currentUtterance = null;
            };
            
            // Save the current utterance
            this.currentUtterance = utterance;
            
            // Start speaking
            this.synth.speak(utterance);
            
            return true;
        } catch (error) {
            console.error('Error starting speech:', error);
            return false;
        }
    },
    
    /**
     * Stop the current speech
     */
    stop: function() {
        if (!this.isSupported()) return;
        
        try {
            if (this.isSpeaking) {
                this.synth.cancel();
                this.isSpeaking = false;
                this.currentUtterance = null;
            }
        } catch (error) {
            console.error('Error stopping speech:', error);
        }
    },
    
    /**
     * Pause the current speech
     */
    pause: function() {
        if (!this.isSupported()) return;
        
        try {
            if (this.isSpeaking) {
                this.synth.pause();
            }
        } catch (error) {
            console.error('Error pausing speech:', error);
        }
    },
    
    /**
     * Resume the current speech
     */
    resume: function() {
        if (!this.isSupported()) return;
        
        try {
            if (this.currentUtterance && !this.isSpeaking) {
                this.synth.resume();
            }
        } catch (error) {
            console.error('Error resuming speech:', error);
        }
    },
    
    /**
     * Get all available voices
     * @returns {Array} - Array of available voices
     */
    getVoices: function() {
        if (!this.isSupported()) return [];
        
        try {
            return this.synth.getVoices();
        } catch (error) {
            console.error('Error getting voices:', error);
            return [];
        }
    }
};