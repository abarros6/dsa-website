import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'
import Quiz from '../Quiz'

const OOP_COLORS = {
  class: '#3b82f6',
  interface: '#8b5cf6',
  abstract: '#f59e0b',
  private: '#ef4444',
  protected: '#f59e0b',
  public: '#10b981',
  inheritance: '#6366f1',
  composition: '#059669'
}

// Sample class hierarchy data
const CLASS_HIERARCHY = {
  'Vehicle': {
    type: 'abstract',
    position: { x: 400, y: 50 },
    methods: ['start()', 'stop()', 'getSpeed()'],
    fields: ['speed', 'fuel'],
    children: ['Car', 'Motorcycle', 'Truck']
  },
  'Car': {
    type: 'class',
    position: { x: 200, y: 200 },
    methods: ['openTrunk()', 'start()', 'honk()'],
    fields: ['doors', 'trunkCapacity'],
    parent: 'Vehicle',
    children: ['Sedan', 'SUV']
  },
  'Motorcycle': {
    type: 'class',
    position: { x: 400, y: 200 },
    methods: ['wheelie()', 'start()'],
    fields: ['hasWindshield'],
    parent: 'Vehicle',
    children: []
  },
  'Truck': {
    type: 'class',
    position: { x: 600, y: 200 },
    methods: ['loadCargo()', 'start()'],
    fields: ['cargoCapacity', 'axleCount'],
    parent: 'Vehicle',
    children: []
  },
  'Sedan': {
    type: 'class',
    position: { x: 100, y: 350 },
    methods: ['start()', 'openTrunk()', 'honk()'],
    fields: ['doors', 'trunkCapacity'],
    parent: 'Car',
    children: []
  },
  'SUV': {
    type: 'class',
    position: { x: 300, y: 350 },
    methods: ['start()', 'openTrunk()', 'enable4WD()'],
    fields: ['doors', 'trunkCapacity', 'groundClearance'],
    parent: 'Car',
    children: []
  }
}

// Encapsulation example
const ENCAPSULATION_EXAMPLE = {
  'BankAccount': {
    privateFields: ['balance', 'accountNumber'],
    publicMethods: ['deposit()', 'withdraw()', 'getBalance()'],
    privateMethods: ['validateTransaction()', 'updateBalance()'],
    protectedFields: ['transactionHistory']
  }
}

// Polymorphism example
const POLYMORPHISM_EXAMPLE = {
  baseClass: 'Animal',
  derivedClasses: ['Dog', 'Cat', 'Bird'],
  method: 'makeSound()',
  implementations: {
    'Dog': 'return "Woof!"',
    'Cat': 'return "Meow!"', 
    'Bird': 'return "Tweet!"'
  }
}

