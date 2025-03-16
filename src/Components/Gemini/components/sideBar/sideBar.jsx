import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'

const Sidebar = () => {

    const [extended, setExtended] = useState(false)
    const {newChat, prevPrompts, setRecentPrompt, onSent} = useContext(Context)
    const [userPhoto, setUserPhoto] = useState(assets.user_icon);

    useEffect(() => {
        // Get user photo from session storage
        const storedPhoto = sessionStorage.getItem('googlePhotoURL') || sessionStorage.getItem('userPhoto');
        
        // Set profile photo if available
        if (storedPhoto) {
            setUserPhoto(storedPhoto);
        }
    }, []);

    const loadPrompt = async (prompt) => {
        await setRecentPrompt(prompt)
        await onSent(prompt)
    }
    
    const toggleSidebar = () => {
        setExtended(prev => !prev);
    }

    return (
        <div className='gemini-sidebar'>
            <div className="gemini-top">
                <img onClick={toggleSidebar} className='gemini-menu' src={assets.menu_icon} alt="" />
                <div onClick={() => {newChat()}} className="gemini-new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended?<p>New Chat</p>:null}
                </div>
                {extended
                ?<div className="gemini-recent">
                    <p className="gemini-recent-title">Recent</p>
                    {prevPrompts.map((item,index)=>{
                        return(
                            <div onClick={()=>{loadPrompt(item)}} className="gemini-recent-entry" key={index}>
                                <img src={assets.message_icon} alt="" />
                                <p>{item.slice(0,18)}...</p>
                            </div>
                        )
                    })}
                </div>
                :null}
            </div>
            <div className="gemini-bottom">
                <div className="gemini-bottom-item">
                    <img src={assets.question_icon} alt="" />
                    {extended?<p>Help</p>:null}
                </div>
                <div className="gemini-bottom-item">
                    <img src={assets.history_icon} alt="" />
                    {extended?<p>Activity</p>:null}
                </div>
                <div className="gemini-bottom-item">
                    <img src={assets.setting_icon} alt="" />
                    {extended?<p>Settings</p>:null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar 