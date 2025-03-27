import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Correctly define and export AppContent
export const AppContent = createContext(null);

const AppContextProvider = ({ children }) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        try {
            const response = await fetch("http://localhost:8000/user/data", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
    
            if (!response.ok) {
                console.error("Error fetching user data:", response.statusText);
                return;
            }
            
            const data = await response.json();
    
            if (data.success) {
                console.log("User Data:", data.userData);
                return data.userData;
            } else {
                console.error("Error fetching user data:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
      

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/user/is-auth`);
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            toast.error("Authentication check failed");
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    return (
        <AppContent.Provider value={{ backendUrl, isLoggedin, setIsLoggedin, userData, setUserData, getUserData }}>
            {children}
        </AppContent.Provider>
    );
};

export default AppContextProvider; // ✅ Ensure default export
