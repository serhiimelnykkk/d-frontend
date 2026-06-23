import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { fetchArticleBySlug } from '../api/content';

const ArticlePage = () => {
  const { slug } = useParams();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug),
    retry: false,
  });

  if (isLoading) return <div className="text-center py-20">Завантаження статті...</div>;
  
  if (error || !article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Статтю не знайдено 😔</h2>
        <Link to="/" className="text-blue-600 hover:underline">Повернутися на головну</Link>
      </div>
    );
  }

  const normalizedContent = article.content?.replace(/(&nbsp;|\u00A0)/g, ' ') || article.content;

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      {article.coverImage && (
        <div className="w-full h-64 md:h-96 bg-gray-200">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <Link to={`/?category=${article.category?._id}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition">
            {article.category?.name}
          </Link>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{article.viewsCount} переглядів</span>
          <span>•</span>
          <span className="font-medium text-gray-900">Автор: {article.author?.username}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {article.title}
        </h1>

  
        <div 
          className="prose prose-lg max-w-none text-gray-800 break-words hyphens-none text-justify"
          dangerouslySetInnerHTML={{ __html: normalizedContent }}
        />

  
        {article.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Теги:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Link 
                  key={tag._id} 
                  to={`/?tag=${tag._id}`} 
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticlePage;