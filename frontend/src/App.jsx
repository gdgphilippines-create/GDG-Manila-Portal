import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserView from './views/user/UserView';
import AdminView from './views/admin/AdminView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route for attendees */}
        <Route path="/" element={<UserView />} />

        {/* Private-ish route for you to control the event */}
        <Route path="/admin-panel" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
