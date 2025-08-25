import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-java'
import 'prismjs/themes/prism-tomorrow.css'

export default function CodeHighlight({ 
  code, 
  language = 'java', 
  highlightLine = null,
  showLineNumbers = true,
  className = '',
  maxHeight = null
}) {
  const codeRef = useRef(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language])

  if (!showLineNumbers) {
    return (
      <div className={`bg-gray-900 text-gray-100 rounded-lg overflow-hidden ${className}`}>
        <div 
          className="overflow-x-auto text-sm"
          style={maxHeight ? { maxHeight, overflowY: 'auto' } : {}}
        >
          <pre className="p-4 m-0">
            <code ref={codeRef} className={`language-${language}`}>
              {code.trim()}
            </code>
          </pre>
        </div>
      </div>
    )
  }

  const codeLines = code.trim().split('\n')

  return (
    <div className={`bg-gray-900 text-gray-100 rounded-lg overflow-hidden ${className}`}>
      <div 
        className="overflow-x-auto text-sm"
        style={maxHeight ? { maxHeight, overflowY: 'auto' } : {}}
      >
        <pre className="p-4 m-0">
          <code className={`language-${language}`}>
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`${
                  highlightLine === index + 1
                    ? 'bg-blue-600 bg-opacity-30 border-l-2 border-blue-400'
                    : ''
                } px-2 py-1 transition-colors duration-200 flex`}
              >
                <span className="text-gray-500 text-xs mr-3 select-none min-w-[2rem]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-mono" dangerouslySetInnerHTML={{
                  __html: Prism.highlight(line, Prism.languages[language] || Prism.languages.java, language)
                }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}