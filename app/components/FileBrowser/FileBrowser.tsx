"use strict";
import { useState } from "react";
import { Folder as FolderIcon, File, GitCommitVertical} from "lucide-react";
import type { Folder } from "~/models/FileService";

function findFolder(folder: Folder, path: string): Folder | undefined {
    if (folder.path === path) return folder;
    for (const dir of folder.subDirs) {
        const found = findFolder(dir, path);
        if (found) return found;
    }
    return undefined;
}

const baseName = (path: string) => path.split("/").filter(Boolean).pop() ?? "";

interface RowProps {
    icon: React.ReactNode;
    name: string;
    message?: string;
    hash?: string;
    onClick?: () => void;
}

function Row({ icon, name, message, hash, onClick }: RowProps) {
    return (
        <div className="project-files-item">
            <div className="item-header">
                {icon}
                <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }}>
                    {name}
                </a>
            </div>
            <p>{message?.substring(0, 10)}</p>
            <p>{hash && `${hash.substring(0, 6)}...`}</p>
        </div>
    );
}

interface FileBrowserProps {
    root: Folder;
    chapter: string;
    describeHash: string;
    onSelectFile: (hash: string) => void;
    describeCount: number;
}

export default function FileBrowser({ root, chapter, describeHash, onSelectFile, describeCount }: FileBrowserProps) {
    const [stack, setStack] = useState<string[]>([root.path]);
    const currentPath = stack[stack.length - 1];
    const current = findFolder(root, currentPath) ?? root;

    const enter = (path: string) => setStack((s) => [...s, path]);
    const back = () => setStack((s) => s.slice(0, -1));

    return (
        <div className="project-files">
            <div className="project-files-header">
                <h1>Chapter: {chapter}</h1>
                <h1>{describeHash.substring(0, 12)}...</h1>
                <h1><GitCommitVertical className="project-files-header-icon" size={30}/>{describeCount} describes</h1>
            </div>

            <div className="project-files-content">
                {stack.length > 1 && (
                    <Row icon={<FolderIcon size={30}/>} name="..." onClick={back}/>
                )}

                {current.subDirs.map((dir) => (
                    <Row
                        key={dir.path}
                        icon={<FolderIcon size={30} />}
                        name={baseName(dir.path)}
                        message={dir.files[0]?.describeMsg}
                        hash={dir.files[0]?.hash}
                        onClick={() => enter(dir.path)}
                    />
                ))}

                {current.files.map((file) => (
                    <Row
                        key={file.hash + file.name}
                        icon={<File size={30} />}
                        name={file.name}
                        message={file.describeMsg}
                        hash={file.hash}
                        onClick={() => onSelectFile(file.hash)}
                    />
                ))}
            </div>
        </div>
    );
}