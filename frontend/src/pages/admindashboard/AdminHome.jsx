import React from "react";
import { Users, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";

const dashStats = [
  {
    name: "Users",
    icon: <Users size={20} />,
    primary: 1300,
    primaryLabel: "Total Users",
    data: {
      Active: 800,
      Inactive: 500,
      Blocked: 100,
    },
  },
  {
    name: "Orders",
    icon: <ShoppingCart size={20} />,
    primary: 1900,
    primaryLabel: "Total Orders",
    data: {
      Pending: 145,
      Confirmed: 2000,
      Cancelled: 86,
      Shipped: 49,
    },
  },
//   {
//     name: "Revenue",
//     icon: <DollarSign size={20} />,
//     primary: 88000,
//     primaryLabel: "Monthly Revenue",
//     data: {
//       Quarterly: 1000000,
//     },
//   },
];

const recentOrders = [
  { id: "#ORD123", total: 2200, status: "pending", date: "Today" },
  { id: "#ORD124", total: 1400, status: "confirmed", date: "Yesterday" },
];

// query fn

import {useQuery} from '@tanstack/react-query'
import { adminLoadProducts } from "../../services/api/admin/dashboard";

function AdminHome() {

    const {data:dashboardStats,isLoading,isError} = useQuery({
        queryKey:['dashboard-stats'],
        queryFn: () => adminLoadProducts(),
    }) 

    if(isLoading) return <div>
        <p>Loading... </p>
    </div>

    if(isError)return <div>
        <p>Something went wrong,please try after some time.</p>
    </div>



  return (
    <div className="admin-home">

      {/* ===================== */}
      {/* DASHBOARD OVERVIEW */}
      {/* ===================== */}
      <section>
        <h2 className="section-title">Dashboard Overview</h2>

        <div className="adminDash">

          {dashStats.map((stat, index) => (
            <div key={index} className="admin-card">

              {/* Header */}
              <div className="card-header">
                <div className="card-icon">{stat.icon}</div>
                <h4>{stat.name}</h4>
              </div>

              {/* Primary */}
              <div className="card-primary">
                <h1>{stat.primary.toLocaleString()}</h1>
                <p>{stat.primaryLabel}</p>
              </div>

              {/* Secondary */}
              <div className="card-stats">
                {Object.entries(stat.data).map(([key, value]) => (
                  <div key={key} className="stat-box">
                    <span>{key}</span>
                    <strong>{value.toLocaleString()}</strong>
                  </div>
                ))}
              </div>

            </div>
          ))}

          {/* LOW STOCK ALERT CARD */}
          <div className="admin-card warning">
            <div className="card-header">
              <AlertTriangle size={20} />
              <h4>Low Stock Alert</h4>
            </div>

            <div className="card-primary">
              <h1>5</h1>
              <p>Products Running Low</p>
            </div>

            <button className="action-btn">
              View Products
            </button>
          </div>

        </div>
      </section>

      {/* ===================== */}
      {/* RECENT ORDERS */}
      {/* ===================== */}
      <section>
        <h2 className="section-title">Recent Orders</h2>

        <div className="recent-order-wrapper">

          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>₹ {order.total}</td>

                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>{order.date}</td>

                  <td>
                    <button className="btn success">Confirm</button>
                    <button className="btn danger">Cancel</button>
                    <button className="btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </section>

    </div>
  );
}

export default AdminHome;