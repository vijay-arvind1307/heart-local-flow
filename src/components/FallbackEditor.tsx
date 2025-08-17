import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface FallbackEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FallbackEditor: React.FC<FallbackEditorProps> = ({ value, onChange, placeholder }) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-[200px] bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus:border-red-500"
    />
  );
};

export default FallbackEditor;
