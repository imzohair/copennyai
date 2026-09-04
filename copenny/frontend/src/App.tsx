import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Timeline } from './components/Timeline';

function App() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212]">
        <Topbar />
        <Timeline />
      </div>
    </div>
  );
}

export default App;
