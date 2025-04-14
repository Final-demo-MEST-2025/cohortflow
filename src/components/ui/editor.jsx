'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../../quill-editor.css';

// interface QuillEditorProps {
//   initialValue?: string;
//   onChange?: (content: string) => void;
//   placeholder?: string;
//   className?: string;
// }

// export interface QuillEditorRef {
//   getContent: () => string;
//   setContent: (content: string) => void;
// }

export const QuillEditor = forwardRef(
  ({ initialValue = '', onChange, placeholder = '', className = '' }, ref) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);

    // Initialize Quill
    useEffect(() => {
      if (!editorRef.current) return;

      const toolbarOptions = [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean']
      ];

      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: toolbarOptions,
          clipboard: {
            matchVisual: false,
          },
        },
      });

      quillInstance.current.on('text-change', () => {
        const content = quillInstance.current?.root.innerHTML || '';
        onChange?.(content);
      });

      quillInstance.current.root.innerHTML = initialValue;

      return () => {
        if (quillInstance.current) {
          quillInstance.current.off('text-change');
        }
      };
    }, []);

    // Expose editor methods via ref
    useImperativeHandle(ref, () => ({
      getContent: () => quillInstance.current?.root.innerHTML || '',
      setContent: (content) => {
        if (quillInstance.current) {
          quillInstance.current.root.innerHTML = content;
        }
      },
    }));

    return (
      <div className={`quill-editor-container ${className}`}>
        <div ref={editorRef} className="h-[200px]" />
      </div>
    );
  }
);

QuillEditor.displayName = 'QuillEditor';