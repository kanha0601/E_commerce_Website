import { useCart } from "../context/CartContext";
import { X } from "lucide-react";
import api from "../services/api";

const CartSidebar = ({ showCart, setShowCart }) => {
    const { cart, removeFromCart, clearCart, totalPrice } = useCart();

    const handlePay = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login to place order");
                return;
            }

            await api.post(
                "/order/create",
                {
                    products: cart.map(item => ({
                        product: item._id,
                        quantity: item.quantity || 1,
                        price: item.price,
                    })),
                    totalAmount: totalPrice(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Order placed successfully ✅");

            clearCart();          // 🔥 clear cart
            setShowCart(false);   // 🔥 close sidebar

        } catch (error) {
            console.error(error);
            alert("Order failed ❌");
        }
    };


    if (!showCart) return null;

    return (
        <div className="fixed inset-0 bg-opacity-40 z-50">
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Cart</h2>
                    <button onClick={() => setShowCart(false)}>
                        <X />
                    </button>
                </div>

                {cart.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">
                        Cart is empty 🛒
                    </p>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {cart.map(item => (
                                <div
                                    key={item._id}
                                    className="flex justify-between items-center border-b pb-2"
                                >
                                    <div>
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            ₹{item.price} × {item.quantity}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <p className="font-semibold mb-3">
                                Total: ₹{totalPrice()}
                            </p>
                            <button
                                onClick={handlePay}
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            >
                                Pay Now
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
