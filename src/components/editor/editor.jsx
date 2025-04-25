import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { announcementService } from "../../services/announcements";
import { useNotification } from "../../hooks";
import CodeBlockBlot from "./code-block-blot";


const Editor = forwardRef(
  (
    {
      initialValue = "",
      onChange = () => {},
      onSubmit = () => {},
      onCancel = () => {},
      submitButtonText = "Submit",
      cancelButtonText = "Cancel",
      placeholder = "Write something...",
    },
    ref
  ) => {
    const [isRichEditorActive, setIsRichEditorActive] = useState(false);
    const [content, setContent] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const notify = useNotification();

    const textareaRef = useRef(null);
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const onChangeRef = useRef(onChange);

    const imageMutation = useMutation({
      mutationFn: (formData) => announcementService.imageLoad(formData),
      onError: () => {
        notify("Error uploading image", "error");
      }
    });

    // Keep callback refs updated
    useLayoutEffect(() => {
      onChangeRef.current = onChange;
    });

    // Expose quill instance to parent through ref
    useEffect(() => {
      if (ref) {
        ref.current = quillRef.current;
      }
    }, [ref, quillRef.current]);

    // Handle switching from textarea to rich editor
    const activateRichEditor = () => {
      setIsRichEditorActive(true);
    };

    // Initialize Quill when rich editor becomes active
    useEffect(() => {
      if (isRichEditorActive && containerRef.current && !quillRef.current) {
        // Clear container
        containerRef.current.innerHTML = "";

        // Create editor div
        const editorContainer = containerRef.current.appendChild(
          document.createElement("div")
        );

        //Register the custom blot before Quill is initialized
        Quill.register(CodeBlockBlot, true);

        // Initialize Quill with toolbar options
        const toolbarOptions = [
          ["bold", "italic", "underline"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          ["clean"],
          ["blockquote", "code-block"],
          ["link", "file", "image", "video"],
        ];

        // After your toolbarOptions definition
        // const Block = Quill.import("blots/block");
        const icons = Quill.import("ui/icons");

        // Define a custom icon for the file button
        icons['file'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip">
  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
</svg>`;

        // Custom documents handler
        // Integration to the backend not add
        const fileUpload = {
          handlers: {
            file: () => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", ".pdf,.doc,.docx,.ppt,.pptx");
              input.click();

              input.onchange = () => {
                if (input.files && input.files[0]) {
                  const file = input.files[0];
                  const quill = quillRef.current;

                  // Create form data
                  const formData = new FormData();
                  formData.append("file", file);

                  imageMutation.mutate(formData, {
                    onSuccess: (result) => {
                      notify("File uploaded successfully", "success");
                      if (result.success) {
                        // Insert a link to the file in the editor
                        const range = quill.getSelection(true);
                        quill.insertText(
                          range.index,
                          `${file.name} `,
                          "link",
                          result.fileUrl
                        );
                        quill.setSelection(range.index + 1);
                      }
                    },
                  });
                }
              };
            },
          },
        };
        Quill.register("modules/fileUpload", (quill) => {
          quill
            .getModule("toolbar")
            .addHandler("file", fileUpload.handlers.file);
        });

        quillRef.current = new Quill(editorContainer, {
          modules: {
            toolbar: {
              container: toolbarOptions,
              handlers: {
                file: fileUpload.handlers.file,
              },
            },
          },
          theme: "snow",
          placeholder: placeholder,
        });
        // Add this after quillRef.current initialization but before setting content
        const quill = quillRef.current;

        // Fix code block behavior - more robust version
        quill.clipboard.addMatcher("p", (node, delta) => {
          if (delta?.ops?.[0]?.attributes?.["code-block"]) {
            return delta;
          }

          return delta;
        });

        // Optional: Add custom keyboard bindings for better code block handling
        const keyboard = quill.keyboard;
        keyboard.addBinding(
          { key: "Enter" },
          {
            collapsed: true,
            format: { "code-block": true },
          },
          function (range) {
            // This handles Enter key inside code blocks
            quill.insertText(range.index, "\n");
            return false;
          }
        );

        // Custom image handler to over-write the image handler
        quill.getModule("toolbar").addHandler("image", () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = () => {
            const file = input.files[0];
            if (file) {
              // Create form data
              const formData = new FormData();
              formData.append("image", file);

              imageMutation.mutate(formData, {
                onSuccess: (result) => {
                  notify("Image uploaded successfully", "success");
                  if (result.success) {
                    // Insert the image URL at cursor position
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, "image", result.url);
                    quill.setSelection(range.index + 1);
                  }
                },
              });
            }
          };
          // Uncomment this if you prefer data encoding
          // input.onchange = () => {
          //   const file = input.files[0];
          //   if (file) {
          //     const reader = new FileReader();
          //     reader.onload = (e) => {
          //       // Create a temp image to get dimensions
          //       const img = new Image();
          //       img.src = e.target.result;
          //       img.onload = () => {
          //         // Create canvas to resize image
          //         const canvas = document.createElement("canvas");
          //         const ctx = canvas.getContext("2d");

          //         // Set canvas size to desired dimensions
          //         canvas.width = 200;
          //         canvas.height = 200;

          //         // Draw resized image to canvas
          //         ctx.drawImage(img, 0, 0, 200, 200);

          //         // Get resized image as data URL
          //         const resizedImage = canvas.toDataURL("image/jpeg");

          //         // Insert at current cursor position
          //         const range = quill.getSelection(true);
          //         quill.insertEmbed(range.index, "image", resizedImage);
          //         quill.setSelection(range.index + 1);
          //       };
          //     };

          //     reader.readAsDataURL(file);
          //   }
          // };
        });

        // Set content
        if (content) {
          if (content.includes("<") && content.includes(">")) {
            quillRef.current.clipboard.dangerouslyPasteHTML(content);
          } else {
            quillRef.current.setText(content);
          }
        }

        // Focus at end of content
        quillRef.current.focus();
        quillRef.current.setSelection(quillRef.current.getLength(), 0);

        // Set up event handlers using Quill's native event system
        quillRef.current.on(Quill.events.TEXT_CHANGE, () => {
          const html = quillRef.current.root.innerHTML;
          setContent(html);
          onChangeRef.current(html);
        });
      }

      // Clean up when switching to textarea
      return () => {
        if (!isRichEditorActive && quillRef.current) {
          quillRef.current = null;
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
        }
      };
    }, [isRichEditorActive, placeholder]);

    // Clean up on unmount
    useEffect(() => {
      return () => {
        if (quillRef.current) {
          quillRef.current = null;
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
        }
      };
    }, []);

    // Add this useEffect to sync content changes with Quill
    useEffect(() => {
      if (quillRef.current && isRichEditorActive && initialValue !== content) {
        // Temporarily remove the text-change listener to prevent loops
        const oldContent = quillRef.current.root.innerHTML;

        // Only update if content actually changed
        if (oldContent !== initialValue) {
          // Disable the editor's event listener temporarily
          quillRef.current.off("text-change");

          // Update the content
          quillRef.current.root.innerHTML = "";
          if (initialValue) {
            if (initialValue.includes("<") && initialValue.includes(">")) {
              quillRef.current.clipboard.dangerouslyPasteHTML(initialValue);
            } else {
              quillRef.current.setText(initialValue);
            }
          }

          // Restore the text change handler
          quillRef.current.on("text-change", () => {
            const html = quillRef.current.root.innerHTML;
            setContent(html);
            onChangeRef.current(html);
          });

          // Update local state
          setContent(initialValue);
        }
      }
    }, [initialValue, isRichEditorActive]);

    
    // Handle textarea content change
    const handleTextareaChange = (e) => {
      const newContent = e.target.value;
      setContent(newContent);
      onChange(newContent);
    };

    const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
        await onSubmit(content);
      } catch (error) {
        console.error("Error submitting content:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCancel = () => {
      setIsRichEditorActive(false);
      onCancel();
    };

    return (
      <div className="transforming-editor-container">
        {!isRichEditorActive ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              onClick={activateRichEditor}
              onFocus={activateRichEditor}
              placeholder={placeholder}
              className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg 
                    bg-gray-50 text-gray-700
                    placeholder-gray-700
                    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                    transition-colors"
            />

            <div
              className="absolute bottom-3 right-3 text-gray-400 dark:text-gray-500 text-sm flex items-center cursor-pointer"
              onClick={activateRichEditor}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
              <span>Rich editor</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-colors">
              <div
                ref={containerRef}
                className="bg-gray-50 transition-colors"
              />
            </div>

            <div className="flex justify-between items-center space-x-3 mt-3">
              {/* Title banner */}
              <div className="flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Use H1 to indicate your title
                </span>
              </div>
              <div className="flex justify-end shrink-0 self-end gap-5 md:gap-8">
                <button
                  onClick={handleCancel}
                  type="button"
                  className="px-4 py-2 border border-gray-200 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {cancelButtonText}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  type="button"
                  className={`px-4 py-2 rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : submitButtonText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Same CSS styling as before */}
        <style>{`
        .transforming-editor-container .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: rgb(209, 213, 219);
          background-color: rgb(249, 250, 251);
          padding: 0.75rem;
        }

        .dark .transforming-editor-container .ql-toolbar {
          border-color: rgb(75, 85, 99);
          background-color: rgb(55, 65, 81);
        }

        .transforming-editor-container .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: rgb(209, 213, 219);
          min-height: 120px;
        }

        .dark .transforming-editor-container .ql-container {
          border-color: rgb(75, 85, 99);
        }

        .transforming-editor-container .ql-editor {
          min-height: 120px;
          font-size: 1rem;
          color: rgb(17, 24, 39);
        }

        .dark .transforming-editor-container .ql-editor {
          color: rgb(229, 231, 235);
        }

        /* Rest of CSS styles */

        /* Add these new styles for images */
        .transforming-editor-container .ql-editor img {
          max-width: 100%;
          height: auto;
          object-fit: cover;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        /* Style for centered images */
        .transforming-editor-container .ql-editor p.ql-align-center img {
          margin-left: auto;
          margin-right: auto;
          display: block;
        }

        /* Add hover effect */
        .transforming-editor-container .ql-editor img:hover {
          transform: scale(1.02);
          transition: transform 0.2s ease;
        }

        /* Style for code blocks */
        .transforming-editor-container .ql-editor pre.ql-syntax {
          background-color: #f1f5f9;
          color: #334155;
          overflow-x: auto;
          padding: 1rem;
          border-radius: 0.375rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          border: 1px solid #e2e8f0;
          margin: 1rem 0;
        }

        /* Dark mode for code blocks */
        {/* .dark .transforming-editor-container .ql-editor pre.ql-syntax {
          background-color: #1e293b;
          color: #e2e8f0;
          border-color: #334155;
        } */}

        /* Inline code style */
        .transforming-editor-container .ql-editor code {
          background-color: #f1f5f9;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          color: #0f172a;
        }

        /* Dark mode for inline code */
        .dark .transforming-editor-container .ql-editor code {
          background-color: #334155;
          color: #e2e8f0;
        }


        /* custom style for file button */
        
        /* Or if you want to use a custom SVG icon */
        .ql-snow .ql-toolbar button.ql-file svg {
          width: 15px;
          height: 15px;
        }

        .ql-snow .ql-toolbar button.ql-file:hover svg {
          stroke: #06c;
        }
      `}</style>
      </div>
    );
  }
);

Editor.displayName = "Editor";
export default Editor;