// Helper function to generate code examples
const getClassCodeExample = (className) => {
  const examples = {
    'Vehicle': `// Abstract base class
abstract class Vehicle {
    protected double speed;
    protected double fuel;
    
    // Abstract method - must be implemented by subclasses
    public abstract void start();
    
    // Concrete method - inherited by all subclasses
    public void stop() {
        this.speed = 0;
        System.out.println("Vehicle stopped");
    }
    
    public double getSpeed() {
        return this.speed;
    }
}`,
    'Car': `// Concrete class extending Vehicle
public class Car extends Vehicle {
    private int doors;
    private double trunkCapacity;
    
    public Car(int doors, double trunkCapacity) {
        this.doors = doors;
        this.trunkCapacity = trunkCapacity;
    }
    
    @Override
    public void start() {
        this.speed = 0;
        System.out.println("Car engine started");
    }
    
    public void openTrunk() {
        System.out.println("Trunk opened");
    }
    
    public void honk() {
        System.out.println("Beep beep!");
    }
}`,
    'Sedan': `// Further specialization
public class Sedan extends Car {
    public Sedan() {
        super(4, 15.0); // 4 doors, 15 cubic feet trunk
    }
    
    @Override
    public void start() {
        super.start(); // Call parent method
        System.out.println("Sedan ready for comfortable city driving");
    }
}`,
    'SUV': `// Another specialization with additional features
public class SUV extends Car {
    private double groundClearance;
    
    public SUV() {
        super(4, 25.0); // 4 doors, 25 cubic feet cargo
        this.groundClearance = 8.5;
    }
    
    public void enable4WD() {
        System.out.println("4WD mode activated");
    }
    
    @Override
    public void start() {
        super.start();
        System.out.println("SUV ready for any terrain");
    }
}`,
    'Motorcycle': `// Different vehicle type
public class Motorcycle extends Vehicle {
    private boolean hasWindshield;
    
    public Motorcycle(boolean hasWindshield) {
        this.hasWindshield = hasWindshield;
    }
    
    @Override
    public void start() {
        this.speed = 0;
        System.out.println("Motorcycle engine roaring!");
    }
    
    public void wheelie() {
        System.out.println("Performing wheelie!");
    }
}`,
    'Truck': `// Heavy-duty vehicle
public class Truck extends Vehicle {
    private double cargoCapacity;
    private int axleCount;
    
    public Truck(double cargoCapacity, int axleCount) {
        this.cargoCapacity = cargoCapacity;
        this.axleCount = axleCount;
    }
    
    @Override
    public void start() {
        this.speed = 0;
        System.out.println("Truck engine started - heavy duty mode");
    }
    
    public void loadCargo(double weight) {
        if (weight <= cargoCapacity) {
            System.out.println("Cargo loaded: " + weight + " tons");
        } else {
            System.out.println("Cargo too heavy!");
        }
    }
}`
  }
  return examples[className] || '// Code example not available'
}

// OOP Quiz Questions
const OOP_QUIZ_QUESTIONS = [
  {
    type: 'multiple-choice',
    question: 'Which OOP principle focuses on hiding internal implementation details and providing controlled access through methods?',
    options: [
      'Inheritance',
      'Encapsulation', 
      'Polymorphism',
      'Abstraction'
    ],
    correctAnswer: 1,
    explanation: 'Encapsulation bundles data and methods together while hiding internal implementation details using access modifiers like private, protected, and public.'
  },
  {
    type: 'multiple-choice',
    question: 'In the Vehicle hierarchy shown, what type of relationship exists between Car and Vehicle?',
    options: [
      'Has-a relationship (Composition)',
      'Is-a relationship (Inheritance)',
      'Uses-a relationship (Aggregation)',
      'No relationship'
    ],
    correctAnswer: 1,
    explanation: 'Car extends Vehicle, creating an "is-a" relationship through inheritance. A Car IS-A Vehicle and inherits all Vehicle properties and methods.'
  },
  {
    type: 'code-output',
    question: 'What will be the output of this polymorphic method call?',
    code: `Animal animal = new Dog("Buddy");
System.out.println(animal.makeSound());`,
    options: [
      'Animal sound',
      'Woof! Woof!',
      'Compilation error',
      'Runtime error'
    ],
    correctAnswer: 1,
    explanation: 'Polymorphism allows the Dog\'s overridden makeSound() method to be called at runtime, even though the reference is of type Animal. This is dynamic method dispatch.'
  },
  {
    type: 'multiple-select',
    question: 'Which access modifiers allow a subclass to access a member from its parent class? (Select all that apply)',
    options: [
      'private',
      'protected',
      'public',
      'package-private (default)'
    ],
    correctAnswers: [1, 2, 3],
    explanation: 'Subclasses can access protected, public, and package-private (if in same package) members from their parent class. Private members are not accessible to subclasses.'
  },
  {
    type: 'true-false',
    question: 'An abstract class in Java can be instantiated directly using the new keyword.',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'False. Abstract classes cannot be instantiated directly. They serve as templates for concrete subclasses and must be extended by other classes.'
  },
  {
    type: 'multiple-choice',
    question: 'Which principle is demonstrated when different classes (Dog, Cat, Bird) provide their own implementation of the makeSound() method?',
    options: [
      'Encapsulation',
      'Inheritance',
      'Polymorphism',
      'Abstraction'
    ],
    correctAnswer: 2,
    explanation: 'Polymorphism allows different classes to provide their own specific implementations of the same method signature, enabling the same interface to have different behaviors.'
  },
  {
    type: 'multiple-choice',
    question: 'What is the main benefit of using private fields with public getter/setter methods?',
    options: [
      'Improved performance',
      'Reduced memory usage',
      'Data validation and controlled access',
      'Faster compilation'
    ],
    correctAnswer: 2,
    explanation: 'Private fields with public accessors allow data validation, controlled access, and the ability to change internal implementation without affecting client code - core principles of encapsulation.'
  }
]

