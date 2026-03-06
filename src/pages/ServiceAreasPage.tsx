import React, { useEffect } from 'react';
import { ServiceAreas } from '../components/ServiceAreas';

export function ServiceAreasPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-12">
      <ServiceAreas />
    </div>
  );
}
