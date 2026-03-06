import React, { useEffect } from 'react';
import { Professionals } from '../components/Professionals';

export function ProfessionalsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-12">
      <Professionals />
    </div>
  );
}
