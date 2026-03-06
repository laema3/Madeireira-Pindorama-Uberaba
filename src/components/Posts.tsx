import React, { useState } from 'react';
import { useData } from './DataContext';
import { X } from 'lucide-react';

export function Posts() {
  const { posts } = useData();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  if (!posts || posts.length === 0) {
    return null;
  }

  // Show only up to 6 posts on the homepage
  const displayedPosts = posts.slice(0, 6);

  return (
    <section id="dicas" className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">Dicas e Novidades</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Acompanhe nossas dicas, tendências e novidades do setor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedPost(post)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Sem+Imagem';
                  }}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-stone-600 line-clamp-3 mb-6 flex-1 leading-relaxed">{post.content}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPost(post);
                  }}
                  className="w-full py-3 px-4 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  LEIA MAIS
                  <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-stone-600 hover:text-emerald-900 hover:bg-white transition z-10 shadow-sm"
            >
              <X size={24} />
            </button>
            
            <div className="overflow-y-auto flex-1 rounded-2xl">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-64 md:h-80 object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/800x400?text=Sem+Imagem';
                }}
              />
              <div className="p-8">
                <h2 className="text-3xl font-bold text-emerald-900 mb-6">{selectedPost.title}</h2>
                <div className="prose prose-emerald max-w-none text-stone-700 whitespace-pre-wrap">
                  {selectedPost.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
