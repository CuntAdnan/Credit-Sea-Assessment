import React, { useState } from 'react';
import { Input } from "@/components/ui/input"; // Ensure this path is correct

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="flex justify-center p-4">
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full max-w-md"
      />
    </div>
  );
};

export default SearchBar;
