"use strict";
import { useLoaderData, useParams, type LoaderFunction, type LoaderFunctionArgs } from "react-router";
import { use, useEffect, useState } from "react";

import "./ProjectRoute.css";
import logo from "../../assets/user.png"
import Navbar from "~/components/Navbar/Navbar";

import FileService, { type Folder } from "~/models/FileService";

import { Folder as FolderIcon, File } from "lucide-react";
import FileBrowser from "~/components/FileBrowser/FileBrowser";
import FileViewer from "~/components/FileViewer/FileViewer";

export interface Content {
    hash: string;
    content: string;
    type: string;
    mode: string | null;
};

export interface ContentWrapper {
    describe: Content[];
    tree: Content[];
    blob: Content[];
};

export interface GenericResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

export async function clientLoader({ params, request}: LoaderFunctionArgs) {
    const { username, projectName, chapter } = params;
    return FileService.retriveProject(username!, projectName!, chapter!, request.signal);
}

export default function ProjectRoute() {
    const username = useParams().username!;
    const projectName = useParams().projectName!;
    const chapter = useParams().chapter!;
    
    const files: ContentWrapper = useLoaderData<typeof clientLoader>();
    const sanitizedFiles = FileService.retriveFileStructure(files, "null");

    const readme = sanitizedFiles.files.find((file) => file.name === "README.md");
    const [selectedHash, setSelectedHash] = useState<string | null>(readme?.hash ?? null);
    const selectedFileName = sanitizedFiles.files.find((file) => file.hash === selectedHash)?.name;
    const currentDescribe = files.describe[0].hash;

    return (
        <>
            <Navbar/>
            <div className="Project-Wrapper">

                <div className="Project-header">
                <div className="Project-header-logo">
                        <img src={logo} alt="logo" />
                </div>

                    <span className="Project-header-text">
                        <a href="/home">{username.charAt(0).toUpperCase() + username.substring(1) }</a>
                        /
                        <a href="/auth">{projectName.charAt(0).toUpperCase() + projectName.substring(1)}</a>
                    </span>
                </div>

                <div className="three-split-layout">

                    {selectedHash == null ? (
                        <div className="project-viewer file-not-found">
                            <p>
                                Select a file to view it here.
                                    <br/>
                                    no README.md file found

                            </p>
                        </div>
                    ) : (
                        <FileViewer blobs={files.blob} hash={selectedHash} fileName={selectedFileName ?? ""}/>
                    )}


                    <FileBrowser root={sanitizedFiles} chapter={chapter} describeHash={currentDescribe} onSelectFile={setSelectedHash} describeCount={files.describe.length}/>

                    <div className="project-settings">
                        <div className="project-settings-chapter">

                        </div>

                        <div className="project-settings-actions">
                            <button className="project-settings-action-btn download">Download</button>
                            <button className="project-settings-action-btn">Upload requests (3)</button>
                            <button className="project-settings-action-btn">Actions</button>
                            <button className="project-settings-action-btn">Action configs</button>
                            <button className="project-settings-action-btn">Contributors</button>
                            <button className="project-settings-action-btn">Project Settings</button>
                        </div>

                    </div>

                </div>



            </div>
        </>
    )

}