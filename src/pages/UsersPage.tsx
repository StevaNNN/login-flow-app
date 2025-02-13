import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import { deleteUser, getUsers } from "../api";
import { USER } from "../Types";

const UsersPage = () => {
  const authContext = useContext(AuthContext);
  const [users, setUsers] = useState<USER[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    authContext?.logout();
    navigate("/login");
  };

  const handleUserDelete = async (user: USER) => {
    const userEmail = users.find((item) => item._id === user._id)?.email;
    setUsers((prevState) => {
      return prevState.filter((u) => u._id !== user._id);
    });
    if (userEmail) {
      await deleteUser(userEmail);
      if (userEmail === authContext?.user?.email) authContext.logout();
      navigate("/login");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <h1 className="text-3xl font-bold underline mb-4 text-emerald-200">
          Users page!
        </h1>
        <h1 className="text-xl mb-4 text-emerald-200">
          Active user is: {authContext?.user?.email}
        </h1>
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <ul>
            {users?.map((user) => {
              return (
                <li
                  key={user._id}
                  className="mb-4 border-b last:border-b-0 pb-2 flex items-center justify-between"
                >
                  {user.email}
                  <button
                    className="bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 mt-4"
                    onClick={() => handleUserDelete(user)}
                  >
                    Delete user
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          className="bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 mt-4"
          onClick={() => navigate("/info")}
        >
          Go to Info page
        </button>
      </div>
      <Outlet />
    </>
  );
};

export default UsersPage;
