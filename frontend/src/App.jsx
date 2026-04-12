import React from 'react'

// routes components
import { Routes,Route } from 'react-router-dom'

// route components
import Navbar from './components/common/Navbar'

// forms
import Login from './components/forms/Login'
import Signup from './components/forms/Register'
import Base from './layout/Base'


function App() {
  return (
    <>
    <Routes>

      {/* Base Route */}
      <Route path='/' element={<Base/>}>
        {/* Child Routes  */}
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
      </Route>

    </Routes>
    </>
  )
}

export default App