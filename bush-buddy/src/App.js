// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthScreen from './pages/AuthScreen'; // First screen you're migrating

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        {/* Add other screens here as you migrate */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
