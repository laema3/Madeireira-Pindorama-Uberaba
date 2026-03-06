import React, { useEffect } from 'react';
import { Works } from '../components/Works';
import { PageBanner } from '../components/PageBanner';
import { useLoader } from '../components/LoaderContext';

export function WorksPage() {
  const { simulateLoading } = useLoader();

  useEffect(() => {
    window.scrollTo(0, 0);
    simulateLoading();
  }, []);
  
  return (
    <div>
      <PageBanner title="Nossas Obras" />
      <div className="py-12">
        <Works />
      </div>
    </div>
  );
}
