"use strict";

import type { Content } from "~/routes/project/ProjectRoute";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown-dark.css";

import "./FileViewer.css";
import rehypeRaw from "rehype-raw";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FileViewerProps {
    blobs: Content[];
    hash: string | null;
    fileName: string;
};


export default function FileViewer({ blobs, hash, fileName} : FileViewerProps) {
    const blob = hash ? blobs.find((b) => b.hash === hash) : undefined;
    if (!blob) {
        return <div className="project-viewer" />;
    }

    const isMarkdown = fileName ? fileName.toLowerCase().endsWith(".md") : false;
    
    return (
        <div className="project-viewer">
            {isMarkdown ? (
                /* Apply the markdown-body class here */
                <article className="markdown-body" style={{ padding: "32px", borderRadius: "6px" }}>
                    <Markdown 
                        remarkPlugins={[remarkGfm]} 
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    >
                        {blob.content}
                    </Markdown>
                </article>
            ) : (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    showLineNumbers={true}
                    customStyle={{
                        margin: 0,
                        padding: "16px",
                        height: "100%",
                        backgroundColor: "#222430",
                        fontSize: "0.9rem",
                    }}
                >
                {blob.content}
                </SyntaxHighlighter>
            )}
        </div>
    );
}