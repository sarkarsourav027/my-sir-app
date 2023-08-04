import {createContext, useContext, useState} from "react";

// Create context
export const FormContext = createContext();


// Provider component
export function FormProvider({children}) {
    const [data, setData] = useState({});

    // Actions
    const setFormValues = (values) => {
        setData((prevValues) => ({
            ...prevValues,
            ...values,
        }));
    };

    return (
        <FormContext.Provider value={{data, setFormValues}}>
            {children}
        </FormContext.Provider>
    );
}

export function useFormData() {
    return useContext(FormContext);
}