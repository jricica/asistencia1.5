import Dashboard from './dashboard';
import StudentDashboard from './student-dashboard';
import { useUser } from '@/context/UserContext';

const DashboardRouter = () => {
  const { user } = useUser();
  console.log("🧠 user en DashboardRouter:", user);

  if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  if (!user) {
    return <div style={{ color: "red" }}>⚠️ No hay sesión activa</div>;
  }

  return <Dashboard />;
};

export default DashboardRouter;
