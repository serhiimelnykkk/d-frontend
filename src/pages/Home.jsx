import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchArticles, fetchCategories } from '../api/content';
import ArticleCard from '../components/articles/ArticleCard';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);

  const { data, isLoading } = useQuery({
    queryKey: ['articles', page, categoryId, search],
    queryFn: () => fetchArticles({ page, limit: 9, category: categoryId, search }),
    keepPreviousData: true,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, category: categoryId, page: 1 });
  };

  const handleCategoryChange = (catId) => {
    setSearchParams({ category: catId, search: '', page: 1 });
    setSearchInput('');
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, category: categoryId, search });
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              !categoryId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Всі новини
          </button>
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                categoryId === cat._id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Пошук новин..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition">
            Пошук
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Завантаження новин...</div>
      ) : data?.articles?.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-lg">
          Новин за вашим запитом не знайдено 😔
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data?.articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          {data?.pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50 transition"
              >
                ← Назад
              </button>
              <span className="px-4 py-2 bg-white border rounded">
                {page} / {data.pages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.pages}
                className="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Далі →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;