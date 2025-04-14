import { useContext } from "react";
import NotificationContext from "../contexts/notification";


export const useNotification = () => {
  const { dispatch } = useContext(NotificationContext);

  return (message, type, timeout = 8000) => {
    dispatch({ type: "SET", payload: { message, type } });

    const t = setTimeout(() => {
      dispatch({ type: "REMOVE" });
    }, timeout);

    return () => clearTimeout(t);
  };
};