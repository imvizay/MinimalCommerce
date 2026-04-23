import React from 'react'

// routes components
import { Routes,Route } from 'react-router-dom'

// route components
import Navbar from './components/common/Navbar'

// forms
import Login from './components/forms/Login'
import Signup from './components/forms/Register'
import Base from './layout/Base'
import DisplayProducts from './pages/DisplayProducts'
import Cart from './pages/Cart'


function App() {
  return (
    <>
    <Routes>

      {/* Base Route */}
      <Route path='/' element={<Base/>}>
        <Route index element = {<DisplayProducts/>}></Route>
        {/* Child Routes  */}
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='cart' element={<Cart/>}></Route>
      </Route>

    </Routes>
    </>
  )
}

export default App