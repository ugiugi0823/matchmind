// src/components/FieldSelector.tsx
import { useState } from 'react';
import PlayerSearch from './PlayerSearch';

export default function FieldSelector({
  onSelect,
  onPlayerSelect,
}: {
  onSelect: (x: number, y: number) => void;
  onPlayerSelect: (id: number, name: string) => void;
}) {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        onSelect(parseFloat(x.toFixed(3)), parseFloat(y.toFixed(3)));
      };

  return (
    <>
      <PlayerSearch onSelect={onPlayerSelect} />

      <div
        onClick={handleClick}
        style={{
            position: 'relative',
            width: 500,
            height: 250,
            backgroundColor: '#6ab150',
            border: '2px solid #333',
            borderRadius: 8,
            cursor: 'crosshair',
            marginBottom: 10,
            boxShadow: 'inset 0 0 0 2px white',
        }}
        >
        {/* 센터 서클 */}
        <div
            style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 60,
            height: 60,
            marginLeft: -30,
            marginTop: -30,
            border: '2px solid white',
            borderRadius: '50%',
            }}
        />
        {/* 센터 라인 */}
        <div
            style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: 2,
            height: '100%',
            backgroundColor: 'white',
            }}
        />
        {/* 왼쪽 골문 */}
        <div
            style={{
            position: 'absolute',
            top: '35%',
            left: 0,
            width: 20,
            height: '30%',
            border: '2px solid white',
            borderLeft: 'none',
            }}
        />
        {/* 오른쪽 골문 */}
        <div
            style={{
            position: 'absolute',
            top: '35%',
            right: 0,
            width: 20,
            height: '30%',
            border: '2px solid white',
            borderRight: 'none',
            }}
        />

        <p
            style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textShadow: '1px 1px 2px black',
            }}
        >
            ⚽ 클릭하여 위치 선택
        </p>
        </div>

    </>
  );
}
