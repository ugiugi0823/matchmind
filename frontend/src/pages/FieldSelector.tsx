import React from 'react';

export default function FieldSelector({ onSelect }: { onSelect: (x: number, y: number) => void }) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onSelect(parseFloat(x.toFixed(3)), parseFloat(y.toFixed(3)));
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: 500,
        height: 250,
        backgroundColor: '#6ab150',
        border: '2px solid black',
        cursor: 'crosshair',
        marginBottom: 10,
        position: 'relative',
      }}
    >
      <p style={{ color: 'white', textAlign: 'center', paddingTop: 100 }}>축구장</p>
    </div>
  );
}
