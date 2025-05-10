import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShootTest from './pages/ShootTest';
import Rankers from './pages/Rankers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shoot" element={<ShootTest />} />
        <Route path="/rankers" element={<Rankers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
