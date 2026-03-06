import React, { useEffect } from 'react';
import { Works } from '../components/Works';

export function WorksPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="py-12">
      <Works />
    </div>
  );
}
