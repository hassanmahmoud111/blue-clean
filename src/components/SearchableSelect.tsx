import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: (SelectOption | string)[];
  value?: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'اختر...',
  searchPlaceholder = 'ابحث...',
  disabled = false,
  allowClear = true,
  className = '',
  style,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options
  const normalizedOptions: SelectOption[] = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value));

  // Filter options based on search query
  const filteredOptions = normalizedOptions.filter(opt => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      opt.label.toLowerCase().includes(q) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  });

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const handleSelect = (val: string | number) => {
    onChange(String(val));
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`searchable-select-container ${className}`}
      style={{ position: 'relative', display: 'inline-block', width: '100%', ...style }}
    >
      {/* Trigger Box */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        className={`searchable-select-trigger ${isOpen ? 'active' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: 41,
          padding: '0 12px',
          border: '1px solid #d5e2e9',
          borderRadius: 8,
          background: disabled ? '#f5f8fa' : '#fff',
          color: selectedOption ? '#173e5d' : '#8fa2b2',
          fontSize: 12,
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          borderColor: isOpen ? '#0879a1' : '#d5e2e9',
          boxShadow: isOpen ? '0 0 0 3px rgba(8, 121, 161, 0.12)' : 'none',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {allowClear && selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={0}
              title="مسح الاختيار"
              onClick={handleClear}
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#e6edf1',
                color: '#526e82',
                cursor: 'pointer',
                transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#ffd8db';
                e.currentTarget.style.color = '#e02838';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#e6edf1';
                e.currentTarget.style.color = '#526e82';
              }}
            >
              <X size={11} strokeWidth={2.5} />
            </span>
          )}
          <ChevronDown
            size={15}
            style={{
              color: '#658095',
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s',
            }}
          />
        </span>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className="searchable-select-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#fff',
            border: '1px solid #d4e1e8',
            borderRadius: 9,
            boxShadow: '0 10px 28px rgba(8, 47, 75, 0.16)',
            overflow: 'hidden',
            animation: 'fadeIn 0.12s ease-out',
          }}
        >
          {/* Search Input Box */}
          <div
            style={{
              padding: '8px 10px',
              borderBottom: '1px solid #e7eff2',
              background: '#f8fbfc',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  right: 10,
                  color: '#899fae',
                  pointerEvents: 'none',
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  width: '100%',
                  height: 34,
                  padding: '0 32px 0 10px',
                  border: '1px solid #d5e2e9',
                  borderRadius: 6,
                  outline: 'none',
                  fontSize: 12,
                  color: '#133e5e',
                  background: '#fff',
                }}
              />
            </div>
          </div>

          {/* Options List */}
          <div
            style={{
              maxHeight: 210,
              overflowY: 'auto',
              padding: '4px 0',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontSize: 11,
                  color: '#768f9f',
                }}
              >
                لا توجد نتائج مطابقة
              </div>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: isSelected ? '#eaf4f8' : 'transparent',
                      color: isSelected ? '#0879a1' : '#143c5b',
                      fontSize: 12,
                      fontWeight: isSelected ? 700 : 500,
                      textAlign: 'right',
                      cursor: opt.disabled ? 'not-allowed' : 'pointer',
                      opacity: opt.disabled ? 0.5 : 1,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected && !opt.disabled) e.currentTarget.style.background = '#f4f9fb';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected && !opt.disabled) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {opt.icon}
                      <span>{opt.label}</span>
                    </span>
                    {opt.sublabel && (
                      <small style={{ fontSize: 10, color: '#688094' }}>{opt.sublabel}</small>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
