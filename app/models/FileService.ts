"use strict";
import { Folder, TagPlus } from "lucide-react";
import type { Content, ContentWrapper, GenericResponse } from "~/routes/project/ProjectRoute";

export interface Folder {
    path: string;
    files: Files[];
    subDirs: Folder[];
}

export interface Files {
    mode: string;
    name: string;
    hash: string;
    isDir: boolean;
    describeMsg: string;
}

interface parsedDescribe {
    treeHash: string;
    describeHash: string;
    parentHash?: string;
    describeMsg: string;
}

const FileService = {
    async retriveProject(
        username: string,
        projectName: string,
        chapter: string,
        signal?: AbortSignal
    ): Promise<ContentWrapper> {
        const res = await fetch(`http://localhost:8080/proj/${username}/${projectName}/${chapter}`,{ signal });
        const body: GenericResponse<ContentWrapper> = await res.json();

        if (!body.success) throw new Error(body.message);

        return body.data;
    },

    parseDescribe(content: string, describeHash: string): parsedDescribe {
        const splitContent: string[] = content.split("\n");

        const message: string| undefined = splitContent
            .find((line) => line.startsWith("message "))
            ?.substring("message ".length);

        const parentHash: string|undefined = splitContent
            .find((line) => line.startsWith("parent "))
            ?.substring("parent ".length);

        const treeHash: string|undefined = splitContent
            .find((line) => line.startsWith("tree "))
            ?.substring("tree ".length);

        if (!treeHash) {
            throw Error("Could not find describe tree");
        }

        if (!message) {
            throw Error("Describe is malformed");
        }

        return {
            treeHash: treeHash,
            describeHash: describeHash,
            parentHash: parentHash,
            describeMsg: message
        };
    },

    /**
     * Always overwrite entrys.
     * @param desc 
     * @param files 
     */
    parseTree(treeHash: string, files: ContentWrapper, root: Folder, descMsg: string): Folder {
        const tree: Content|undefined = files.tree.find((entry) => entry.hash === treeHash);
        if (!tree) return root;


        for (const line of tree.content.split("\n")) {
            if (!line.trim()) continue;
            const first = line.indexOf(" ");
            const last = line.lastIndexOf(" ");


            const mode = line.substring(0, first);
            const name = line.substring(first + 1, last);
            const hash = line.substring(last + 1);


            if (mode === "040000") {
                let directory = root.subDirs.find((dir) => dir.path === `${root.path}${name}/`);

                if (!directory) {
                    directory = {path: `${root.path}${name}/`, files: [], subDirs: []};
                    root.subDirs.push(directory);
                }
                this.parseTree(hash, files, directory, descMsg);
            } else if (!root.files.some((file) => file.name === name)) {
                root.files.push({ mode, name, hash, isDir: false, describeMsg: descMsg });
            }
        }

        return root;
    },

    retriveFileStructure(files: ContentWrapper, chapterHash: string|null) : Folder {
        let latest_describe: Content|null = null;

        if (chapterHash) {
            for (const desc of files.describe) {
                if (desc.hash === chapterHash) {
                    latest_describe = desc;
                    break;
                }
            }
            if (!latest_describe) latest_describe = files.describe[0];
        } else {
            latest_describe = files.describe[0];
        }

        const chain: parsedDescribe[] = [];
        let describe: Content | undefined = latest_describe;

        while(describe) {
            const info = this.parseDescribe(describe.content, describe.hash);
            chain.push(info);
            describe = files.describe.find((d) => d.hash === info.parentHash);
        }
        
        let root: Folder = { path: "", files: [], subDirs: [] };
        
        for (const info of chain) {
            root = this.parseTree(info.treeHash, files, root, info.describeMsg);
        }
        return root;
    }
};

export default FileService;