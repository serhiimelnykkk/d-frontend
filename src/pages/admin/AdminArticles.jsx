import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteArticle, fetchAdminArticles } from '../../api/content';

const AdminArticles = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminArticles', page],
    queryFn: () => fetchAdminArticles(page),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArticles']);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Ви точно хочете видалити цю статтю?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (article) => {
    navigate(`/admin/edit/${article._id}`, { state: { article } });
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Всі новини</h2>
        <Link to="/admin/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Створити
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Заголовок</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категорія</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Автор</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.articles?.map((article) => (
              <tr key={article._id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  <div className="text-sm text-gray-500 truncate w-48">{article.excerpt}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.category?.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.author?.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {article.status === 'published' ? 'Опубліковано' : 'Чернетка'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleEdit(article)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Ред.
                  </button>
                  <button onClick={() => handleDelete(article._id)} className="text-red-600 hover:text-red-900">
                    Вид.
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Назад
        </button>
        <span>Сторінка {page} з {data?.pages || 1}</span>
        <button
          onClick={() => setPage((old) => (data?.pages > old ? old + 1 : old))}
          disabled={page === data?.pages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Далі
        </button>
      </div>
    </div>
  );
};

export default AdminArticles;