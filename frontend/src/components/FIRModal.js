import React from 'react';

const FIRModal = ({ isOpen, onClose, firData }) => {
  if (!isOpen || !firData) return null;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'investigating': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'resolved': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'closed': return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
      default: return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-filter backdrop-blur-20 border border-blue-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-blue-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              FIR Details
            </h2>
            <p className="text-blue-300">Case ID: {firData.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Priority Row */}
          <div className="flex flex-wrap gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(firData.status)}`}>
              {firData.status.toUpperCase()}
            </div>
            <div className={`text-sm font-semibold ${getSeverityColor(firData.severity)}`}>
              SEVERITY: {firData.severity.toUpperCase()}
            </div>
            <div className="text-sm text-gray-300">
              Reported: {new Date(firData.reported_at || Date.now()).toLocaleString()}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Incident Details */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Incident Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Type of Incident</label>
                    <p className="text-white font-semibold capitalize">{firData.type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Description</label>
                    <p className="text-gray-200">{firData.description}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Location</label>
                    <p className="text-gray-200">
                      Lat: {firData.location?.lat}, Lng: {firData.location?.lng}
                    </p>
                    <p className="text-sm text-gray-400">Northeast Region, Assam</p>
                  </div>
                </div>
              </div>

              {/* Tourist Information */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tourist Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Tourist ID</label>
                    <p className="text-white font-mono">{firData.tourist_id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Emergency Contact</label>
                    <p className="text-gray-200">+1-555-0124</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Last Known Location</label>
                    <p className="text-gray-200">Remote trekking area, Northeast Hills</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Investigation Details */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Investigation Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Assigned Officer</label>
                    <p className="text-white font-semibold">
                      {firData.assigned_officer || 'Inspector Raj Kumar'}
                    </p>
                    <p className="text-sm text-gray-400">Badge #: NK001, Contact: +91-98765-43210</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Investigation Team</label>
                    <p className="text-gray-200">Tourist Safety Unit, Guwahati Division</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Case Priority</label>
                    <p className={`font-semibold ${getSeverityColor(firData.severity)}`}>
                      {firData.severity.toUpperCase()} PRIORITY
                    </p>
                  </div>
                </div>
              </div>

              {/* Evidence and Actions */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Evidence & Actions
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Evidence Collected</label>
                    <div className="space-y-1">
                      <p className="text-gray-200">• GPS location data from panic button</p>
                      <p className="text-gray-200">• Mobile phone last ping location</p>
                      <p className="text-gray-200">• CCTV footage from nearby checkpoint</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Actions Taken</label>
                    <div className="space-y-1">
                      <p className="text-gray-200">• Search team dispatched to location</p>
                      <p className="text-gray-200">• Local guides contacted</p>
                      <p className="text-gray-200">• Emergency services notified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Case Timeline
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-200">Panic button activated</p>
                      <p className="text-xs text-gray-400">Today, 2:45 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-200">FIR registered</p>
                      <p className="text-xs text-gray-400">Today, 3:10 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-200">Investigation team assigned</p>
                      <p className="text-xs text-gray-400">Today, 3:25 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Update Status
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Assign Officer
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Add Evidence
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Print FIR
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Send Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FIRModal;