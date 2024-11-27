"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { ImagesIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { setImageData, setLoading, setPreview, uploadFile } from "@/redux/slices/dataSlice";

const UploadImage = () => {
  const [file, setFile] = useState<File | null>(null);
  
  const fileRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { loading, preview } = useSelector((state: RootState) => state.data);
  
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];

      if (!(uploadedFile.size <= 1597837)) {
        alert("Maximum file size is 1.5 MB");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/png", "image/jpeg"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        alert("Only PNG and JPG files are allowed.");
        return;
      }

      setFile(uploadedFile);
      // console.log();
      dispatch(setImageData(e.target.files[0].name))
      dispatch(setPreview(URL.createObjectURL(uploadedFile))); // Create a URL for the uploaded file
    }
  };

  const handleFocus = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    dispatch(uploadFile(file));

    dispatch(setLoading(true));
    
  };
  
  // Cleanup the preview URL when the component unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <main className="w-full h-full flex items-center justify-center flex-col gap-4">
      <input
        ref={fileRef}
        onChange={handleFileChange}
        type="file"
        accept="image/png, image/jpeg"
        hidden
      />
      <h1 className="text-xl max-w-[500px] text-center">
        ECG Image Analysis for Cardiovascular Disease Detection Using a Voting-Based Ensemble Classifier
      </h1>
      <section className="w-[550px] aspect-[7/5] overflow-hidden cursor-pointer rounded-xl">
      {preview ? (
  <div className="w-[550px] relative aspect-[7/5] text-accent h-full flex items-center rounded-xl justify-center flex-col">
    <div
      onClick={handleFocus}
      className="flex gap-2 w-[500px] absolute rounded-xl items-center justify-center aspect-[7/5] overflow-hidden border-2 "
    >
      <Image
        className="object-contain"
        src={preview}
        alt="Uploaded Image"
        fill
      />
    </div>
    <Button
      size={"sm"}
      onClick={() => {
        dispatch(setPreview(null));
        setFile(null);
      }}
      className="absolute top-1 rounded-full right-2 text-md text-white bg-red-500 hover:bg-red-600"
    >
      x
    </Button>
  </div>
) : (
  <div
    onClick={handleFocus}
    className="w-[550px] aspect-[7/5] text-accent h-full flex items-center rounded-xl justify-center flex-col"
  >
    <div className="flex gap-2 w-[500px] rounded-xl items-center justify-center aspect-[7/5] border-2">
      <ImagesIcon />
      <h1>Upload ECG Report</h1>
    </div>
  </div>
)}

      </section>
      <Button disabled={!file} onClick={handleUpload}>
        {loading ? <div className="flex gap-2 items-center justify-center"><Loader2 className="animate-spin"/> Predicting...</div> : "Predict"}
      </Button>
      {message && <p>{message}</p>}
    </main>
  );
};

export default UploadImage;
