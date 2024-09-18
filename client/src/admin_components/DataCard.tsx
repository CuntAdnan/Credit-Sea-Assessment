import React from 'react';

interface DataCardProps {
  firstPartitionContent: React.ReactNode;
  secondPartitionContent: {
    top: React.ReactNode;
    bottom: React.ReactNode;
  };
}

const DataCard: React.FC<DataCardProps> = ({ firstPartitionContent, secondPartitionContent }) => {
  return (
    <div className="flex mt-6 h-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
      <div className="w-1/2 bg-gray-700 p-4 flex items-center justify-center">
        {firstPartitionContent}
      </div>
      <div className="w-1/2 bg-gray-600 p-4 flex flex-col justify-between">
        <div className="flex items-center justify-center text-sm text-gray-300">
          {secondPartitionContent.top}
        </div>
        <div className="flex items-center justify-center text-lg text-gray-100">
          {secondPartitionContent.bottom}
        </div>
      </div>
    </div>
  );
}

export default DataCard;
