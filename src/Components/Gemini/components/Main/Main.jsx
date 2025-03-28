import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const{onSent,recentPrompt,showResult,loading,resultData,setInput,input} = useContext(Context)
    const [userName, setUserName] = useState("User");
    const [userPhoto, setUserPhoto] = useState(assets.user_icon);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from session storage
        const storedName = sessionStorage.getItem('userName');
        const storedPhoto = sessionStorage.getItem('googlePhotoURL') || sessionStorage.getItem('userPhoto');
        
        // Extract first name if full name is available
        if (storedName) {
            const firstName = storedName.split(' ')[0];
            setUserName(firstName);
        }
        
        // Set profile photo if available
        if (storedPhoto) {
            setUserPhoto(storedPhoto);
        }
    }, []);

    // Ensure the user photo is properly loaded and fallback to a default if needed
    useEffect(() => {
        const loadUserPhoto = () => {
            try {
                // First check for Google photo (highest priority)
                const googlePhotoURL = sessionStorage.getItem('googlePhotoURL');
                
                if (googlePhotoURL) {
                    console.log('Using Google profile picture in Gemini Main');
                    
                    // Pre-validate the image
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.referrerPolicy = "no-referrer";
                    
                    img.onload = () => {
                        console.log('Google profile image validated in Gemini Main');
                        setUserPhoto(googlePhotoURL);
                    };
                    
                    img.onerror = () => {
                        console.warn('Google profile image failed to load in Gemini Main, using default');
                        // Fallback to any other user photo or default
                        const userProfile = sessionStorage.getItem('userPhotoURL') || assets.user_icon;
                        setUserPhoto(userProfile);
                    };
                    
                    // Start loading the image
                    img.src = googlePhotoURL;
                    return;
                }
                
                // Try regular user photo
                const userProfile = sessionStorage.getItem('userPhotoURL');
                if (userProfile) {
                    setUserPhoto(userProfile);
                    return;
                }
                
                // Default fallback
                setUserPhoto(assets.user_icon);
            } catch (error) {
                console.error('Error loading user photo in Gemini Main:', error);
                setUserPhoto(assets.user_icon);
            }
        };
        
        loadUserPhoto();
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && input) {
            onSent();
        }
    };

    const handleSendMessage = () => {
        if (input.trim()) {
            onSent();
        }
    };

    const handleBack = () => {
        const userRole = sessionStorage.getItem('userRole');
        if (userRole === 'student') {
            navigate('/student-dashboard');
        } else if (userRole === 'teacher') {
            navigate('/teacher-dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className='gemini-main'>
            <div className="gemini-nav">
                <p>EduGenius</p>
                <div className="gemini-nav-right">
                    <button 
                        onClick={handleBack}
                        className="gemini-back-button gemini-back-button-circle"
                    >
                        <svg className="gemini-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                    </button>
                    <img 
                        src={userPhoto} 
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                            console.warn('Failed to load profile image in Gemini Main');
                            e.target.src = assets.user_icon;
                        }} 
                    />
                </div>
            </div>
            <div className="gemini-main-container">
                {!showResult
                ?<>
                <div className="gemini-greet">
                    <p><span>Hello, {userName}.</span></p>
                    <p>How can I help you today?</p>
                </div>
                <div className="gemini-cards">
                    <div className="gemini-card">
                        <p>Suggest beautiful places to see on an upcoming road trip</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>
                    <div className="gemini-card">
                        <p>Briefly summarize this concept: urban planning</p>
                        <img src={assets.bulb_icon} alt="" />
                    </div>
                    <div className="gemini-card">
                        <p>Brainstorm team bonding activities for our work retreat</p>
                        <img src={assets.message_icon} alt="" />
                    </div>
                    <div className="gemini-card">
                        <p>Improve the readability of the following code</p>
                        <img src={assets.code_icon} alt="" />
                    </div>
                </div>
                </>
                :<div className="gemini-result">
                    <div className="gemini-result-title">
                        <img 
                            src={userPhoto} 
                            alt="Profile"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                                console.warn('Failed to load profile image in Gemini Main');
                                e.target.src = assets.user_icon;
                            }} 
                        />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="gemini-result-data">
                        <img src={assets.gemini_icon} alt="" />
                        {loading
                        ?<div className='gemini-loader'>
                           <hr />
                           <hr />
                           <hr />
                        </div>
                        :<p dangerouslySetInnerHTML={{__html:resultData}}></p>}
                    </div>
                </div>
                }
                
                <div className="gemini-main-bottom">
                    <div className="gemini-search-box">
                    <input 
                        onChange={(e) => setInput(e.target.value)} 
                        onKeyDown={handleKeyPress}
                        value={input} 
                        type="text" 
                        placeholder="Learn with EduGenius..." 
                    />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input ? 
                            <img 
                                onClick={handleSendMessage} 
                                src={assets.send_icon} 
                                alt="" 
                            /> 
                            : null}
                        </div>
                    </div>
                    <p className='gemini-bottom-info'>EduGenius may display inaccurate info, including about people, so double-check its responses.</p>
                </div>
            </div>
        </div>
    )
}

export default Main 