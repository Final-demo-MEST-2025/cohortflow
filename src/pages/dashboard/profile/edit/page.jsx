import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks";
import { profileService } from "../../../../services/profiles";
import ProfileEditForm from "../../../../components/ui/dashboard/profile/edit-form";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const notify = useNotification()
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (credentials) => profileService.updateUserProfile(credentials),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
    },
    onError: () =>
      notify("Something went wrong. Update unsuccessful.", "error"),
  });

  const handleUpdate = (credentials) => {
    updateMutation.mutate(credentials, {
      onSuccess: () => {
        navigate(-1);
        notify("Profile updated successfully", 'success');
      }
    });
  }



  return (
    <main>
      <ProfileEditForm onUpdate={handleUpdate} />
    </main>
  );
}
