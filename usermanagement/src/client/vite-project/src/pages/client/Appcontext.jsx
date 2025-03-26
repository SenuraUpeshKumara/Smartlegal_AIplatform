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
            const { data } = await axios.get(`${backendUrl}/user/data`);
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch user data");
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
