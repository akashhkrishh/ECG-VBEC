"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../ui/button";
import { ImagesIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { setPredict, setPreview, uploadFile } from "@/redux/slices/dataSlice";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RootState } from "@/redux/store";

type DataEntry = {
    id: string;    // Index or key of the signal (e.g., "0", "1", etc.)
    value: string; // ECG signal value
};

const ResultPage = () => {
    const dispatch = useDispatch();
    const { preview, result, prepossed_lead_13, lead_13, predict, contour_lead, image_data, prepossed_lead, lead, gray_image, ecg_1dsignal, ecg_final, loading } = useSelector((state: RootState) => state.data);

    const [message, setMessage] = useState<string | null>(null);

    const dataEntry = ecg_1dsignal && JSON.parse(ecg_1dsignal)[0];
    const final_dataEntry = ecg_final && JSON.parse(ecg_final)[0];

    // Convert the ecg_1dsignal object to an array of DataEntry objects
    const dataEntries: DataEntry[] = dataEntry && Object.entries(dataEntry || {}).map(([key, value]) => ({
        id: key,
        value: value,
    }));
    const final_dataEntries: DataEntry[] = final_dataEntry && Object.entries(final_dataEntry || {}).map(([key, value]) => ({
        id: key,
        value: value,
    }));

    // Cleanup the preview URL when the component unmounts
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);
    if (!final_dataEntry) {

        return "null";
    }
    return (
        <main className="w-full h-full flex flex-row-reverse items-start justify-between gap-4 p-4 lg:px-20 lg:py-10">
            <section className="w-3/12 flex flex-col items-center overflow-hidden">
                <div className="border rounded-md w-full overflow-hidden">
                    {predict && <h1 className="text-md p-1.5 px-4 font-medium bg-blue-900 text-[#FFF6E9] w-full">{"Your ECG Report"}</h1>}
                    {/* Image Preview */}
                    {preview && (
                        <div className="aspect-[7/5] w-full relative">
                            <Image className="object-contain" src={preview} alt="Uploaded Image" fill />
                        </div>
                    )}
                </div>

                {/* Prediction Result */}
                {predict && (
                    <div className="text-md text-cnter p-4 flex flex-col gap-4 border-blue-900 border-opacity-40 border w-full mt-4 rounded-md text-green-400">
                        <h1><span className="text-white">Filename : </span>{image_data}</h1>
                        <h1><span className="text-white">Result : </span>{predict}</h1>
                    </div>
                )}
                <Button onClick={()=>{dispatch(setPreview(null));dispatch(setPredict(null))}} className="mt-4 w-full">Back to Upload</Button>
            </section>

            <section className="flex-1 w-8/12 h-full border-r px-4 flex flex-col gap-4">
                <div className="w-full flex gap-4">
                    <div className="w-1/3 rounded-md overflow-hidden flex flex-col">
                        <h1 className="text-md p-1.5 px-4 font-medium bg-blue-900 text-[#FFF6E9] w-full">{"Gray Scale Image"}</h1>
                        <div className="w-full aspect-[7/5]">
                            <img
                                src={`http://localhost:5000/processed_image/${gray_image}`}
                                alt={`Processed Image`}
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    <div className="w-1/3 rounded-md overflow-hidden flex flex-col">
                        <h1 className="text-md p-1.5 px-4 font-medium bg-blue-900 text-[#FFF6E9] w-full">{"Dividing Lead"}</h1>
                        <ScrollArea className="w-full aspect-[7/5]">
                            <img
                                src={`http://localhost:5000/processed_image/${lead}`}
                                alt={`Processed Image`}
                                className="w-full h-full"
                            />
                            <img
                                src={`http://localhost:5000/processed_image/${lead_13}`}
                                alt={`Processed Image`}
                                className="w-full h-full"
                            />
                        </ScrollArea>
                    </div>

                    <div className="w-1/3 rounded-md overflow-hidden bg-slate-700 flex flex-col">
                        <h1 className="text-md p-1.5 px-4 font-medium bg-blue-900 text-[#FFF6E9] w-full">{"Prepossed Lead"}</h1>
                        <ScrollArea className="w-full aspect-[7/5]">
                            <img
                                src={`http://localhost:5000/processed_image/${prepossed_lead}`}
                                alt={`Processed Image`}
                                className="w-full h-full"
                            />
                            <img
                                src={`http://localhost:5000/processed_image/${prepossed_lead_13}`}
                                alt={`Processed Image`}
                                className="w-full h-full"
                            />
                        </ScrollArea>
                    </div>
                </div>

                <div className="w-full flex gap-4">
                    <div className="w-1/3 h-full flex-1 rounded-md overflow-hidden flex flex-col">
                        <h1 className="text-md p-1.5 px-4 font-medium bg-blue-900 text-[#FFF6E9] w-full">{"Extracting Scale"}</h1>
                        <ScrollArea className="w-full   rounded-b-md">
                            <img
                                src={`http://localhost:5000/processed_image/${contour_lead}`}
                                alt={`Processed Image`}
                                className="w-full h-full"
                            />
                        </ScrollArea>
                    </div>

                    <div className="w-2/3 rounded-md overflow-hidden gap-4 flex flex-col">
                        {/* 1D Signal Table */}
                        <div className="flex-1 flex flex-col rounded-xl">
                            <h1 className="text-md p-1.5 px-4 font-medium bg-blue-900 text-[#FFF6E9] w-full">
                                {"Convert into 1D Signal"}
                            </h1>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr>
                                            {dataEntries?.map((_, index) => (
                                                <th
                                                    key={index}
                                                    className="text-right border border-gray-300 p-2  "
                                                >
                                                    {index}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {dataEntries?.map((entry, index) => (
                                                <td
                                                    key={index}
                                                    className="text-right border border-gray-300 p-2"
                                                >
                                                    {entry.value}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Dimensionality Reduction Table */}
                        <div className="flex-1 flex flex-col  rounded-xl">
                            <h1 className="text-md p-1.5 px-4 rounded-t-md font-medium bg-blue-900 text-[#FFF6E9] w-full">
                                {"Perform Dimensionality Reduction"}
                            </h1>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr>
                                            {final_dataEntries?.map((_, index) => (
                                                <th
                                                    key={index}
                                                    className="text-right border border-gray-300 p-2  "
                                                >
                                                    {index}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {final_dataEntries?.map((entry, index) => (
                                                <td
                                                    key={index}
                                                    className="text-right border border-gray-300 p-2"
                                                >
                                                    {entry.value}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
};

export default ResultPage;
