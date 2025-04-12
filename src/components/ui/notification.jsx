import { useContext } from "react";
import NotificationContext from "../../contexts/notification";

export default function Notification() {
  const { notification } = useContext(NotificationContext);

  if (!notification) return null;

  return (
    <div
      className="fixed top-[20px] left-[50%] bg-green-50
        py-[15px] px-[10px] rounded-md -transform-[50%] z-[1000]"
    >
      <p className="text-sm text-green-600">{notification}</p>
    </div>
  );
}