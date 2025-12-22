import React, { useState } from 'react';

export const VirtualizedStep1 = () => {
  const [showProblem, setShowProblem] = useState(false);
  const [itemCount, setItemCount] = useState(100);

  // Generate items
  const items = Array.from({ length: itemCount }, (_, i) => ({
    id: i,
    text: `Item ${i + 1}`
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Step 1: Understanding the Problem
          </h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Why Do We Need Virtualization?
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Imagine you have a list with 10,000 items. If you render all of them to the DOM at once, 
              your browser needs to:
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Create 10,000 DOM nodes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Calculate layout for all 10,000 elements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Paint all 10,000 elements (even invisible ones)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Keep all 10,000 in memory</span>
                </li>
              </ul>
            </div>

            <p className="text-lg text-gray-600 mb-6">
              <strong>Result:</strong> Slow initial render, laggy scrolling, high memory usage, poor UX.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Let's See It In Action
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                How many items to render?
              </label>
              <input 
                type="range" 
                min="100" 
                max="5000" 
                step="100"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-xl font-bold text-indigo-600 mt-2">
                {itemCount} items
              </div>
            </div>

            <button
              onClick={() => setShowProblem(true)}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mb-4"
            >
              Render All {itemCount} Items (No Virtualization)
            </button>

            {showProblem && (
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 border-b border-gray-300">
                  <div className="text-sm font-mono text-gray-600">
                    📊 DOM Nodes Created: {itemCount}
                  </div>
                </div>
                
                <div 
                  className="h-96 overflow-y-auto bg-white"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {items.map(item => (
                    <div 
                      key={item.id}
                      className="p-4 border-b border-gray-200 hover:bg-gray-50"
                    >
                      <div className="font-medium text-gray-800">
                        {item.text}
                      </div>
                      <div className="text-sm text-gray-500">
                        This is item #{item.id} - All {itemCount} items are in the DOM right now!
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <h3 className="font-bold text-gray-800 mb-2">🤔 The Key Insight</h3>
            <p className="text-gray-700">
              You can only see maybe 5-10 items on screen at once. Why render all {itemCount}? 
              That's where <strong>virtualization</strong> comes in - we only render what's visible!
            </p>
          </div>

          <div className="mt-8 text-center">
            <div className="text-gray-600 mb-2">Ready to see the solution?</div>
            <div className="text-2xl">👉 Next: How Virtualization Works</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedStep1;