import React from 'react';

export default function Skeleton({ className = '', width, height, circle = false, count = 1 }) {
  const style = {
    width: width,
    height: height,
    borderRadius: circle ? '50%' : undefined
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
