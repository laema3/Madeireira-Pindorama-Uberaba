import React, { useEffect } from 'react';
import { Products } from '../components/Products';
import { PageBanner } from '../components/PageBanner';
import { useLoader } from '../components/LoaderContext';

export function ProductsPage() {
  const { simulateLoading } = useLoader();

  useEffect(() => {
    window.scrollTo(0, 0);
    simulateLoading();
  }, []);
  
  return (
    <div>
      <PageBanner title="Produtos" />
      <div className="py-12">
        <Products />
      </div>
    </div>
  );
}
