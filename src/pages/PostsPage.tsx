import React, { useEffect } from 'react';
import { Posts } from '../components/Posts';
import { PageBanner } from '../components/PageBanner';
import { useLoader } from '../components/LoaderContext';

export function PostsPage() {
  const { simulateLoading } = useLoader();

  useEffect(() => {
    window.scrollTo(0, 0);
    simulateLoading();
  }, []);

  return (
    <div>
      <PageBanner title="Dicas" />
      <div className="py-12">
        <Posts />
      </div>
    </div>
  );
}
