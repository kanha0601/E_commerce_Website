import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2 } from "lucide-react";

function AdminContact() {
    const [contact, setContact] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContact = async () => {
        try {
            const res = await api.get("/contact/get");
            if (res.data.status) {
                setContact(res.data.contact);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContact();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return;

        try {
            const res = await api.delete(`/contact/delete/${id}`);
            alert(res.data.message);
            setContact((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.log(err);
            alert("Failed to delete contact");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-lg font-semibold text-gray-600">
                    Loading contacts...
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-100 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">
                <h2 className="text-3xl font-bold mb-6 text-slate-800">
                    Contact Messages
                </h2>

                {contact.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No contact messages found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-200 text-slate-700">
                                    <th className="p-4 border-b">Name</th>
                                    <th className="p-4 border-b">Email</th>
                                    <th className="p-4 border-b">Phone</th>
                                    <th className="p-4 border-b">Message</th>
                                    <th className="p-4 border-b text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {contact.map((ele) => (
                                    <tr
                                        key={ele._id}
                                        className="border-b hover:bg-slate-50 transition"
                                    >
                                        <td className="p-4 font-medium text-slate-800">
                                            {ele.name}
                                        </td>

                                        <td className="p-4 text-slate-600">
                                            {ele.email}
                                        </td>

                                        <td className="p-4 text-slate-600">
                                            {ele.phone}
                                        </td>

                                        <td className="p-4 text-slate-600 max-w-md break-words">
                                            {ele.message}
                                        </td>

                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(ele._id)}
                                                className="p-2 rounded-full hover:bg-red-100 transition"
                                            >
                                                <Trash2
                                                    size={18}
                                                    className="text-red-500 hover:text-red-700"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminContact;
