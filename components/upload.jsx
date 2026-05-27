"use client";
import { useRef, useState } from "react";

export default function Upload({ type, onUpload, value }) {
  const inputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);
  const toPreviewUrl = (input) => {
    if (!input) return null;
    if (
      input.startsWith("http://") ||
      input.startsWith("https://") ||
      input.startsWith("blob:") ||
      input.startsWith("data:")
    ) {
      return input;
    }

    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, "");
    return base ? `${base}/${input.replace(/^\/+/, "")}` : input;
  };

  const preview = localPreview || toPreviewUrl(value);

  const uploadFile = async (file) => {
    // 1. Ask backend for signed URL
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    const responseBody = await res.json();
    const { url, key } = responseBody;
    if (!res.ok || !url || !key) {
      throw new Error(responseBody?.error || "Failed to get upload URL");
    }

    // 2. Upload directly to R2
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    if (!uploadRes.ok) {
      throw new Error("Failed to upload image");
    }

    console.log("Uploaded to:", key);
    onUpload?.(key, type);
  };
  const handleUpload = async (file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    try {
      await uploadFile(file);
      setLocalPreview(null);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div
      className="bg-white h-full flex items-center justify-center cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          handleUpload(file);
        }}
      />
      {preview ? (
        <img src={preview} alt="" className="w-full h-full object-cover bg-amber-500" />
      ) : (
        <span className="text-3xl text-gray-400">+</span>
      )}
    </div>
  );
}
