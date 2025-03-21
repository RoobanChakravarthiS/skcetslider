import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import UserCarousel from './components/UserPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<UserCarousel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;