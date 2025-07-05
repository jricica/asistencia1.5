import Dashboard from './dashboard';
import StudentDashboard from './student-dashboard';
import { useUser } from '@/context/UserContext';
const DashboardRouter = () => {
    const { user } = useUser();
    if (user?.role === 'student') {
        return <StudentDashboard />;
    }
    return <Dashboard />;
};
export default DashboardRouter;
