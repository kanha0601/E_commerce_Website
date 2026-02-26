import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../services/api";

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await api.get("/order/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">

      {/* PROFILE INFO */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">User Profile</h3>

        <div className="space-y-3">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p>
            <strong>Role:</strong>{" "}
            <span
              className={`px-2 py-1 text-xs rounded-full ${user?.role === "admin"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
                }`}
            >
              {user?.role}
            </span>
          </p>
        </div>
      </div>

      {/* ORDERS SECTION */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">My Orders</h3>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order._id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">
                    Order ID: {order._id.slice(-6)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize ${order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "paid"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "shipped"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <div className="space-y-1">
                  {order.products.map(item => (
                    <p key={item._id} className="text-sm">
                      {item.product?.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <p className="mt-2 font-semibold">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
