import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'
import Quiz from '../Quiz'

const JAVA_COLORS = {
  generic: '#3b82f6',
  exception: '#ef4444',
  recursion: '#10b981',
  callStack: '#8b5cf6',
  try: '#059669',
  catch: '#dc2626',
  finally: '#f59e0b'
}

// Generics example
const GENERICS_EXAMPLE = {
  'ArrayList<String>': {
    type: 'String',
    operations: [
      { action: 'add', value: '"Hello"', valid: true },
      { action: 'add', value: '"World"', valid: true },
      { action: 'add', value: '123', valid: false, error: 'Type mismatch: int cannot be String' }
    ]
  },
  'ArrayList<Integer>': {
    type: 'Integer',
    operations: [
      { action: 'add', value: '42', valid: true },
      { action: 'add', value: '100', valid: true },
      { action: 'add', value: '"text"', valid: false, error: 'Type mismatch: String cannot be Integer' }
    ]
  }
}

// Exception handling example
const EXCEPTION_EXAMPLE = {
  code: `
try {
    int result = divide(10, 0);
    System.out.println("Result: " + result);
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
} finally {
    System.out.println("Cleanup code executed");
}`,
  steps: [
    { line: 2, block: 'try', description: 'Entering try block - attempting division by zero', status: 'executing' },
    { line: 2, block: 'try', description: 'ArithmeticException thrown!', status: 'exception' },
    { line: 4, block: 'catch', description: 'Exception caught - executing catch block', status: 'executing' },
    { line: 5, block: 'catch', description: 'Printing error message', status: 'executing' },
    { line: 6, block: 'finally', description: 'Executing finally block (always runs)', status: 'executing' }
  ]
}

