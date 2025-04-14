import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/users";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { RegisterForm } from "@/components/ui/dashboard/users/create-form";
import { useNotification } from "@/hooks";

export default function Page() {
  const navigate = useNavigate();
  const notify = useNotification();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: (credentials) => userService.registerUser(credentials),
    onSuccess: (user) => {
      console.log(user)
      queryClient.getQueryData(['userData'])
      // queryClient.setQueryData(['userData'], users.concat(user))
    },
    onError: () => notify(
      'Something went wrong. User registration unsuccessful.',
      'error'
    )
  })

  const onSuccess = (credentials, message) => {
    registerMutation.mutate(credentials, {
      onSuccess: () => {
        navigate(-1);
        notify(message, 'success');
      },
    });
  }

  const onSubmitAndAdd = (credentials) => {
    registerMutation.mutate(credentials);
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', to: '/dashboard/users' },
          {
            label: 'Create User',
            to: '/dashboard/users/create',
            active: true
          },
        ]}
      />
      <RegisterForm
        onSuccess={onSuccess}
        onSubmitAndAdd={onSubmitAndAdd}
      />
    </main>
  )
}