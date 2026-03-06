import React, { useEffect } from 'react';
import { ServiceAreas } from '../components/ServiceAreas';
import { PageBanner } from '../components/PageBanner';
import { useLoader } from '../components/LoaderContext';

export function ServiceAreasPage() {
  const { simulateLoading } = useLoader();

  useEffect(() => {
    window.scrollTo(0, 0);
    simulateLoading();
  }, []);

  return (
    <div>
      <PageBanner title="Atuação" />
      <div className="py-12">
        <ServiceAreas />
      </div>
    </div>
  );
}
