import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path 
    ? "bg-blue-600 text-white" 
    : "text-gray-700 hover:bg-gray-100";

  return (
    <div className="flex flex-col md:flex-row min-h-[500px] gap-6">
      <aside className="w-full md:w-64 bg-white shadow-sm rounded-lg p-4 h-fit">
        <nav className="space-y-2">
          <Link to="/admin" className={`block px-4 py-2 rounded-md font-medium transition ${isActive('/admin')}`}>
            Всі статті
          </Link>
          <Link to="/admin/create" className={`block px-4 py-2 rounded-md font-medium transition ${isActive('/admin/create')}`}>
            Створити новину
          </Link>
          <div className="border-t my-2"></div>
          <Link to="/admin/categories" className={`block px-4 py-2 rounded-md font-medium transition ${isActive('/admin/categories')}`}>
            Категорії
          </Link>
          <Link to="/admin/tags" className={`block px-4 py-2 rounded-md font-medium transition ${isActive('/admin/tags')}`}>
            Теги
          </Link>
        </nav>
      </aside>

      <div className="flex-1 bg-white shadow-sm rounded-lg p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;