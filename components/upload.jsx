"use client";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Upload({ type, onUpload, value }) {
  const inputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  
  const preview = localPreview || value || null;

  const uploadFile = async (file) => {
    setUploading(true)
    setError("")

    try {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ]

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Please select a JPG, PNG, WEBP, or GIF image.")
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must not exceed 5 MB.")

      }

      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          type,
        }),
      });

      const responseBody = await res.json()

      if (!res.ok || !responseBody.path || !responseBody.token) {
        throw new Error(responseBody.error || "Failed to get upload permission.")
      }

      const {path, token} = responseBody

      const { error: uploadError } = await supabase.storage
        .from("file_upload")
        .uploadToSignedUrl(path, token, file, {
          contentType: file.type,
          cacheControl: "3600",
        })
      
      if (uploadError) throw uploadError
      

      const { data } = supabase.storage.from("file_upload").getPublicUrl(path)

     await onUpload?.(data.publicUrl, type)

    } catch (err) {
      console.error("Upload failed:", err)
      setError(err.message || "Failed to upload image.")
    } finally {
      setUploading(false)
    }
  }

  const handleUpload = async (file) => {
    if (!file || uploading) return;

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    try {
      await uploadFile(file);
    } finally {
      URL.revokeObjectURL(previewUrl)
      setLocalPreview(null)
    }
  };

  return (
    <div
      className=" relative w-full h-full flex items-center justify-center cursor-pointer"
      onClick={() => !uploading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          handleUpload(file);
          e.target.value = ""
        }}
      />
      {preview ? (
        <img src={preview} alt="" className="w-full h-full object-cover " />
      ) : (
        <span className="text-3xl text-gray-400">+</span>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">Uploading...</div>
      )}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-700 p-2 text-sm">{error}</div>
      )}
    </div>
  );
}
