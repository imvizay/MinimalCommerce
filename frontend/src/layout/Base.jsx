import React from 'react'
import Navbar from '@components/common/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '@components/common/Footer'


function Base() {
  return (
    <div>
      {/* Static Navbar */}
      <Navbar/>

      {/* Children Outlet */}
      <main>
        <Outlet/>
      </main>

      {/* Static Footer */}
      <Footer/>
    </div>
  )
}

export default Base