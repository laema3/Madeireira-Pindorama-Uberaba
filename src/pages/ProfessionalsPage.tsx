import React, { useEffect } from 'react';
import { Professionals } from '../components/Professionals';
import { PageBanner } from '../components/PageBanner';
import { useLoader } from '../components/LoaderContext';

export function ProfessionalsPage() {
  const { simulateLoading } = useLoader();

  useEffect(() => {
    window.scrollTo(0, 0);
    simulateLoading();
  }, []);

  return (
    <div>
      <PageBanner title="Profissionais" />
      <div className="py-12">
        <Professionals />
      </div>
    </div>
  );
}
