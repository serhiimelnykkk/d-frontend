import api from './axios';

export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

export const createCategory = async (categoryData) => {
  const { data } = await api.post('/categories', categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

export const fetchTags = async () => {
  const { data } = await api.get('/tags');
  return data;
};

export const createTag = async (tagData) => {
  const { data } = await api.post('/tags', tagData);
  return data;
};

export const deleteTag = async (id) => {
  const { data } = await api.delete(`/tags/${id}`);
  return data;
};

export const fetchAdminArticles = async (page = 1) => {
  const { data } = await api.get(`/articles/admin?page=${page}`);
  return data;
};

export const fetchArticleById = async (id) => {
  const { data } = await api.get(`/articles/admin/${id}`);
  return data;
};

// Виправлення: Давайте просто додамо метод create і update.
export const createArticle = async (articleData) => {
  const { data } = await api.post('/articles', articleData);
  return data;
};

export const updateArticle = async ({ id, data }) => {
  const response = await api.put(`/articles/admin/${id}`, data);
  return response.data;
};

export const deleteArticle = async (id) => {
  const { data } = await api.delete(`/articles/admin/${id}`);
  return data;
};

export const fetchArticles = async (params) => {
  const { data } = await api.get('/articles', { params });
  return data;
};

export const fetchArticleBySlug = async (slug) => {
  const { data } = await api.get(`/articles/${slug}`);
  return data;
};