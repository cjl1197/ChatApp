import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobalContext = React.createContext();

const GlobalContextProvider = ({children}) => {

    const [userID, setUserID] = useState();
    const [username, setUsername] = useState();


    return (
        <GlobalContext.Provider value={{
            userID,
            setUserID,
            username,
            setUsername
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider