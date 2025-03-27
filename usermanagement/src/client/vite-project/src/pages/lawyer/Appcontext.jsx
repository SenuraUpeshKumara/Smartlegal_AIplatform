import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Correctly define and export LawyerContext
export const LawyerContext = createContext(null);

const LawyerContextProvider = ({ children }) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLawyerLoggedin, setIsLawyerLoggedin] = useState(false);
    const [lawyerData, setLawyerData] = useState(null);

    const getLawyerData = async () => {
        try {
            const response = await fetch("http://localhost:8000/lawyer/data", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Error fetching lawyer data:", response.statusText);
                return;
            }

            const data = await response.json();

            if (data.success) {
                console.log("Lawyer Data:", data.lawyerData);
                setLawyerData(data.lawyerData);
            } else {
                console.error("Error fetching lawyer data:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const getLawyerAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/lawyer/is-auth`);
            if (data.success) {
                setIsLawyerLoggedin(true);
                getLawyerData();
            }
        } catch (error) {
            toast.error("Lawyer authentication check failed");
        }
    };

    useEffect(() => {
        getLawyerAuthState();
    }, []);

    return (
        <LawyerContext.Provider value={{ backendUrl, isLawyerLoggedin, setIsLawyerLoggedin, lawyerData, setLawyerData, getLawyerData }}>
            {children}
        </LawyerContext.Provider>
    );
};

export default LawyerContextProvider; // ✅ Ensure default export
