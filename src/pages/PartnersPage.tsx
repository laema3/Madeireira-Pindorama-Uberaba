import React, { useEffect } from 'react';
import { Partners } from '../components/Partners';

export function PartnersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-12">
      <Partners />
    </div>
  );
}
