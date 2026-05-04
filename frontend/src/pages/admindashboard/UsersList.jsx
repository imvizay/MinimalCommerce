import "@assets/css/admindashboard/admin_userlist.css";
import React,{ useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { loadUsers } from '@services/api/admin/admin'
function UsersList() {

    const [ page , setPage ] = useState(1)
    const limit = 10
   
    const { data:users,isPending,isError } = useQuery({
        queryKey:['users-list',page],
        queryFn: () => loadUsers(page),
        keepPreviousData:true,  
    })

    if (isPending) return <p>Loading users...</p>
    if (isError) return <p>Something went wrong</p>

    const totalPages = Math.ceil( users.count / limit )

    
    
  return (
     <div className="users-container">

      <div className="user-table-head">
        <h2>User List</h2>
        {/* <button>Add User</button> */}
      </div>

      {/* ================= TABLE ================= */}
      <div className="users-content">
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.results.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.email.split('@')[0] || "N/A"}</td>
              <td>{user.contact || "N/A"}</td>
              <td>{user.address || "N/A"}</td>


              <td>
                <span className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              <td>
                <div>
                    <button>Check</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="pagination">

        {/* Prev */}
        <button 
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
        >
          Prev
        </button>

        {/* Dynamic Page Buttons */}
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNumber = i + 1
          return (
            <button
              key={pageNumber}
              className={page === pageNumber ? 'active-page' : ''}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        })}

        {/* Next */}
        <button 
          disabled={!users.next}
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>

      </div>

    </div>
  
  )
}

export default UsersList