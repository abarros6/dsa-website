# SE2205A Algorithm Visualizer

An interactive educational tool for visualizing data structures and algorithms, designed for SE2205A: Algorithms and Data Structures course.

## 🎯 Project Overview

This web-based visualizer provides step-by-step interactive demonstrations of fundamental data structures and algorithms. Students can observe algorithm execution in real-time, understand complexity analysis, and experiment with different inputs to deepen their understanding.

## ✨ Features

### 📊 Data Structures
- **Array Operations**: Insert, delete, search with index-based access
- **Stack**: LIFO operations (push, pop, peek) with visual stack representation
- **Queue**: FIFO operations (enqueue, dequeue, front) with circular visualization
- **Linked List**: Dynamic node-based structure with pointer visualization

### 🔍 Searching Algorithms
- **Linear Search**: Sequential element-by-element search
- **Binary Search**: Divide-and-conquer search on sorted arrays
- **Hash Search**: Direct access using hash tables with collision resolution

### 🔄 Sorting Algorithms
- **Bubble Sort**: Adjacent element comparison and swapping
- **Selection Sort**: Find minimum and place at beginning
- **Insertion Sort**: Insert elements into sorted portion
- **Merge Sort**: Divide-and-conquer with merge operations
- **Quick Sort**: Partition-based sorting with pivot selection

### 🌲 Tree Algorithms *(Coming Soon)*
- Binary Search Trees
- AVL Trees (Self-balancing)
- Tree Traversals (Inorder, Preorder, Postorder)

### 🕸️ Graph Algorithms *(Coming Soon)*
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Shortest Path
- Minimum Spanning Tree (MST)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsa-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🎮 How to Use

### Navigation
- **Home**: Project overview and introduction
- **Data Structures**: Interactive visualizations of linear data structures
- **Algorithms**: Comprehensive algorithm demonstrations

### Controls
- **Play/Pause**: Control animation playback
- **Step Forward/Backward**: Move through algorithm steps manually
- **Speed Control**: Adjust animation speed
- **Reset**: Return to initial state
- **Random Data**: Generate new test cases

### Customization
- Input custom arrays and values
- Adjust visualization parameters
- Compare algorithm performance metrics

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React 18+ with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Context + useReducer

### Project Structure
```
src/
├── components/
│   ├── visualizations/          # Algorithm & data structure components
│   ├── SimpleControlPanel.jsx   # Playback controls
│   └── Layout/                  # Navigation and layout components
├── contexts/
│   └── AppContext.jsx          # Global state management
├── pages/
│   ├── Home.jsx               # Landing page
│   ├── DataStructures.jsx     # Data structure demonstrations
│   └── Algorithms.jsx         # Algorithm visualizations
├── styles/
│   └── index.css             # Global styles and Tailwind imports
└── App.jsx                   # Main application component
```

### Key Design Patterns
- **Step-by-Step Visualization**: Each algorithm generates discrete steps with descriptions
- **Immutable State**: Safe array operations using Array.from() and traditional swapping
- **Component Composition**: Reusable visualization patterns across algorithms
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 📚 Educational Objectives

### Learning Outcomes
1. **Algorithm Understanding**: Visualize how algorithms process data step-by-step
2. **Complexity Analysis**: Compare time and space complexity across algorithms
3. **Data Structure Mastery**: Understand operations and use cases for each structure
4. **Problem-Solving Skills**: Choose appropriate algorithms for different scenarios

### Pedagogical Features
- **Interactive Experiments**: Modify inputs and observe behavior changes
- **Comparison Tables**: Side-by-side algorithm performance metrics
- **Educational Content**: Explanations of key concepts and trade-offs
- **Real-time Feedback**: Step descriptions and current algorithm state

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality *(if configured)*

### Contributing Guidelines
1. Follow React best practices and hooks patterns
2. Use Tailwind CSS for consistent styling
3. Implement step-by-step visualization for new algorithms
4. Add comprehensive error handling and input validation
5. Include educational descriptions for each algorithm step

### Code Style
- Use functional components with hooks
- Implement proper TypeScript types *(if using TypeScript)*
- Follow ESLint configuration
- Use semantic commit messages

## 📈 Implementation Progress

### ✅ Completed (Phase 1-4)
- [x] Project setup and configuration
- [x] Linear data structures (Array, Stack, Queue, Linked List)
- [x] Sorting algorithms (Bubble, Selection, Insertion, Merge, Quick)
- [x] Searching algorithms (Linear, Binary, Hash)
- [x] Interactive controls and animations
- [x] Responsive UI design

### 🚧 In Development
- [ ] Tree algorithms and visualizations
- [ ] Graph algorithms and network representations
- [ ] Algorithm complexity analysis tools
- [ ] Performance comparison dashboards

### 🎯 Future Enhancements
- [ ] Code generation for algorithm implementations
- [ ] Customizable visualization themes
- [ ] Algorithm racing and competitions
- [ ] Save/load custom test cases
- [ ] Integration with LMS platforms

## 🎓 Course Integration

### SE2205A Alignment
This visualizer directly supports the SE2205A curriculum by providing:
- Hands-on experience with core data structures
- Visual understanding of algorithm efficiency
- Interactive problem-solving exercises
- Preparation for coding interviews and technical assessments

### Assessment Support
- Algorithm trace-through practice
- Complexity analysis reinforcement
- Data structure operation understanding
- Problem decomposition skills

## 📄 License

This project is developed for educational purposes as part of SE2205A: Algorithms and Data Structures.

## 🤝 Acknowledgments

- SE2205A course materials and specifications
- React and Vite communities for excellent tooling
- Framer Motion for smooth animations
- Tailwind CSS for responsive design system

---

**Course**: SE2205A - Algorithms and Data Structures  
**Institution**: Western University  
**Semester**: 2024 Fall