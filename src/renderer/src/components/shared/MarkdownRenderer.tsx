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
      .replace(/<\/think>/g, "</pre>");
  }, [markdown]);

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (!codeString || codeString === "undefined") return "";

          // count words if less than 2 words, return it as a span
          if (codeString.split(" ").length < 2) {
            return (
              <span className="inline-flex items-center italic" style={oneDark}>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || "javascript"}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "5px",
                    borderRadius: "10px",
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </span>
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
      }}
    >
      {formattedMarkdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
