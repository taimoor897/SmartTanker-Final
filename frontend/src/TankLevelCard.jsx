import React from 'react';

export default function TankLevelCard({ level }) {
  return (
    <div className="bg-blue-100 p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold">Tank Level</h2>
      <p className="text-2xl">{level}%</p>
      {level < 30 && <p className="text-red-500">⚠ Low Water Level</p>}
    </div>
  );
}
