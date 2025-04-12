import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "REMOVE":
      return null;
    default:
      return state;
  }
}

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [ notification, dispatch ] = useReducer(notificationReducer, null);

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      { children }
    </NotificationContext.Provider>
  );
}

export default NotificationContext;