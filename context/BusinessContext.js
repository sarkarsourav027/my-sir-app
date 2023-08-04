import {createContext, useContext, useState} from "react";

// Create context
export const BusinessContext = createContext({});
export const DashboardContext = createContext({});


// Provider component
export function BusinessProvider({children}) {
    const [globalBusiness, setGlobalBusiness] = useState({});

    // Actions
    const setGlobalBusinessValues = (values) => {
        setGlobalBusiness((prevValues) => ({
            ...prevValues,
            ...values,
        }));
    };

    return (
        <BusinessContext.Provider value={{globalBusiness, setGlobalBusinessValues}}>
            {children}
        </BusinessContext.Provider>
    );
}

export function DashboardProvider({children}) {
    const [globalDashboard, setGlobalDashboard] = useState({});

    // Actions
    const setGlobalDashboardValues = (values) => {
        setGlobalDashboard((prevValues) => ({
            ...prevValues,
            ...values,
        }));
    };

    return (
        <DashboardContext.Provider value={{globalDashboard, setGlobalDashboardValues}}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useBusinessData() {
    return useContext(BusinessContext);
}

export function useDashboardData() {
    return useContext(DashboardContext);
}