import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useDeleteMutation = ({ mutationFn, queryKey, getId}) => {
  const queryClient = useQueryClient();
  const notify = useNotification();

  return useMutation({
    mutationFn,
    onSuccess: (res, deletedId) => {
      queryClient.setQueryData(queryKey, (oldData=[]) =>
        oldData.filter((item) => getId(item) !== deletedId)
      );
      notify(res?.message, "success");
    },
    onError: (error) => {
      const err =
        error?.response.data.error ||
        "Something went wrong, operation unsuccessful";
      notify(err, "error");
    }
  });
}