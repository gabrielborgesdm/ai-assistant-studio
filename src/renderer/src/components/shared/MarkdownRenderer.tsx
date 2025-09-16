import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardCopy } from "lucide-react";
import rehypeRaw from "rehype-raw";
import { useMemo } from "react";
import { ReactElement } from "react";

const MarkdownRenderer = ({ markdown }: { markdown: string }): ReactElement => {
  const formattedMarkdown = useMemo(() => {
    return markdown
      .replace(/<think>/g, "<pre>")
      .replace(/<\/think>/g, "</pre>")
      // Fix list formatting: remove blank lines between list items
      .replace(/\n\n/g, "\n");

  }, [markdown]);

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (!codeString || codeString === "undefined") return "";

          // For inline code (not in code blocks)
          if (!match) {
            return (
              <code className="px-1.5 py-0.5 mx-0.5 bg-zinc-800 rounded text-sm font-mono">
                {codeString}
              </code>
            );
          }

          return (
            <div className="relative my-4 rounded-2xl overflow-hidden shadow bg-zinc-900 text-sm group">
              <button
                onClick={() => navigator.clipboard.writeText(codeString)}
                className="absolute top-2 right-2 text-zinc-400 hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy code"
              >
                <ClipboardCopy size={16} />
              </button>
              <SyntaxHighlighter
                style={oneDark}
                language={match?.[1] || "javascript"}
                PreTag="div"
                customStyle={{ margin: 0, padding: "1rem" }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          );
        },
        pre({ children }) {
          return (
            <div className="italic text-muted-foreground text-sm">
              {children}
            </div>
          );
        },
        // Headings
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-medium">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-base font-medium">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-sm font-medium">{children}</h6>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="leading-relaxed">{children}</p>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside ml-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside ml-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 pl-4 italic">
            {children}
          </blockquote>
        ),
        // Horizontal rule
        hr: () => <hr className="my-6" />,
        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead>{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y ">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr>{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 text-sm">{children}</td>
        ),
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {children}
          </a>
        ),
        // Emphasis
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        // Images
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto rounded-lg my-4"
          />
        ),
      }}
    >
      {formattedMarkdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
