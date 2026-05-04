import React,{ useState , useEffect} from "react";

import { Users, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";

import { formatDateTime } from "../../utils/date";

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

import { useQuery } from '@tanstack/react-query'
import { adminloadOrders } from "@services/api/admin/admin.js";
import { useNavigate } from "react-router-dom";
import { finalizeOrderAPI } from "@services/api/admin/admin.js";
import { useMutation } from "@tanstack/react-query";

function AdminHome() {

    const [page,setPage] = useState(1)
    const navigate = useNavigate()

    const {data:orderList,isLoading,isError} = useQuery({
        queryKey:['admin-recent-order',page],
        queryFn: () => adminloadOrders(page),
        keepPreviousData: true,
    }) 

    const finalizeOrder = useMutation({
      mutationFn: ({order,status})=>{
        const payload = {
          order_id:order.id,
          items:order.order_items.map((item)=>({
            id:item.id,
            status:status
          }))
        }
        finalizeOrderAPI(payload)
      }
    })

    if(isLoading) return <div>
        <p>Loading... </p>
    </div>

    if(isError)return <div>
        <p>Something went wrong,please try after some time.</p>
    </div>

    console.log("console.log",orderList)

    



  return (
    <div className="admin-home">

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
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              { orderList.results.map(order => {
                const { date,time } = formatDateTime(order.created_at)
              
                return (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>₹ {order.total}</td>

                        <td>
                          <span className= {`status ${order.status}`}>
                            {order.order_status.toUpperCase()}
                          </span>
                        </td>

                        <td>{date}</td>
                        <td>{time}</td>

                        <td>
                          {['pending'].includes(order.order_status) && (
                              <>
                                <button 
                                  disabled={finalizeOrder.isPending}
                                  onClick={ () => finalizeOrder.mutate({order,status:"confirmed"})} 
                                  className="btn success">Confirm</button>

                                  <button 
                                  disabled={finalizeOrder.isPending}
                                  onClick={ () => finalizeOrder.mutate({order,status:'cancelled'})}
                                  className="btn danger">Cancel</button>
                              </>
                            )}
                          <button className="btn" onClick={()=>navigate(`order-detail/${order.id}`,{state:order})}>View</button>
                        </td>
                      </tr>
                    )})}
            </tbody>
          </table>

          </div>

          <div className="pagination">
            <button 
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              Prev
            </button>

            <span>Page {page}</span>

            <button 
              disabled={!orderList.next} // DRF gives next URL
              onClick={() => setPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>

        
      </section>

    </div>
  );
}

export default AdminHome;