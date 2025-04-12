import { useContext } from "react";
import NotificationContext from "../contexts/notification";


export const useNotification = () => {
  const { dispatch } = useContext(NotificationContext);

  return (message, timeout = 5000) => {
    dispatch({ type: "SET", payload: message });

    const t = setTimeout(() => {
      dispatch({ type: "REMOVE" });
    }, timeout);

    return () => clearTimeout(t);
  };
};