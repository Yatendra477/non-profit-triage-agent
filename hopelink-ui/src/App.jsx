/**
 * App.jsx — root component.
 * Wraps the page layout (Navbar + Dashboard + Footer).
 * Theme is initialized by the Navbar via useTheme hook.
 */
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-300">
      <Navbar />
      <div className="flex-1">
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
}
