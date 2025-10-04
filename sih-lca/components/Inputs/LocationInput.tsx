import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { indianLocations } from '@/lib/data/cities';
interface LocationInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter Indian city or village...',
  className = '',
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.length > 1) {
      const filtered = indianLocations.filter(location =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && isFocused);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [inputValue, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange?.(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="">
      <div className="w-full space-y-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Location in India
        </label>
        
        <div className={`relative ${className}`}>
          {/* Location icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <MapPin size={18} />
          </div>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full pl-10 pr-10 py-3 
              bg-gray-800 
              border border-gray-700 
              rounded-lg 
              text-gray-100 
              placeholder-gray-400
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500 
              focus:border-transparent
              disabled:opacity-50 
              disabled:cursor-not-allowed
              transition-all duration-200
              ${isFocused ? 'bg-gray-750 shadow-lg' : 'hover:bg-gray-750'}
              ${showSuggestions ? 'rounded-b-none' : ''}
            `}
          />

          {/* Dropdown arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ChevronDown size={18} className={`transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`} />
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 border-t-0 rounded-b-lg shadow-lg z-20 max-h-64 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                    px-4 py-3 cursor-pointer flex items-center space-x-3
                    hover:bg-gray-700 transition-colors duration-150
                    ${index === selectedIndex ? 'bg-gray-700' : ''}
                    ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg' : ''}
                  `}
                >
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-100 truncate">{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-500 mt-2">
          Start typing to see suggestions for Indian cities and villages
        </p>


      </div>
    </div>
  );
};

export default LocationInput;
