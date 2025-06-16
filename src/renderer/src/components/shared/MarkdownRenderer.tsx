import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ClipboardCopy } from 'lucide-react'

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeString = String(children).replace(/\n$/, '')

          return !inline ? (
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
                language={match?.[1] || 'javascript'}
                PreTag="div"
                customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-zinc-200 text-zinc-800 px-1 rounded">{children}</code>
          )
        }
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
