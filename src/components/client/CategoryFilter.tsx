import React from 'react';
import { Search, X } from 'lucide-react';
import { Category } from '../../types/restaurant';
import { useRestaurant } from '../../context/RestaurantContext';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const { settings, products } = useRestaurant();
  const primaryColor = settings.visual.primaryColor || '#E11D48';

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="input-search-products"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar no cardápio (ex: burger, costela, suco)..."
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-neutral-200 rounded-xl placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/20 focus:border-neutral-400 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            id="btn-clear-search"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Category Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        <button
          id="category-pill-all"
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs ${
            selectedCategoryId === 'all'
              ? 'text-white shadow-sm scale-102'
              : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-900'
          }`}
          style={selectedCategoryId === 'all' ? { backgroundColor: primaryColor } : undefined}
        >
          <span>🍽️</span>
          <span>Todos</span>
          <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${
            selectedCategoryId === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
          }`}>
            {products.length}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const count = products.filter(p => p.categoryId === cat.id).length;

          return (
            <button
              key={cat.id}
              id={`category-pill-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs ${
                isSelected
                  ? 'text-white shadow-sm scale-102'
                  : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              style={isSelected ? { backgroundColor: primaryColor } : undefined}
            >
              {cat.icon && <span>{cat.icon}</span>}
              <span>{cat.name}</span>
              <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
