import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">AgenticCare</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.full_name} —{' '}
            <span className="text-indigo-600 font-medium capitalize">{user?.role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 px-4">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {user?.full_name} 👋
          </h2>
          <p className="text-gray-500 mb-6">Role: <span className="font-medium capitalize text-indigo-600">{user?.role}</span></p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['Symptoms', 'Specialists', 'Appointments', 'Travel'].map((item) => (
              <div
                key={item}
                className="bg-indigo-50 rounded-xl p-5 text-center cursor-pointer hover:bg-indigo-100 transition"
              >
                <p className="text-indigo-700 font-semibold">{item}</p>
                <p className="text-xs text-gray-400 mt-1">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}