import { memo } from 'react'

function CategoryTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="mb-8 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-none rounded-full px-6 py-2 font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(CategoryTabs)