import axios, { AxiosProgressEvent } from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
    const [downloads, setDownloads] = useState<({ id: string; fileName: string } & AxiosProgressEvent)[]>([]);
    const [lists, setLists] = useState<{ server_filename: string; path: string; size: number }[]>([]);

    useEffect(() => {
        const socket = io("https://3000-ozan68255-untitled-9w9wkjq6ptc.ws-us110.gitpod.io");
        fetchList();
        socket.on("message", (data: { id: string; fileName: string } & AxiosProgressEvent) => {
            setDownloads((prevDownloads) => {
                return prevDownloads.filter((item) => item.id !== data.id).concat(data);
            });
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchList = async () => {
        try {
            const res = await axios("/api/terabox");
            setLists(res.data.list);
        } catch (error) {
            alert("error");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50">
            <div className="container mx-auto flex flex-col">
                <p className="text-lg font-bold">Status</p>
                <div className="mt-2 rounded-md bg-zinc-800 p-4">
                    <table className="w-full table-auto text-left">
                        <thead>
                            <tr>
                                <th className="h-10 border-b px-2">NO.</th>
                                <th className="h-10 border-b px-2">NAME</th>
                                <th className="h-10 border-b px-2">TYPE</th>
                                <th className="h-10 border-b px-2">PROGRESS</th>
                                <th className="h-10 border-b px-2"></th>
                                <th className="h-10 border-b px-2">SIZE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {downloads.map((v, i) => {
                                return (
                                    <tr key={i}>
                                        <th className="h-10 border-b px-2">{i + 1}.</th>
                                        <td className="h-10 border-b px-2">{v.fileName}</td>
                                        <td className="h-10 border-b px-2">{v.download ? "DOWNLOAD" : "UPLOAD"}</td>
                                        <td className="h-10 border-b px-2">
                                            <div className={`h-6 ${v.download ? "bg-red-400" : "bg-green-400"}`} style={{ width: (v.progress ? v.progress * 100 : 0) + "%" }}></div>
                                        </td>
                                        <td className="h-10 border-b px-2">{v.progress ? v.progress * 100 : 0} %</td>
                                        <td className="h-10 border-b px-2">{v.total ? (v.total / 1024 / 1024).toFixed(2) : "Null"} MB</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <p className="mt-2 text-lg font-bold">Files</p>
                <div className="mt-2 rounded-md bg-zinc-800 p-4">
                    <table className="w-full table-auto text-left">
                        <thead>
                            <tr>
                                <th className="h-10 border-b px-2">NO.</th>
                                <th className="h-10 border-b px-2">NAME</th>
                                <th className="h-10 border-b px-2">SIZE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lists.map((v, i) => {
                                return (
                                    <tr key={i}>
                                        <th className="h-10 border-b px-2">{i + 1}.</th>
                                        <td className="h-10 border-b px-2">{v.server_filename}</td>
                                        <td className="h-10 border-b px-2">{(v.size / 1024 / 1024).toFixed(2)} MB</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
