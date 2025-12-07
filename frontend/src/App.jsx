import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RFPCreation from './pages/RFPCreation';
import VendorManagement from './pages/VendorManagement';
import SendRFP from './pages/SendRFP';
import ProposalsDashboard from './pages/ProposalsDashboard';
import Comparison from './pages/Comparison';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProposalsDashboard />} />
        <Route path="create-rfp" element={<RFPCreation />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="send-rfp" element={<SendRFP />} />
        <Route path="comparison/:id" element={<Comparison />} />
      </Route>
    </Routes>
  );
}

export default App;
