import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Tasks from './pages/Tasks';
import Vendors from './pages/Vendors';
import Guests from './pages/Guests';
import Timeline from './pages/Timeline';
import Documents from './pages/Documents';
import Settings from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
