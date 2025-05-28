import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstancenew";

export default function ProfilePage() {
 const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axiosInstance.get('/api/me');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        // Optionally redirect to login if unauthorized
      }
    };

    getUserInfo();
  }, []);

  if (!user) return <div>Loading user data...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Welcome, {user.username}</h1>
      
    </div>
  );
}
  

