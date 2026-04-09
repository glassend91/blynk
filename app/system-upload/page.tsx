"use client";

import React, { useRef } from "react";

export default function SystemUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload-file", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert(`Success! File uploaded to: ${data.url}`);
        } else {
          alert(`Error: ${data.error || "Upload failed."}`);
        }
      } catch (err: any) {
        alert(`Network Error: ${err.message || "Failed to connect."}`);
      } finally {
        // Reset the input so the same file could be selected again if needed
        e.target.value = "";
      }
    }
  };

  return (
    <div 
      className="w-screen h-screen bg-white cursor-default" 
      onClick={handlePageClick}
      title="Click anywhere to upload a file"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
