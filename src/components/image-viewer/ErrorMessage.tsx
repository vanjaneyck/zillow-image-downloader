import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mb-6 text-red-600 bg-red-50 p-4 rounded-lg">
      <p className="text-sm">{message}</p>
    </div>
  );
}