
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'personal', label: 'Pribadi' },
    { value: 'work', label: 'Kerja' },
    { value: 'school', label: 'Sekolah' },
  ];

  return (
    <div className="space-y-3 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari tugas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.value)}
            className={`whitespace-nowrap ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white'
                : 'text-gray-600'
            }`}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter;
