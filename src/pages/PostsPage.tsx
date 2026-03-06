import React, { useEffect } from 'react';
import { Posts } from '../components/Posts';

export function PostsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-12">
      <Posts />
    </div>
  );
}
