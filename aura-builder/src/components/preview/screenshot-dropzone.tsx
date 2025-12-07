"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { usePromptBuilderStore } from "@/store/prompt-builder";

export function ScreenshotDropzone() {
  const { referenceImage, update } = usePromptBuilderStore();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (referenceImage?.previewUrl) {
        URL.revokeObjectURL(referenceImage.previewUrl);
      }
    };
  }, [referenceImage?.previewUrl]);

  const handleFiles = useCallback(
    (files?: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      update({
        referenceImage: {
          id: crypto.randomUUID(),
          name: file.name,
          previewUrl,
          file,
        },
      });
    },
    [update],
  );

  return (
    <label
      className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 text-center transition ${
        isDragging
          ? "border-indigo-400 bg-indigo-50 text-indigo-700"
          : "border-slate-300 text-slate-500 hover:border-slate-400"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
      {referenceImage ? (
        <div className="flex flex-col items-center gap-2">
          <Image
            src={referenceImage.previewUrl}
            alt={referenceImage.name}
            width={128}
            height={128}
            className="h-32 w-32 rounded-2xl object-cover"
            unoptimized
          />
          <p className="text-sm font-medium text-slate-700">{referenceImage.name}</p>
          <p className="text-xs text-slate-500">Click or drop to replace screenshot</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">📐</span>
          <p className="text-sm font-medium text-slate-700">
            Drop a hero reference screenshot
          </p>
          <p className="text-xs text-slate-500">PNG, JPG, or WebP up to 5MB</p>
        </div>
      )}
    </label>
  );
}
