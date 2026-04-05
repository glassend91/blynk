"use client";

import { useState, useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter content...",
  disabled = false,
}: RichTextEditorProps) {
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Try to dynamically load react-quill
    // Note: This will fail at build time if package is not installed
    // Install with: npm install react-quill@^1.3.7
    const loadQuill = async () => {
      try {
        // Dynamic import - webpack will create a chunk for this
        // If the package doesn't exist, this will fail gracefully at runtime
        const module = await import(
          /* webpackChunkName: "react-quill" */ "react-quill"
        );
        setReactQuill(() => module.default);
        setIsLoading(false);

        // Load CSS from CDN
        if (!document.querySelector('link[href*="quill.snow.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://cdn.quilljs.com/1.3.7/quill.snow.css";
          document.head.appendChild(link);
        }
      } catch (error) {
        // Package not available - use textarea fallback
        console.warn("react-quill not available, using textarea fallback");
        setIsLoading(false);
      }
    };

    loadQuill();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-[300px] border border-[#DFDBE3] rounded-[10px] bg-white flex items-center justify-center text-[#6F6C90]">
        Loading editor...
      </div>
    );
  }

  // Fallback to enhanced textarea if ReactQuill is not available
  if (!ReactQuill) {
    return (
      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={12}
          className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors resize-y min-h-[300px] bg-white"
        />
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-[8px]">
          <p className="text-[12px] text-amber-800 font-medium mb-1">
            Rich Text Editor Not Available
          </p>
          <p className="text-[11px] text-amber-700 mb-2">
            To enable rich text editing, install the react-quill package:
          </p>
          <code className="block text-[11px] text-amber-900 bg-amber-100 px-2 py-1 rounded font-mono">
            npm install react-quill@^1.3.7
          </code>
          <p className="mt-2 text-[11px] text-amber-600">
            Currently using basic textarea. HTML content is supported.
          </p>
        </div>
      </div>
    );
  }

  // Rich text editor is available
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "color",
    "background",
    "align",
  ];

  const QuillEditor = ReactQuill;

  return (
    <div className="rich-text-editor">
      <QuillEditor
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        className="bg-white"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-size: 14px;
          min-height: 300px;
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-color: #dfdbe3;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          border-color: #dfdbe3;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #a39fb8;
          font-style: normal;
        }
        .rich-text-editor .ql-editor {
          color: #0a0a0a;
        }
      `}</style>
    </div>
  );
}
