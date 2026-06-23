import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createArticle, fetchArticleById, fetchCategories, fetchTags, updateArticle } from '../../api/content';

const ArticleEditor = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const initialData = location.state?.article || {};

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    slug: initialData.slug || '',
    excerpt: initialData.excerpt || '',
    content: initialData.content || '',
    coverImage: initialData.coverImage || '',
    category: initialData.category?._id || '',
    tags: initialData.tags?.filter(t => t)?.map(t => t._id) || [],
    status: initialData.status || 'draft',
  });

  const { data: fetchedArticle } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(id),
    enabled: isEditMode && !location.state?.article,
  });

  useEffect(() => {
    if (fetchedArticle) {
      setFormData({
        title: fetchedArticle.title || '',
        slug: fetchedArticle.slug || '',
        excerpt: fetchedArticle.excerpt || '',
        content: fetchedArticle.content || '',
        coverImage: fetchedArticle.coverImage || '',
        category: fetchedArticle.category?._id || '',
        tags: fetchedArticle.tags?.filter(t => t)?.map(t => t._id) || [],
        status: fetchedArticle.status || 'draft',
      });
    }
  }, [fetchedArticle]);

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: tags } = useQuery({ queryKey: ['tags'], queryFn: fetchTags });

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArticles']);
      navigate('/admin');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArticles']);
      navigate('/admin');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateMutation.mutate({ id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleTagChange = (tagId) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags: newTags };
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Редагувати новину' : 'Створити новину'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (необов'язково)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            placeholder="Залиште пустим для автогенерації"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Короткий опис (Excerpt)</label>
          <textarea
            required
            rows="3"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Посилання на зображення</label>
          <input
            type="url"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.coverImage}
            onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
            <select
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Оберіть категорію</option>
              {categories?.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="draft">Чернетка</option>
              <option value="published">Опубліковано</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Теги</label>
          <div className="flex flex-wrap gap-3">
            {tags?.map(tag => (
              <label key={tag._id} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-600 h-4 w-4 mr-2"
                  checked={formData.tags.includes(tag._id)}
                  onChange={() => handleTagChange(tag._id)}
                />
                <span className="text-sm">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Зміст статті</label>
          <div className="bg-white">
            <ReactQuill 
              theme="snow" 
              value={formData.content} 
              onChange={(content) => setFormData({...formData, content})}
              className="h-64 mb-12"
            />
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {createMutation.isPending || updateMutation.isPending ? 'Збереження...' : (isEditMode ? 'Оновити новину' : 'Створити новину')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-3 border rounded-md hover:bg-gray-50 transition"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;