export default function OOPPrinciplesVisualization() {
  const { state, setVisualizationData } = useApp()
  const [currentDemo, setCurrentDemo] = useState('hierarchy')
  const [selectedClass, setSelectedClass] = useState(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [polymorphismDemo, setPolymorphismDemo] = useState({ animal: 'Dog', result: '' })

  const generateVisualizationSteps = useCallback((demo, data) => {
    const steps = []
    
    switch (demo) {
      case 'hierarchy':
        steps.push({
          demo: 'hierarchy',
          step: 0,
          description: 'Object-Oriented Class Hierarchy - Shows inheritance relationships',
          highlightedClasses: [],
          operation: 'oop-demo'
        })
        
        Object.keys(CLASS_HIERARCHY).forEach((className, index) => {
          steps.push({
            demo: 'hierarchy',
            step: index + 1,
            description: `Exploring ${className} - ${CLASS_HIERARCHY[className].type}`,
            highlightedClasses: [className],
            selectedClass: className,
            operation: 'oop-demo'
          })
        })
        break
        
      case 'polymorphism':
        steps.push({
          demo: 'polymorphism',
          step: 0,
          description: 'Polymorphism Demo - Same method, different implementations',
          currentAnimal: null,
          result: '',
          operation: 'oop-demo'
        })
        
        Object.keys(POLYMORPHISM_EXAMPLE.implementations).forEach((animal, index) => {
          steps.push({
            demo: 'polymorphism',
            step: index + 1,
            description: `${animal}.makeSound() called`,
            currentAnimal: animal,
            result: POLYMORPHISM_EXAMPLE.implementations[animal],
            operation: 'oop-demo'
          })
        })
        break
        
      case 'encapsulation':
        steps.push({
          demo: 'encapsulation',
          step: 0,
          description: 'Encapsulation - Controlling access to class members',
          accessLevel: 'all',
          operation: 'oop-demo'
        })
        
        const accessLevels = ['private', 'protected', 'public']
        accessLevels.forEach((level, index) => {
          steps.push({
            demo: 'encapsulation',
            step: index + 1,
            description: `Showing ${level} members only`,
            accessLevel: level,
            operation: 'oop-demo'
          })
        })
        break
    }
    
    return steps
  }, [])

  const handleDemoChange = (demo) => {
    setCurrentDemo(demo)
    const steps = generateVisualizationSteps(demo)
    setVisualizationData(steps, `oop-${demo}`)
  }

  const handlePolymorphismCall = (animal) => {
    setPolymorphismDemo({
      animal,
      result: POLYMORPHISM_EXAMPLE.implementations[animal]
    })
  }

  useEffect(() => {
    const currentStep = state.visualizationData[state.currentStep]
    if (currentStep && state.visualizationContext?.startsWith('oop-')) {
      setAnimationStep(currentStep.step || 0)
      if (currentStep.selectedClass) {
        setSelectedClass(currentStep.selectedClass)
      }
      if (currentStep.currentAnimal) {
        setPolymorphismDemo({
          animal: currentStep.currentAnimal,
          result: currentStep.result
        })
      }
    }
  }, [state.currentStep, state.visualizationData, state.visualizationContext])

  const renderClassHierarchy = () => {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">Vehicle Class Hierarchy</h3>
        <svg width="800" height="400" className="w-full" viewBox="0 0 800 400">
          {/* Render inheritance lines */}
          {Object.entries(CLASS_HIERARCHY).map(([className, classData]) => {
            if (classData.parent) {
              const parent = CLASS_HIERARCHY[classData.parent]
              return (
                <motion.line
                  key={`line-${className}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x1={parent.position.x}
                  y1={parent.position.y + 30}
                  x2={classData.position.x}
                  y2={classData.position.y - 10}
                  stroke={OOP_COLORS.inheritance}
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
              )
            }
            return null
          })}
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={OOP_COLORS.inheritance} />
            </marker>
          </defs>
          
          {/* Render class boxes */}
          {Object.entries(CLASS_HIERARCHY).map(([className, classData]) => {
            const isHighlighted = selectedClass === className
            const isAbstract = classData.type === 'abstract'
            
            return (
              <g key={className}>
                <motion.rect
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isHighlighted ? 1.1 : 1, 
                    opacity: 1 
                  }}
                  transition={{ duration: 0.3 }}
                  x={classData.position.x - 60}
                  y={classData.position.y - 15}
                  width="120"
                  height="60"
                  rx="5"
                  fill={isAbstract ? OOP_COLORS.abstract : OOP_COLORS.class}
                  stroke={isHighlighted ? '#000' : '#666'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  className="cursor-pointer"
                  onClick={() => setSelectedClass(className)}
                />
                
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={classData.position.x}
                  y={classData.position.y}
                  textAnchor="middle"
                  className="text-sm font-bold fill-white cursor-pointer select-none"
                  onClick={() => setSelectedClass(className)}
                  style={{ fontStyle: isAbstract ? 'italic' : 'normal' }}
                >
                  {className}
                </motion.text>
                
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={classData.position.x}
                  y={classData.position.y + 15}
                  textAnchor="middle"
                  className="text-xs fill-white select-none"
                >
                  {classData.type}
                </motion.text>
              </g>
            )
          })}
        </svg>
        
        {/* Detailed Class Information */}
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">{selectedClass} Class Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">Instance Methods:</h5>
                  <ul className="space-y-1 text-sm">
                    {CLASS_HIERARCHY[selectedClass].methods.map(method => (
                      <li key={method} className="bg-white p-2 rounded border-l-4 border-blue-400">
                        <code className="text-blue-800">{method}</code>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">Instance Fields:</h5>
                  <ul className="space-y-1 text-sm">
                    {CLASS_HIERARCHY[selectedClass].fields.map(field => (
                      <li key={field} className="bg-white p-2 rounded border-l-4 border-green-400">
                        <code className="text-green-800">{field}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Inheritance Explanation */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2">Inheritance Relationships</h5>
              <div className="text-sm text-purple-700 space-y-2">
                {CLASS_HIERARCHY[selectedClass].parent && (
                  <div>
                    <strong>Inherits from:</strong> {CLASS_HIERARCHY[selectedClass].parent}
                    <p className="text-xs mt-1">This means {selectedClass} automatically gets all public and protected members from {CLASS_HIERARCHY[selectedClass].parent}.</p>
                  </div>
                )}
                {CLASS_HIERARCHY[selectedClass].children?.length > 0 && (
                  <div>
                    <strong>Extended by:</strong> {CLASS_HIERARCHY[selectedClass].children.join(', ')}
                    <p className="text-xs mt-1">These classes inherit from {selectedClass} and can override its methods or add new functionality.</p>
                  </div>
                )}
                {selectedClass === 'Vehicle' && (
                  <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                    <strong>Abstract Class:</strong> Cannot be instantiated directly. Serves as a template for concrete implementations.
                  </div>
                )}
              </div>
            </div>

            {/* Code Example */}
            <div className="p-4 bg-gray-900 text-gray-100 rounded-lg">
              <h5 className="font-semibold text-yellow-400 mb-2">Java Code Example:</h5>
              <pre className="text-sm overflow-x-auto">
                <code>{getClassCodeExample(selectedClass)}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  const renderEncapsulation = () => {
    const currentStep = state.visualizationData[state.currentStep]
    const accessLevel = currentStep?.accessLevel || 'all'
    
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Encapsulation - Access Control & Data Hiding</h3>
        
        {/* Educational Content */}
        <div className="mb-6 space-y-4\">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">🎯 Learning Objectives</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Understand how access modifiers control visibility of class members</li>
              <li>• Learn the principle of data hiding and why it's important</li>
              <li>• See how encapsulation promotes code security and maintainability</li>
              <li>• Practice identifying appropriate access levels for different scenarios</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <h5 className="font-semibold text-red-800">🔒 Private</h5>
              <p className="text-red-700">Only accessible within the same class. Use for internal implementation details.</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h5 className="font-semibold text-yellow-800">🔓 Protected</h5>
              <p className="text-yellow-700">Accessible within package and by subclasses. Use for inheritance relationships.</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <h5 className="font-semibold text-green-800">🌍 Public</h5>
              <p className="text-green-700">Accessible from anywhere. Use for class interface (API).</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h5 className="font-semibold text-blue-800">📦 Package</h5>
              <p className="text-blue-700">Default access. Accessible within the same package only.</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-100 rounded-lg p-6">
            <h4 className="font-bold text-center mb-4">BankAccount Class</h4>
            
            {/* Private Fields */}
            <motion.div 
              className={`mb-4 p-3 rounded ${accessLevel === 'private' || accessLevel === 'all' ? 'bg-red-100 border-red-300' : 'bg-gray-200'}`}
              animate={{ opacity: accessLevel === 'private' || accessLevel === 'all' ? 1 : 0.3 }}
            >
              <h5 className="font-semibold text-red-700 mb-2">🔒 Private Fields</h5>
              <div className="text-sm space-y-1">
                <div>- balance: double</div>
                <div>- accountNumber: String</div>
              </div>
            </motion.div>
            
            {/* Protected Fields */}
            <motion.div 
              className={`mb-4 p-3 rounded ${accessLevel === 'protected' || accessLevel === 'all' ? 'bg-yellow-100 border-yellow-300' : 'bg-gray-200'}`}
              animate={{ opacity: accessLevel === 'protected' || accessLevel === 'all' ? 1 : 0.3 }}
            >
              <h5 className="font-semibold text-yellow-700 mb-2">🔓 Protected Fields</h5>
              <div className="text-sm space-y-1">
                <div>- transactionHistory: List&lt;Transaction&gt;</div>
              </div>
            </motion.div>
            
            {/* Public Methods */}
            <motion.div 
              className={`mb-4 p-3 rounded ${accessLevel === 'public' || accessLevel === 'all' ? 'bg-green-100 border-green-300' : 'bg-gray-200'}`}
              animate={{ opacity: accessLevel === 'public' || accessLevel === 'all' ? 1 : 0.3 }}
            >
              <h5 className="font-semibold text-green-700 mb-2">🌍 Public Methods</h5>
              <div className="text-sm space-y-1">
                <div>+ deposit(amount: double): boolean</div>
                <div>+ withdraw(amount: double): boolean</div>
                <div>+ getBalance(): double</div>
              </div>
            </motion.div>
            
            {/* Private Methods */}
            <motion.div 
              className={`p-3 rounded ${accessLevel === 'private' || accessLevel === 'all' ? 'bg-red-100 border-red-300' : 'bg-gray-200'}`}
              animate={{ opacity: accessLevel === 'private' || accessLevel === 'all' ? 1 : 0.3 }}
            >
              <h5 className="font-semibold text-red-700 mb-2">🔒 Private Methods</h5>
              <div className="text-sm space-y-1">
                <div>- validateTransaction(amount: double): boolean</div>
                <div>- updateBalance(amount: double): void</div>
              </div>
            </motion.div>
          </div>
          
          {/* Access Level Controls */}
          <div className="mt-4 flex justify-center space-x-2">
            {['all', 'public', 'protected', 'private'].map(level => (
              <button
                key={level}
                onClick={() => setVisualizationData([{
                  demo: 'encapsulation',
                  accessLevel: level,
                  description: `Showing ${level} members ${level === 'all' ? '' : 'only'}`,
                  operation: 'oop-demo'
                }], 'oop-encapsulation')}
                className={`px-3 py-1 rounded text-sm ${
                  accessLevel === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Best Practices Section */}
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">✅ Encapsulation Best Practices</h5>
              <div className="text-sm text-green-700 space-y-2">
                <div><strong>1. Make fields private:</strong> Always use private access for instance variables to prevent direct manipulation.</div>
                <div><strong>2. Provide public methods:</strong> Use getter/setter methods to control access to private fields.</div>
                <div><strong>3. Validate input:</strong> Use setter methods to validate data before modifying private fields.</div>
                <div><strong>4. Minimize public interface:</strong> Only expose methods that clients actually need to use.</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900 text-gray-100 rounded-lg">
              <h5 className="font-semibold text-yellow-400 mb-2">Example: Proper Encapsulation</h5>
              <pre className="text-sm overflow-x-auto">
                <code>{`public class BankAccount {
    private double balance;           // Private - can't be accessed directly
    private String accountNumber;     // Private - internal data
    protected List<Transaction> transactionHistory;  // Protected - for subclasses
    
    // Public methods provide controlled access
    public boolean deposit(double amount) {
        if (amount > 0) {  // Validation
            balance += amount;
            transactionHistory.add(new Transaction("DEPOSIT", amount));
            return true;
        }
        return false;
    }
    
    public boolean withdraw(double amount) {
        if (validateTransaction(amount)) {  // Use private helper
            updateBalance(-amount);
            return true;
        }
        return false;
    }
    
    public double getBalance() {  // Read-only access to balance
        return balance;
    }
    
    // Private helper methods - implementation details
    private boolean validateTransaction(double amount) {
        return amount > 0 && amount <= balance;
    }
    
    private void updateBalance(double amount) {
        balance += amount;
        transactionHistory.add(new Transaction("UPDATE", amount));
    }
}`}</code>
              </pre>
            </div>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h5 className="font-semibold text-red-800 mb-2">⚠️ Common Encapsulation Mistakes</h5>
              <div className="text-sm text-red-700 space-y-1">
                <div>• Making all fields public (breaks encapsulation)</div>
                <div>• Returning mutable objects directly from getters</div>
                <div>• Not validating input in setter methods</div>
                <div>• Exposing internal implementation details through public methods</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPolymorphism = () => {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Polymorphism - Same Interface, Different Behavior</h3>
        
        {/* Educational Introduction */}
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">🔄 Understanding Polymorphism</h4>
            <p className="text-sm text-purple-700 mb-3">
              Polymorphism allows objects of different types to be treated as instances of the same type through a common interface. 
              The actual method called is determined at runtime based on the object's actual type.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-purple-800">Compile-time Polymorphism:</h5>
                <ul className="text-purple-700 list-disc list-inside">
                  <li>Method Overloading</li>
                  <li>Operator Overloading</li>
                  <li>Resolved at compile time</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-purple-800">Runtime Polymorphism:</h5>
                <ul className="text-purple-700 list-disc list-inside">
                  <li>Method Overriding</li>
                  <li>Dynamic Method Dispatch</li>
                  <li>Resolved at runtime</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">💡 Key Concepts</h5>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>Dynamic Binding:</strong> The correct method is chosen at runtime based on the actual object type</div>
              <div><strong>Method Overriding:</strong> Subclasses provide specific implementations of parent class methods</div>
              <div><strong>Liskov Substitution:</strong> Objects of a superclass should be replaceable with objects of a subclass</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Base Class */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-purple-100 rounded-lg">
              <h4 className="font-bold text-purple-800">Animal (Base Class)</h4>
              <div className="text-sm text-purple-700 mt-2">
                abstract makeSound(): String
              </div>
            </div>
          </div>
          
          {/* Derived Classes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(POLYMORPHISM_EXAMPLE.implementations).map(([animal, implementation]) => (
              <motion.div
                key={animal}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  polymorphismDemo.animal === animal
                    ? 'bg-blue-100 border-blue-500 scale-105'
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => handlePolymorphismCall(animal)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h5 className="font-semibold text-center mb-2">{animal}</h5>
                <div className="text-xs text-gray-600 text-center">
                  makeSound() {'{'}
                  <br />
                  &nbsp;&nbsp;{implementation}
                  <br />
                  {'}'}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Method Call Result */}
          <AnimatePresence>
            {polymorphismDemo.result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center p-4 bg-green-100 rounded-lg"
              >
                <h4 className="font-semibold text-green-800 mb-2">
                  {polymorphismDemo.animal}.makeSound() called
                </h4>
                <div className="text-lg font-mono text-green-700">
                  Output: {polymorphismDemo.result.replace('return ', '').replace(/"/g, '')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Detailed Explanation and Code Examples */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-gray-900 text-gray-100 rounded-lg">
              <h5 className="font-semibold text-yellow-400 mb-2">Complete Polymorphism Example:</h5>
              <pre className="text-sm overflow-x-auto">
                <code>{`// Base class with abstract method
abstract class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    // Abstract method - must be overridden
    public abstract String makeSound();
    
    // Concrete method - can be overridden
    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

// Concrete implementations
class Dog extends Animal {
    public Dog(String name) { super(name); }
    
    @Override
    public String makeSound() {
        return "Woof! Woof!";
    }
}

class Cat extends Animal {
    public Cat(String name) { super(name); }
    
    @Override
    public String makeSound() {
        return "Meow! Purr...";
    }
    
    @Override
    public void sleep() {
        System.out.println(name + " curls up and sleeps 16 hours");
    }
}

// Polymorphism in action
public class PolymorphismDemo {
    public static void main(String[] args) {
        // Same reference type, different object types
        Animal[] animals = {
            new Dog("Buddy"),
            new Cat("Whiskers"),
            new Bird("Tweety")
        };
        
        // Polymorphic method calls
        for (Animal animal : animals) {
            System.out.println(animal.makeSound()); // Calls correct implementation
            animal.sleep(); // May call overridden version
        }
    }
}`}</code>
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">✅ Benefits of Polymorphism</h5>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• <strong>Flexibility:</strong> Easy to add new types without changing existing code</div>
                  <div>• <strong>Maintainability:</strong> Changes to implementation don't affect client code</div>
                  <div>• <strong>Extensibility:</strong> New classes can be added that work with existing systems</div>
                  <div>• <strong>Code Reuse:</strong> Same code can work with multiple object types</div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2">🔧 Implementation Requirements</h5>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>• Use <code>@Override</code> annotation for clarity</div>
                  <div>• Maintain method signature exactly (name, parameters, return type)</div>
                  <div>• Cannot reduce visibility (public → private)</div>
                  <div>• Can expand exceptions but not add new checked exceptions</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h5 className="font-semibold text-red-800 mb-2">⚠️ Common Polymorphism Pitfalls</h5>
              <div className="text-sm text-red-700 space-y-1">
                <div>• <strong>Method Hiding:</strong> Using static methods instead of instance methods for polymorphism</div>
                <div>• <strong>Constructor Calls:</strong> Calling overridable methods in constructors can be dangerous</div>
                <div>• <strong>Type Casting:</strong> Unnecessary downcasting defeats the purpose of polymorphism</div>
                <div>• <strong>Final Methods:</strong> Final methods cannot be overridden, breaking polymorphism</div>
              </div>
            </div>
          </div>
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
            { id: 'hierarchy', label: 'Class Hierarchy', icon: '🏗️', type: 'demo' },
            { id: 'encapsulation', label: 'Encapsulation', icon: '🔒', type: 'demo' },
            { id: 'polymorphism', label: 'Polymorphism', icon: '🔄', type: 'demo' },
            { id: 'quiz', label: 'Knowledge Quiz', icon: '🧠', type: 'quiz' }
          ].map(demo => (
            <button
              key={demo.id}
              onClick={() => demo.type === 'quiz' ? setCurrentDemo('quiz') : handleDemoChange(demo.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentDemo === demo.id
                  ? demo.type === 'quiz'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-blue-500 text-white'
                  : demo.type === 'quiz'
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 border-2 border-purple-300 animate-pulse'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } ${demo.type === 'quiz' ? 'relative overflow-hidden' : ''}`}
            >
              {demo.type === 'quiz' && currentDemo !== 'quiz' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-ping"></div>
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
        {currentDemo === 'hierarchy' && renderClassHierarchy()}
        {currentDemo === 'encapsulation' && renderEncapsulation()}
        {currentDemo === 'polymorphism' && renderPolymorphism()}
        {currentDemo === 'quiz' && (
          <div className="card">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🧠 OOP Principles Knowledge Quiz
              </h2>
              <p className="text-gray-600">
                Test your understanding of inheritance, encapsulation, polymorphism, and abstraction with this comprehensive quiz.
              </p>
            </div>
            
            <Quiz
              title="Object-Oriented Programming Mastery"
              questions={OOP_QUIZ_QUESTIONS}
              onComplete={(results) => {
                console.log('Quiz completed:', results)
              }}
              showResults={true}
              allowRetake={true}
            />
          </div>
        )}
      </div>

      {/* Comprehensive OOP Education Section - Static Content Below */}
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">The Four Pillars of Object-Oriented Programming</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-blue-800">1. Inheritance 🏗️</h4>
                <p className="text-blue-700">Enables code reuse by allowing classes to inherit attributes and methods from parent classes. Creates "is-a" relationships.</p>
                <div className="mt-1 p-2 bg-white rounded text-xs font-mono">
                  class Car extends Vehicle {'{'}...{'}'}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">2. Encapsulation 🔒</h4>
                <p className="text-blue-700">Bundles data and methods together while hiding internal implementation. Controls access through visibility modifiers.</p>
                <div className="mt-1 p-2 bg-white rounded text-xs font-mono">
                  private double balance;<br/>public void deposit(double amount)
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-blue-800">3. Polymorphism 🔄</h4>
                <p className="text-blue-700">Allows objects of different types to be treated uniformly. Same interface, different implementations.</p>
                <div className="mt-1 p-2 bg-white rounded text-xs font-mono">
                  Animal animal = new Dog();<br/>animal.makeSound(); // "Woof!"
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">4. Abstraction 🎭</h4>
                <p className="text-blue-700">Hides complex implementation details and shows only essential features. Focuses on what an object does, not how.</p>
                <div className="mt-1 p-2 bg-white rounded text-xs font-mono">
                  abstract class Shape {'{'}...{'}'}<br/>interface Drawable {'{'}...{'}'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why OOP Matters */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Why Object-Oriented Programming?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
            <div>
              <h4 className="font-semibold">Code Reusability</h4>
              <p>Inheritance and composition allow you to build upon existing code rather than starting from scratch.</p>
            </div>
            <div>
              <h4 className="font-semibold">Maintainability</h4>
              <p>Encapsulation makes code easier to modify and debug by localizing changes to specific classes.</p>
            </div>
            <div>
              <h4 className="font-semibold">Scalability</h4>
              <p>Modular design through objects makes large systems more manageable and extensible.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Operation Description */}
      <AnimatePresence>
        {state.visualizationData.length > 0 && state.visualizationData[state.currentStep] && 
        state.visualizationContext?.startsWith('oop-') && (
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