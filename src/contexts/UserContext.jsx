import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../Api/userApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();

      setUser(res.data.user);

    } catch (error) {
      console.log("User fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);