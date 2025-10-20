import React from 'react';
import ConversionForm from '../components/ConversionForm';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Analytics Dashboard</h1>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Conversion Rate Calculator</h2>
          <ConversionForm />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
