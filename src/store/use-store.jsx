import {createContext, useContext} from "react";

export const StoreContext = createContext(initialState);

export const initialState = {
    data: "test data",
    refreshData: () => console.log("test refresh data"),
}

export const useStore = () => useContext(StoreContext);