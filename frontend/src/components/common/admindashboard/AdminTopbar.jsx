function AdminTopbar({ setOpen }) {
  return (
    <div className="admin-topbar">

      <button className="menu-btn" onClick={() => setOpen(true)}>
        ☰
      </button>

      <h2>Minimal-Commerce</h2>

    </div>
  )
}

export default AdminTopbar