import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Editor from "@/components/editor/editor";
import { announcementService } from "@/services/announcements";
import { useNotification, useDeleteMutation } from "@/hooks";
import Spinner from "@/components/ui/spinner";
import Card from "@/components/ui/dashboard/classrooms/classroom/announcements/card";
import { authService } from "../../../../../services/auth";


export default function Announcements() {
  const classroom  = useOutletContext();
  const queryClient = useQueryClient();
  const notify = useNotification();
  const { role } = authService.getAuthenticatedUser();
  const writerROle = role === 'admin' || role === 'instructor';


  const [content, setContent] = useState('');
  const [editId, setEditId] = useState("");
  const [delId, setDelId] = useState("")


  const { data: announcements=[], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => announcementService.fetchAnnouncements(classroom?.id),
    refetchOnWindowFocus: false,
    retry: 3
  });
  
  const { data: announcement = {} } = useQuery({
    queryKey: ["announcement", editId],
    queryFn: () => announcementService.fetchAnnouncementById(editId),
    enabled: !!editId
  });


  const announcementMutation = useMutation({
    mutationFn: (formData) => announcementService.mutateAnnouncement(formData),
        onSuccess: (announcement) => {
          const announcements = queryClient.getQueryData(["announcements"]) || [];
          if (editId) {
            const updatedAnnouncement = announcements.map(c => 
              c.id === announcement.id ? announcement : c
            );
            queryClient.setQueryData(["announcements"], updatedAnnouncement);
          } else {
            queryClient.invalidateQueries(["announcements"])
            
          }
          // Here you would typically show success message or redirect
          if (editId) {
            notify("Announcement updated successfully!", "success");
          } else {
            notify("Announcement created successfully!", "success");
          }
          setEditId("")
        },
        onError: (error) => {
          const err = error?.response.data.error || "Something went wrong, operation unsuccessful"
          
          notify(err, "error");
        },
  });
  
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async (contentToSubmit) => {
    if (!contentToSubmit) {
      notify("Content is required", "info");
      return;
    }
    const formData = editId
      ? { content: contentToSubmit, id: editId }
      : { content: contentToSubmit, classroom: classroom.id };

    announcementMutation.mutate(formData);
    setContent("");
    // setSavedContent(contentToSubmit);

    // Return success to the editor component
    return true;
  };

  const handleCancel = () => {
    setContent("");
    setEditId("")
  }

  const handleEdit = (id) => {
    setEditId(id);
  }

  const { mutate: deleteItem } = useDeleteMutation({
    mutationFn: () => announcementService.deleteAnnouncement(delId),
    queryKey: ["announcements"],
    getId: item => item.id
  });
  
  const handleDelete = (id) => {
    setDelId(id);
    deleteItem(id);
    
  }

  useEffect(() => {
    if (editId) {
      setContent(announcement.content);
    }
  }, [editId, announcement.content])




  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Announcements</h2>
      </div>
      {writerROle && (
        <div className="mb-15">
          <Editor
            initialValue={content}
            onChange={handleContentChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitButtonText="Post"
            // cancelButtonText="Discard Changes"
          />
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-2xl shadow-sm">
          <div className="text-4xl mb-3">🧐</div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No announcements found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            There are no announcements in this classroom yet. Once added, your
            classroom announcements will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              announcement={announcement}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

