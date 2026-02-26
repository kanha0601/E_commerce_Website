import { useEffect, useState } from "react";
import api from "../../services/api";
import { X } from "lucide-react";

const UserOrdersModal = ({ user, onClose }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await api.get(`/admin/users/${user._id}/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setOrders(res.data.orders);
        };
        fetchOrders();
    }, [user]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-2/3 p-5 rounded shadow-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3">
                    <X />
                </button>

                <h3 className="text-xl font-bold mb-4">
                    Orders of {user.name}
                </h3>

                {orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="border p-3 mb-3 rounded">
                            <p className="font-semibold">
                                Order ID: {order._id}
                            </p>
                            <p>Status: <span className="capitalize">{order.status}</span></p>
                            <p>Total: ₹{order.totalAmount}</p>

                            <ul className="ml-4 mt-2 list-disc">
                                {order.products.map((p, i) => (
                                    <li key={i}>
                                        {p.product?.name} × {p.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserOrdersModal;
