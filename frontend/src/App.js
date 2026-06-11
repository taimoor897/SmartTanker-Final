import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';

import Dashboard from './Dashboard';
import BookingPage from './BookingModule';
import PaymentPage from './PaymentPage';
import CoverageMapPage from './CoverageMapPage';
import ComplaintPage from './ComplaintPage';
import AdminComplaints from './AdminComplaints';
import AdminCustomers from './AdminCustomers';
import AdminProviders from './AdminProviders';

import GPSModule from './GPSModule';
import TankerProviderDashboard from './TankerProviderDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<BookingPage />} /> {/* ✅ used */}
        <Route path="/payment" element={<PaymentPage />} />
       
        <Route path="/gpstracking" element={<GPSModule />} />
        <Route path="/provider-dashboard" element={<TankerProviderDashboard />} />
        <Route path="/complaint" element={<ComplaintPage />}/>
        <Route path="/admin" element={<AdminComplaints />} />
        <Route path="/coverage-map" element={<CoverageMapPage />} />
        <Route
  path="/admin/customers"
  element={<AdminCustomers />}
/>

<Route
  path="/admin/providers"
  element={<AdminProviders />}
/>

      </Routes>
    </Router>
  );
}

export default App;