import {createContext, useContext, useState} from "react";

// Create context
export const AppContext = createContext();


// Provider component
export function AppProvider({children}) {
    const [data, setData] = useState({});

    // Actions
    const setFormValues = (values) => {
        setData((prevValues) => ({
            ...prevValues,
            ...values,
        }));
    };

    return (
        <AppContext.Provider value={{data, setFormValues}}>
            {children}
        </AppContext.Provider>
    );
}

export function useFormData() {
    return useContext(AppContext);
}