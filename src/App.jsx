import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminArticles from './pages/admin/AdminArticles';
import AdminLayout from './pages/admin/AdminLayout';
import ArticleEditor from './pages/admin/ArticleEditor';
import Categories from './pages/admin/Categories';
import Tags from './pages/admin/Tags';
import ArticlePage from './pages/ArticlePage';
import Home from './pages/Home';
import Login from './pages/Login';
import { logout } from './redux/slices/authSlice';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
            News Portal
          </Link>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium">
                  Адмін-панель
                </Link>
                <div className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {user?.username}
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
                >
                  Вийти
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                Увійти
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'editor']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminArticles />} />
            <Route path="create" element={<ArticleEditor />} />
            <Route path="edit/:id" element={<ArticleEditor />} />
            
            <Route path="categories" element={<Categories />} />
            <Route path="tags" element={<Tags />} />
            
          </Route>
        </Routes>
      </main>

      <footer className="bg-white py-4 mt-auto border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} News Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;