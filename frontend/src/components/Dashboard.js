import React, { useState, useEffect } from 'react';
import EnhancedMap from './EnhancedMap';
import FIRModal from './FIRModal';
import SettingsPage from './SettingsPage';

const Dashboard = ({ onLogout }) => {
  const [stats, setStats] = useState(null);
  const [tourists, setTourists] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [isFIRModalOpen, setIsFIRModalOpen] = useState(false);

  // Load mock data only once
  useEffect(() => {
    try {
      setStats({
        total_tourists: 25,
        active_tourists: 22,
        missing_tourists: 1,
        emergency_incidents: 2,
      });

      setTourists([
        {
          id: 't1',
          name: 'Alice Johnson',
          nationality: 'USA',
          hotel_name: 'Taj Palace',
          itinerary: 'Mumbai → Goa',
          status: 'active',
          safety_score: 85,
          zone_type: 'safe',
          location: { lat: 19.076, lng: 72.8777 },
        },
        {
          id: 't2',
          name: 'Rajesh Kumar',
          nationality: 'India',
          hotel_name: 'Marriott',
          itinerary: 'Delhi → Jaipur',
          status: 'active',
          safety_score: 67,
          zone_type: 'caution',
          location: { lat: 28.7041, lng: 77.1025 },
        },
      ]);

      setIncidents([
        {
          id: 'i1',
          type: 'missing',
          description: 'Tourist not seen since yesterday evening.',
          tourist_id: 't1',
          location: { lat: 19.1, lng: 72.9 },
          reported_at: new Date().toISOString(),
          status: 'open',
          severity: 'high',
        },
      ]);

      setLoading(false);
    } catch (err) {
      console.error('Error initializing dashboard:', err);
      setError('Failed to load mock data');
      setLoading(false);
    }
  }, []);

  const getSafetyScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const getZoneColor = (zoneType) => {
    switch (zoneType) {
      case 'safe':
        return '#22c55e';
      case 'caution':
        return '#f59e0b';
      case 'danger':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">SahYatri</h1>
        <nav className="dashboard-nav">
          <div
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </div>
          <div
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </div>
          <div
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card fade-in">
                <div className="stat-title">Total Tourists</div>
                <div className="stat-value">{stats?.total_tourists || 0}</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-title">Active Tourists</div>
                <div className="stat-value">{stats?.active_tourists || 0}</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-title">Missing Reports</div>
                <div className="stat-value">{stats?.missing_tourists || 0}</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-title">Emergency Alerts</div>
                <div className="stat-value">{stats?.emergency_incidents || 0}</div>
              </div>
            </div>

            {/* Map + Tourists */}
            <div className="main-grid">
              <div className="map-container fade-in">
                <h2 className="map-title">Tourist Safety Map</h2>
                <EnhancedMap tourists={tourists} />
              </div>

              <div className="tourists-section fade-in">
                <h2 className="section-title">Current Tourist Locations</h2>
                {tourists.map((tourist) => (
                  <div key={tourist.id} className="tourist-item">
                    <div className="tourist-info">
                      <h4>{tourist.name}</h4>
                      <p>{tourist.nationality} • {tourist.hotel_name}</p>
                      <p className="text-xs mt-1">{tourist.itinerary}</p>
                    </div>
                    <div className="tourist-status">
                      <div className={`status-badge ${tourist.status}`}>
                        {tourist.status}
                      </div>
                      <div className={`safety-score-badge ${getSafetyScoreClass(tourist.safety_score)}`}>
                        Score: {tourist.safety_score}
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getZoneColor(tourist.zone_type) }}
                        title={`${tourist.zone_type} zone`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <div className="fade-in">
            <h2 className="section-title">Incident Reports & FIRs</h2>
            {incidents.length === 0 ? (
              <div>No incidents reported</div>
            ) : (
              incidents.map((incident) => (
                <div key={incident.id} className="stat-card"
                     onClick={() => {
                       setSelectedFIR(incident);
                       setIsFIRModalOpen(true);
                     }}>
                  <h4>{incident.type} Alert</h4>
                  <p>{incident.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}

        {/* FIR Modal */}
        <FIRModal
          isOpen={isFIRModalOpen}
          onClose={() => {
            setIsFIRModalOpen(false);
            setSelectedFIR(null);
          }}
          firData={selectedFIR}
        />
      </main>
    </div>
  );
};

export default Dashboard;
