import React, { useEffect } from 'react';
import { Partners } from '../components/Partners';
import { PageBanner } from '../components/PageBanner';
import { useLoader } from '../components/LoaderContext';

export function PartnersPage() {
  const { simulateLoading } = useLoader();

  useEffect(() => {
    window.scrollTo(0, 0);
    simulateLoading();
  }, []);

  return (
    <div>
      <PageBanner title="Parceiros" />
      <div className="py-12">
        <Partners />
      </div>
    </div>
  );
}