// Recursion example - factorial
const RECURSION_EXAMPLE = {
  function: `
factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
  calls: [
    { n: 4, step: 0, depth: 0, status: 'calling', result: null },
    { n: 3, step: 1, depth: 1, status: 'calling', result: null },
    { n: 2, step: 2, depth: 2, status: 'calling', result: null },
    { n: 1, step: 3, depth: 3, status: 'base', result: 1 },
    { n: 2, step: 4, depth: 2, status: 'returning', result: 2 },
    { n: 3, step: 5, depth: 1, status: 'returning', result: 6 },
    { n: 4, step: 6, depth: 0, status: 'returning', result: 24 }
  ]
}

// Java Features Quiz Questions
const JAVA_FEATURES_QUIZ_QUESTIONS = [
  {
    type: 'multiple-choice',
    question: 'What is the primary benefit of using generics in Java?',
    options: [
      'Improved runtime performance',
      'Compile-time type safety and elimination of casting',
      'Reduced memory usage',
      'Faster compilation'
    ],
    correctAnswer: 1,
    explanation: 'Generics provide compile-time type safety, eliminate the need for explicit casting, and help catch type-related errors at compile time rather than runtime.'
  },
  {
    type: 'code-output',
    question: 'What will happen when this code is compiled?',
    code: `List<String> list = new ArrayList<>();
list.add("Hello");
list.add(123); // What happens here?`,
    options: [
      'Compiles successfully, 123 is converted to "123"',
      'Compilation error - cannot add int to List<String>',
      'Runtime exception when adding 123',
      'Compiles but throws ClassCastException later'
    ],
    correctAnswer: 1,
    explanation: 'Generics provide compile-time type checking. Adding an int to a List<String> will result in a compilation error, preventing type-related runtime errors.'
  },
  {
    type: 'multiple-choice',
    question: 'In a try-catch-finally block, when does the finally block execute?',
    options: [
      'Only when no exception occurs',
      'Only when an exception is caught',
      'Always, regardless of whether an exception occurs',
      'Only when the try block completes normally'
    ],
    correctAnswer: 2,
    explanation: 'The finally block always executes, whether an exception occurs or not. It\'s used for cleanup code that must run regardless of the execution path.'
  },
  {
    type: 'multiple-select',
    question: 'Which of the following are valid generic wildcard expressions? (Select all that apply)',
    options: [
      'List<? extends Number>',
      'List<? super Integer>',
      'List<?>',
      'List<? implements Comparable>'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Valid wildcard expressions use "extends" for upper bounds, "super" for lower bounds, and "?" for unbounded wildcards. "implements" is not valid syntax for generics.'
  },
  {
    type: 'code-output',
    question: 'What is the output of factorial(4) using the recursive implementation shown?',
    code: `public static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
    options: [
      '10',
      '16',
      '24',
      'Stack overflow error'
    ],
    correctAnswer: 2,
    explanation: 'factorial(4) = 4 * factorial(3) = 4 * 3 * factorial(2) = 4 * 3 * 2 * factorial(1) = 4 * 3 * 2 * 1 = 24'
  },
  {
    type: 'multiple-choice',
    question: 'What is type erasure in Java generics?',
    options: [
      'Removing generic types at runtime for backward compatibility',
      'A compiler optimization technique',
      'An error that occurs when using raw types',
      'A way to improve performance'
    ],
    correctAnswer: 0,
    explanation: 'Type erasure removes generic type information at runtime to maintain backward compatibility with pre-Java 5 code. This is why you cannot access generic type information at runtime.'
  },
  {
    type: 'true-false',
    question: 'A recursive method must always have a base case to prevent infinite recursion.',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'True. Every recursive method must have a base case (terminating condition) to prevent infinite recursion and stack overflow errors.'
  },
  {
    type: 'multiple-choice',
    question: 'Which statement about checked vs unchecked exceptions is correct?',
    options: [
      'Checked exceptions must be handled at compile time',
      'Unchecked exceptions must be declared in method signatures',
      'RuntimeException is a checked exception',
      'IOException is an unchecked exception'
    ],
    correctAnswer: 0,
    explanation: 'Checked exceptions (like IOException) must be either caught or declared in the method signature at compile time. Unchecked exceptions (like RuntimeException) do not have this requirement.'
  }
]

export default function JavaFeaturesVisualization() {
  const { state, setVisualizationData } = useApp()
  const [currentDemo, setCurrentDemo] = useState('generics')
  const [exceptionStep, setExceptionStep] = useState(0)
  const [recursionStep, setRecursionStep] = useState(0)
  const [genericsData, setGenericsData] = useState({ type: 'ArrayList<String>', items: [] })

  const generateVisualizationSteps = useCallback((demo) => {
    const steps = []
    
    switch (demo) {
      case 'generics':
        steps.push({
          demo: 'generics',
          step: 0,
          description: 'Generics - Type Safety in Java Collections',
          operation: 'java-demo',
          currentType: 'ArrayList<String>'
        })
        
        GENERICS_EXAMPLE['ArrayList<String>'].operations.forEach((op, index) => {
          steps.push({
            demo: 'generics',
            step: index + 1,
            description: `Attempting to ${op.action}(${op.value}) to ArrayList<String>`,
            operation: 'java-demo',
            currentOperation: op,
            valid: op.valid
          })
        })
        break
        
      case 'exceptions':
        steps.push({
          demo: 'exceptions',
          step: 0,
          description: 'Exception Handling - Try-Catch-Finally Flow',
          operation: 'java-demo'
        })
        
        EXCEPTION_EXAMPLE.steps.forEach((step, index) => {
          steps.push({
            demo: 'exceptions',
            step: index + 1,
            description: step.description,
            operation: 'java-demo',
            currentLine: step.line,
            currentBlock: step.block,
            status: step.status
          })
        })
        break
        
      case 'recursion':
        steps.push({
          demo: 'recursion',
          step: 0,
          description: 'Recursion - factorial(4) call stack visualization',
          operation: 'java-demo'
        })
        
        RECURSION_EXAMPLE.calls.forEach((call, index) => {
          steps.push({
            demo: 'recursion',
            step: index + 1,
            description: `factorial(${call.n}) - ${call.status === 'calling' ? 'making call' : call.status === 'base' ? 'base case reached' : 'returning ' + call.result}`,
            operation: 'java-demo',
            currentCall: call,
            callStack: RECURSION_EXAMPLE.calls.slice(0, index + 1).filter(c => c.step <= index && (c.status === 'calling' || c.status === 'base'))
          })
        })
        break
    }
    
    return steps
  }, [])

  const handleDemoChange = (demo) => {
    setCurrentDemo(demo)
    const steps = generateVisualizationSteps(demo)
    setVisualizationData(steps, `java-${demo}`)
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('java-')) {
      if (currentStep.demo === 'exceptions') {
        setExceptionStep(currentStep.step || 0)
      } else if (currentStep.demo === 'recursion') {
        setRecursionStep(currentStep.step || 0)
      } else if (currentStep.demo === 'generics' && currentStep.currentOperation) {
        if (currentStep.valid) {
          setGenericsData(prev => ({
            ...prev,
            items: [...prev.items, currentStep.currentOperation.value]
          }))
        }
      }
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const renderGenerics = () => {
    const currentStep = state.visualizationData[state.currentStep]
    const currentOperation = currentStep?.currentOperation

    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Generics - Compile-Time Type Safety</h3>
        
        {/* Educational Content */}
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">📚 What Are Generics?</h4>
            <p className="text-sm text-indigo-700 mb-3">
              Generics allow you to create classes, interfaces, and methods with type parameters. They provide compile-time type checking 
              and eliminate the need for explicit casting, making code more readable and less error-prone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-indigo-800">Before Generics (Java 1.4):</h5>
                <div className="bg-white p-2 rounded border font-mono text-xs">
                  List list = new ArrayList();<br/>
                  list.add("Hello");<br/>
                  String s = (String) list.get(0); // Casting required
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-indigo-800">With Generics (Java 5+):</h5>
                <div className="bg-white p-2 rounded border font-mono text-xs">
                  List&lt;String&gt; list = new ArrayList&lt;&gt;();<br/>
                  list.add("Hello");<br/>
                  String s = list.get(0); // No casting needed!
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">🔧 Generic Syntax & Terminology</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700">
              <div>
                <h5 className="font-semibold">Type Parameter:</h5>
                <code>&lt;T&gt;</code> - Placeholder for actual type
              </div>
              <div>
                <h5 className="font-semibold">Type Argument:</h5>
                <code>&lt;String&gt;</code> - Actual type provided
              </div>
              <div>
                <h5 className="font-semibold">Raw Type:</h5>
                <code>List</code> - Generic without type parameter
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Generic Type Declaration */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-blue-100 rounded-lg">
              <h4 className="font-bold text-blue-800">ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;();</h4>
              <div className="text-sm text-blue-700 mt-2">
                Generic type parameter ensures only String objects can be added
              </div>
            </div>
          </div>

          {/* Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Valid Operations */}
            <div className="space-y-3">
              <h5 className="font-semibold text-green-700">✅ Valid Operations</h5>
              {GENERICS_EXAMPLE['ArrayList<String>'].operations
                .filter(op => op.valid)
                .map((op, index) => (
                  <motion.div
                    key={index}
                    className={`p-3 bg-green-50 border border-green-200 rounded ${
                      currentOperation === op ? 'ring-2 ring-green-500' : ''
                    }`}
                    animate={{
                      scale: currentOperation === op ? 1.02 : 1
                    }}
                  >
                    <code className="text-sm">list.{op.action}({op.value})</code>
                  </motion.div>
                ))}
            </div>

            {/* Invalid Operations */}
            <div className="space-y-3">
              <h5 className="font-semibold text-red-700">❌ Invalid Operations</h5>
              {GENERICS_EXAMPLE['ArrayList<String>'].operations
                .filter(op => !op.valid)
                .map((op, index) => (
                  <motion.div
                    key={index}
                    className={`p-3 bg-red-50 border border-red-200 rounded ${
                      currentOperation === op ? 'ring-2 ring-red-500' : ''
                    }`}
                    animate={{
                      scale: currentOperation === op ? 1.02 : 1
                    }}
                  >
                    <code className="text-sm">list.{op.action}({op.value})</code>
                    {currentOperation === op && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-xs text-red-600"
                      >
                        Compile Error: {op.error}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Current List State */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold mb-2">Current ArrayList Contents:</h5>
            <div className="flex space-x-2">
              {genericsData.items.length === 0 ? (
                <span className="text-gray-500 italic">Empty list</span>
              ) : (
                genericsData.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 bg-blue-100 border border-blue-300 rounded"
                  >
                    {item}
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
          {/* Advanced Generic Concepts */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-gray-900 text-gray-100 rounded-lg">
              <h5 className="font-semibold text-yellow-400 mb-2">Advanced Generics Examples:</h5>
              <pre className="text-sm overflow-x-auto">
                <code>{`// Generic class with multiple type parameters
public class Pair<T, U> {
    private T first;
    private U second;
    
    public Pair(T first, U second) {
        this.first = first;
        this.second = second;
    }
    
    public T getFirst() { return first; }
    public U getSecond() { return second; }
}

// Bounded type parameters
public class NumberContainer<T extends Number> {
    private T value;
    
    public NumberContainer(T value) {
        this.value = value;
    }
    
    public double getDoubleValue() {
        return value.doubleValue(); // Can call Number methods
    }
}

// Generic methods
public static <T> T getFirst(List<T> list) {
    return list.isEmpty() ? null : list.get(0);
}

// Wildcards
public void printNumbers(List<? extends Number> numbers) {
    for (Number num : numbers) {
        System.out.println(num);
    }
}

// Usage examples
Pair<String, Integer> nameAge = new Pair<>("Alice", 25);
NumberContainer<Double> doubleContainer = new NumberContainer<>(3.14);
List<Integer> integers = Arrays.asList(1, 2, 3);
Integer first = getFirst(integers); // Type inference
printNumbers(integers); // Works with any Number subtype`}</code>
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">✅ Generic Best Practices</h5>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Use meaningful type parameter names: &lt;T&gt; for Type, &lt;E&gt; for Element</div>
                  <div>• Prefer generic types over raw types for type safety</div>
                  <div>• Use bounded wildcards for API flexibility (? extends, ? super)</div>
                  <div>• Don't use generics for arrays - use Collections instead</div>
                  <div>• Use diamond operator &lt;&gt; for cleaner code (Java 7+)</div>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-semibold text-red-800 mb-2">⚠️ Generic Limitations</h5>
                <div className="text-sm text-red-700 space-y-1">
                  <div>• Type erasure: Generic information lost at runtime</div>
                  <div>• Cannot instantiate generic arrays: new T[10] ❌</div>
                  <div>• Cannot use primitives as type arguments: List&lt;int&gt; ❌</div>
                  <div>• Cannot create instances of type parameters: new T() ❌</div>
                  <div>• Static context cannot access type parameters</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2">🎯 Common Generic Patterns</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <div>
                  <h6 className="font-semibold">PECS Principle:</h6>
                  <p>Producer Extends, Consumer Super</p>
                  <code>List&lt;? extends T&gt;</code> - read from<br/>
                  <code>List&lt;? super T&gt;</code> - write to
                </div>
                <div>
                  <h6 className="font-semibold">Type Inference:</h6>
                  <p>Let Java figure out the types</p>
                  <code>Map&lt;String, List&lt;String&gt;&gt; map = new HashMap&lt;&gt;();</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderExceptions = () => {
    const currentStep = state.visualizationData[state.currentStep]
    const currentBlock = currentStep?.currentBlock
    const currentLine = currentStep?.currentLine
    const status = currentStep?.status

    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Exception Handling - Try-Catch-Finally</h3>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Block */}
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
              <div className="space-y-1">
                <div className={`p-1 rounded ${currentLine === 2 ? 'bg-blue-600' : ''}`}>
                  <span className="text-blue-400">try</span> {'{'}
                </div>
                <div className={`p-1 rounded ml-4 ${currentLine === 2 && status === 'executing' ? 'bg-blue-600' : currentLine === 2 && status === 'exception' ? 'bg-red-600' : ''}`}>
                  <span className="text-gray-400">int</span> result = divide(<span className="text-green-400">10</span>, <span className="text-red-400">0</span>);
                </div>
                <div className="ml-4 text-gray-500">
                  System.out.println(<span className="text-green-400">"Result: "</span> + result);
                </div>
                <div>{'}'}</div>
                <div className={`p-1 rounded ${currentLine === 4 || currentLine === 5 ? 'bg-yellow-600' : ''}`}>
                  <span className="text-yellow-400">catch</span> (ArithmeticException e) {'{'}
                </div>
                <div className={`p-1 rounded ml-4 ${currentLine === 5 ? 'bg-yellow-600' : ''}`}>
                  System.out.println(<span className="text-green-400">"Error: "</span> + e.getMessage());
                </div>
                <div>{'}'}</div>
                <div className={`p-1 rounded ${currentLine === 6 ? 'bg-green-600' : ''}`}>
                  <span className="text-green-400">finally</span> {'{'}
                </div>
                <div className={`p-1 rounded ml-4 ${currentLine === 6 ? 'bg-green-600' : ''}`}>
                  System.out.println(<span className="text-green-400">"Cleanup code executed"</span>);
                </div>
                <div>{'}'}</div>
              </div>
            </div>

            {/* Execution Flow */}
            <div className="space-y-4">
              <h5 className="font-semibold">Execution Flow:</h5>
              <div className="space-y-3">
                {EXCEPTION_EXAMPLE.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      exceptionStep - 1 === index
                        ? step.status === 'exception'
                          ? 'bg-red-100 border-red-300'
                          : step.block === 'try'
                          ? 'bg-blue-100 border-blue-300'
                          : step.block === 'catch'
                          ? 'bg-yellow-100 border-yellow-300'
                          : 'bg-green-100 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    animate={{
                      scale: exceptionStep - 1 === index ? 1.02 : 1,
                      opacity: exceptionStep - 1 >= index ? 1 : 0.5
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        step.block === 'try' ? 'bg-blue-500 text-white' :
                        step.block === 'catch' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {step.block.toUpperCase()}
                      </span>
                      <span className="text-sm">{step.description}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderRecursion = () => {
    const currentStep = state.visualizationData[state.currentStep]
    const callStack = currentStep?.callStack || []
    const currentCall = currentStep?.currentCall

    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Recursion - factorial(4) Call Stack</h3>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Function Definition */}
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
              <div className="space-y-1">
                <div className="text-blue-400">factorial(n) {'{' }</div>
                <div className="ml-4">
                  <span className="text-purple-400">if</span> (n &lt;= <span className="text-green-400">1</span>) <span className="text-purple-400">return</span> <span className="text-green-400">1</span>;
                </div>
                <div className="ml-4">
                  <span className="text-purple-400">return</span> n * factorial(n - <span className="text-green-400">1</span>);
                </div>
                <div>{'}'}</div>
              </div>
            </div>

            {/* Call Stack Visualization */}
            <div className="space-y-2">
              <h5 className="font-semibold">Call Stack:</h5>
              <div className="space-y-2">
                {callStack.map((call, index) => (
                  <motion.div
                    key={`${call.n}-${call.step}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border-l-4 ${
                      call.status === 'base' ? 'border-green-500 bg-green-50' :
                      call.status === 'calling' ? 'border-blue-500 bg-blue-50' :
                      'border-purple-500 bg-purple-50'
                    }`}
                    style={{ marginLeft: call.depth * 20 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono">factorial({call.n})</span>
                      {call.result !== null && (
                        <span className="text-sm font-semibold text-green-600">
                          → {call.result}
                        </span>
                      )}
                    </div>
                    {call.status === 'base' && (
                      <div className="text-xs text-green-600 mt-1">Base case reached!</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-step explanation */}
          {currentCall && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg"
            >
              <h5 className="font-semibold text-purple-800 mb-2">Current Step:</h5>
              <div className="text-sm text-purple-700">
                {currentCall.status === 'calling' && `Calling factorial(${currentCall.n}) - pushing onto stack`}
                {currentCall.status === 'base' && `Base case: factorial(${currentCall.n}) = 1`}
                {currentCall.status === 'returning' && `Returning from factorial(${currentCall.n}) = ${currentCall.result}`}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Demo Selection with Quiz Tab */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-center space-x-2 flex-wrap">
          {[
            { id: 'generics', label: 'Generics', icon: '📦', type: 'demo' },
            { id: 'exceptions', label: 'Exception Handling', icon: '⚠️', type: 'demo' },
            { id: 'recursion', label: 'Recursion', icon: '🔄', type: 'demo' },
            { id: 'quiz', label: 'Knowledge Quiz', icon: '🧠', type: 'quiz' }
          ].map(demo => (
            <button
              key={demo.id}
              onClick={() => demo.type === 'quiz' ? setCurrentDemo('quiz') : handleDemoChange(demo.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentDemo === demo.id
                  ? demo.type === 'quiz'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                    : 'bg-blue-500 text-white'
                  : demo.type === 'quiz'
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 border-2 border-emerald-300 animate-pulse'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } ${demo.type === 'quiz' ? 'relative overflow-hidden' : ''}`}
            >
              {demo.type === 'quiz' && currentDemo !== 'quiz' && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 animate-ping"></div>
              )}
              <span className="relative z-10">
                {demo.icon} {demo.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Demo - Interactive Content First */}
      <div className="space-y-6">
        {currentDemo === 'generics' && renderGenerics()}
        {currentDemo === 'exceptions' && renderExceptions()}
        {currentDemo === 'recursion' && renderRecursion()}
        {currentDemo === 'quiz' && (
          <div className="card">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🧠 Java Features Knowledge Quiz
              </h2>
              <p className="text-gray-600">
                Challenge yourself with questions about generics, exception handling, and recursion to master these advanced Java concepts.
              </p>
            </div>
            
            <Quiz
              title="Advanced Java Features Mastery"
              questions={JAVA_FEATURES_QUIZ_QUESTIONS}
              onComplete={(results) => {
                console.log('Java Features Quiz completed:', results)
              }}
              showResults={true}
              allowRetake={true}
            />
          </div>
        )}
      </div>

      {/* Comprehensive Java Features Education - Static Content Below */}
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3">Advanced Java Features for SE2205A</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">📦 Generics</h4>
              <p className="text-green-700">Type parameterization introduced in Java 5. Provides compile-time type safety and eliminates the need for explicit casting.</p>
              <div className="bg-white p-2 rounded text-xs font-mono">
                List&lt;String&gt; list = new ArrayList&lt;&gt;();
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">⚠️ Exception Handling</h4>
              <p className="text-green-700">Structured approach to handling runtime errors. Separates normal program flow from error handling logic.</p>
              <div className="bg-white p-2 rounded text-xs font-mono">
                try {'{'}...{'}'} catch(Exception e) {'{'}...{'}'}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">🔄 Recursion</h4>
              <p className="text-green-700">A programming technique where a function calls itself. Essential for tree traversals, divide-and-conquer algorithms.</p>
              <div className="bg-white p-2 rounded text-xs font-mono">
                factorial(n) = n * factorial(n-1)
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 Learning Objectives</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <ul className="space-y-1">
              <li>• Understand type safety with generics and wildcard types</li>
              <li>• Master exception hierarchy and proper error handling</li>
              <li>• Implement recursive algorithms with proper base cases</li>
            </ul>
            <ul className="space-y-1">
              <li>• Apply generic constraints and bounded type parameters</li>
              <li>• Use try-with-resources for automatic resource management</li>
              <li>• Analyze recursive complexity and avoid stack overflow</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Operation Description */}
      <AnimatePresence>
        {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
        state.visualizationContext?.startsWith('java-') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
          >
            <p className="text-blue-800 font-medium">
              {state.visualizationData[state.currentStep].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}