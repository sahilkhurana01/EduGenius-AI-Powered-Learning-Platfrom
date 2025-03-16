import React from 'react'
import Sidebar from './components/sideBar/sideBar'
import Main from './components/Main/Main'
import './gemini-styles.css'

const App = () => {
  return (
    <div className='gemini-app'>
        <Sidebar />
        <Main />
    </div>
  )
}

export default App 