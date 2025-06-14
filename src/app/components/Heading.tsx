import React from 'react';

type HeadingProps = {
  children: React.ReactNode;
  as?: 'h1' | 'h2';
};

export function Heading({ children, as = 'h1' }: HeadingProps) {
  const Tag = as;
  return (
    <Tag className="text-3xl sm:text-4xl font-bold text-center text-pokemon-blue dark:text-pokemon-yellow [text-shadow:_1px_1px_2px_rgb(0_0_0_/_10%)] dark:[text-shadow:_1px_1px_2px_rgb(255_255_255_/_10%)] mb-6">
      {children}
    </Tag>
  );
} 