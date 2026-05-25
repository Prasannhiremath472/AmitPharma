import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { debounce } from '../../utils/helpers';

const SearchBar = ({ autoFocus = false, placeholder = 'Search medicines, health products...' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className={`flex items-center bg-slate-50 border-2 rounded-xl transition-all duration-200 ${isFocused ? 'border-primary-400 bg-white shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
        <FiSearch className="ml-3 text-slate-400 text-lg flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
        />
        {query && (
          <button type="button" onClick={clearSearch} className="mr-2 p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <FiX className="text-base" />
          </button>
        )}
        <button
          type="submit"
          className="mr-1 px-3 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
