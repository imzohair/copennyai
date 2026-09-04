import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Timeline } from './components/Timeline';
import { Filter, Goals, Investments, Reports, Settings } from './components/Pages';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212]">
          <Topbar />
          <Routes>
            <Route path="/" element={<Timeline />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
