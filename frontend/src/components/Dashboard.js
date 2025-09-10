import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EnhancedMap from './EnhancedMap';
import FIRModal from './FIRModal';
import SettingsPage from './SettingsPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ onLogout }) => {
  const [stats, setStats] = useState(null);
  const [tourists, setTourists] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [isFIRModalOpen, setIsFIRModalOpen] = useState(false);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      // Initialize sample data first
      await axios.post(`${API}/init-sample-data`);
      
      // Then fetch all data
      await fetchData();
    } catch (err) {
      console.error('Error initializing dashboard:', err);
      setError('Failed to initialize dashboard');
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const [statsRes, touristsRes, incidentsRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, { headers }),
        axios.get(`${API}/tourists`, { headers }),
        axios.get(`${API}/incidents`, { headers })
      ]);

      setStats(statsRes.data);
      setTourists(touristsRes.data);
      setIncidents(incidentsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getSafetyScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const getZoneColor = (zoneType) => {
    switch (zoneType) {
      case 'safe': return '#22c55e';
      case 'caution': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
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
          <button onClick={fetchData} className="ml-4 px-4 py-2 bg-blue-600 rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Tourist Safety Monitoring System</h1>
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
                <div className="stat-change positive">+12% from last week</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-title">Active Tourists</div>
                <div className="stat-value">{stats?.active_tourists || 0}</div>
                <div className="stat-change positive">All accounted for</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-title">Missing Reports</div>
                <div className="stat-value">{stats?.missing_tourists || 0}</div>
                <div className="stat-change negative">0 active cases</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-title">Emergency Alerts</div>
                <div className="stat-value">{stats?.emergency_incidents || 0}</div>
                <div className="stat-change negative">Under investigation</div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="main-grid">
              {/* Map Container */}
              <div className="map-container fade-in">
                <h2 className="map-title">Tourist Safety Map</h2>
                <EnhancedMap tourists={tourists} />
              </div>

              {/* Zone Scores */}
              <div className="zone-scores fade-in">
                <h3>Zone Safety Scores</h3>
                <div className="zone-item">
                  <div className="zone-info">
                    <h4>Safe Zone</h4>
                    <p>Low risk areas</p>
                  </div>
                  <div className="zone-score safe">85</div>
                </div>
                <div className="zone-item">
                  <div className="zone-info">
                    <h4>Caution Zone</h4>
                    <p>Moderate risk areas</p>
                  </div>
                  <div className="zone-score caution">67</div>
                </div>
                <div className="zone-item">
                  <div className="zone-info">
                    <h4>Danger Zone</h4>
                    <p>High risk areas</p>
                  </div>
                  <div className="zone-score danger">40</div>
                </div>
              </div>
            </div>

            {/* Tourists Section */}
            <div className="tourists-section fade-in">
              <h2 className="section-title">Current Tourist Locations</h2>
              <div className="space-y-3">
                {tourists.map((tourist, index) => (
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="section-title">Incident Reports & FIRs</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                + New FIR
              </button>
            </div>
            <div className="space-y-4">
              {incidents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-400 text-lg">No incidents reported</p>
                  <p className="text-gray-500 text-sm mt-2">All tourists are safe and accounted for</p>
                </div>
              ) : (
                incidents.map((incident) => (
                  <div key={incident.id} className="stat-card hover:border-blue-400/40 transition-all duration-300 cursor-pointer" 
                       onClick={() => {
                         setSelectedFIR(incident);
                         setIsFIRModalOpen(true);
                       }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                            {incident.type === 'panic' ? '🚨' : 
                             incident.type === 'medical' ? '🏥' : 
                             incident.type === 'missing' ? '🔍' : '⚠️'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-lg capitalize">{incident.type} Alert</h4>
                            <p className="text-sm text-gray-400">FIR #{incident.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-3 leading-relaxed">{incident.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-400">
                            <strong>Tourist ID:</strong> {incident.tourist_id.slice(0, 12)}...
                          </span>
                          <span className="text-gray-400">
                            <strong>Location:</strong> Lat {incident.location?.lat}, Lng {incident.location?.lng}
                          </span>
                          <span className="text-gray-400">
                            <strong>Reported:</strong> {new Date(incident.reported_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold border mb-2 ${
                          incident.status === 'open' ? 'text-red-400 bg-red-400/20 border-red-400/30' :
                          incident.status === 'investigating' ? 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30' :
                          'text-green-400 bg-green-400/20 border-green-400/30'
                        }`}>
                          {incident.status.toUpperCase()}
                        </div>
                        <div className={`text-sm font-semibold ${
                          incident.severity === 'critical' ? 'text-red-400' :
                          incident.severity === 'high' ? 'text-orange-400' :
                          incident.severity === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {incident.severity.toUpperCase()} PRIORITY
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Click to view FIR details
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="fade-in">
            <h2 className="section-title">System Settings</h2>
            <div className="stat-card">
              <p className="text-gray-300">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;