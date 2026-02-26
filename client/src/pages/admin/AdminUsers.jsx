import { useEffect, useState } from "react";
import api from "../../services/api";
import UserOrdersModal from "../../components/admin/UserOrdersModal";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUsers(res.data.users);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border capitalize">{user.role}</td>
              <td className="p-2 border">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View Orders
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedUser && (
        <UserOrdersModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
