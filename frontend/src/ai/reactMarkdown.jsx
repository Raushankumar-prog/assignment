import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/tomorrow-night-bright.css";


const Code = ({ inline, className, children, ...props }) => {



  if (inline) {
    return (
      <code className="bg-gray-800 text-green-400 px-1 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4 w-full max-w-[66vw]">
      <div className="absolute top-2 right-6 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
       
       
      </div>
      <span className="overflow-x-auto p-4 rounded-lg bg-gray-950 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
        <code className={`${className} block whitespace-pre min-w-fit`} {...props}>
          {children}
        </code>
      </span>
    </div>
  );
};

const components = {
  code: Code,
};

function UsingReactMarkdown({ markdown }) {
  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export default UsingReactMarkdown;
