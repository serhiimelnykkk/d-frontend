import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      <Link to={`/articles/${article.slug}`} className="block relative aspect-video overflow-hidden bg-gray-200">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
            {article.category?.name}
          </span>
        </div>
      </Link>

      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/articles/${article.slug}`} className="block mb-2 group">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{article.author?.username}</span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-1">
            {article.tags?.slice(0, 2).map(tag => (
              <span key={tag._id} className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;