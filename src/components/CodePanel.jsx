import { useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import Prism from 'prismjs'
import 'prismjs/components/prism-java'
import 'prismjs/themes/prism-tomorrow.css'

export default function CodePanel({ algorithm }) {
  const { state } = useApp()
  const [highlightedLine, setHighlightedLine] = useState(null)

  useEffect(() => {
    Prism.highlightAll()
  }, [algorithm])

  useEffect(() => {
    if (state.visualizationData[state.currentStep]) {
      setHighlightedLine(state.visualizationData[state.currentStep].codeLine)
    }
  }, [state.currentStep, state.visualizationData])

  const codeExample = algorithm?.code || `
public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}
  `.trim()

  const codeLines = codeExample.split('\n')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Java Implementation</h3>
        <div className="flex space-x-2">
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            📋 Copy
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            🔍 Zoom
          </button>
        </div>
      </div>

      <div className="relative">
        <pre className="code-panel overflow-x-auto text-sm">
          <code className="language-java">
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`${
                  highlightedLine === index + 1
                    ? 'bg-yellow-200 bg-opacity-20 border-l-2 border-yellow-400'
                    : ''
                } px-2 py-1 transition-colors duration-200`}
                style={{ minHeight: '1.5rem' }}
              >
                <span className="text-gray-500 text-xs mr-3 select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {line}
              </div>
            ))}
          </code>
        </pre>

        {/* Execution indicator */}
        {highlightedLine && (
          <div className="absolute right-2 top-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Line {highlightedLine}
          </div>
        )}
      </div>

      {/* Code explanation */}
      {algorithm?.explanation && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Explanation:</span> {algorithm.explanation}
          </p>
        </div>
      )}
    </div>
  )
}