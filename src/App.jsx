/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, Settings, LogOut, Home, Users, Calendar as CalendarIcon, FileText, AlertCircle, ChevronDown, Guitar as Hospital, Siren } from 'lucide-react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const appointments = [
    { id: 1, patient: "Sarah Johnson", doctor: "Dr. Smith", time: "09:00 AM", status: "scheduled" },
    { id: 2, patient: "Mike Brown", doctor: "Dr. Davis", time: "10:30 AM", status: "completed" },
    { id: 3, patient: "Emma Wilson", doctor: "Dr. Taylor", time: "11:45 AM", status: "cancelled" },
    { id: 4, patient: "James Miller", doctor: "Dr. Anderson", time: "02:15 PM", status: "scheduled" },
  ];

  const alerts = [
    { id: 1, type: "urgent", message: "Emergency room capacity at 85%" },
    { id: 2, type: "info", message: "New COVID-19 guidelines updated" },
    { id: 3, type: "warning", message: "Maintenance scheduled for Wing B" },
  ];

  const stats = [
    { title: "Total Patients", value: "1,234", change: "+12%" },
    { title: "Available Beds", value: "45", change: "-3%" },
    { title: "Appointments", value: "89", change: "+5%" },
    { title: "Staff on Duty", value: "142", change: "0%" },
  ];

  const handleEmergencySOS = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    try {
      setIsEmergencyLoading(true);
      setEmergencyStatus('Accessing location...');

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setEmergencyStatus('Creating emergency request...');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emergency-sos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          patientInfo: {
            requestedFrom: 'Dashboard Emergency',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create emergency request');
      }

      const data = await response.json();
      setEmergencyStatus('Emergency services dispatched!');
      
      // Add the new emergency alert to the alerts list
      alerts.unshift({
        id: Date.now(),
        type: 'urgent',
        message: 'Emergency response team dispatched. ETA: 8-10 minutes',
      });

    } catch (error) {
      console.error('Emergency SOS error:', error);
      setEmergencyStatus('Failed to process emergency request');
    } finally {
      setIsEmergencyLoading(false);
      setTimeout(() => setEmergencyStatus(null), 5000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Hospital className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">MedCenter</h1>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                <Home className="h-5 w-5" />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                <Users className="h-5 w-5" />
                Patients
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                <CalendarIcon className="h-5 w-5" />
                Appointments
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                <FileText className="h-5 w-5" />
                Reports
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-4">
          <button
            onClick={handleEmergencySOS}
            disabled={isEmergencyLoading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-colors ${
              isEmergencyLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <Siren className="h-5 w-5" />
            {isEmergencyLoading ? 'Processing...' : 'Emergency SOS'}
          </button>
          {emergencyStatus && (
            <p className="text-sm text-center mt-2 text-gray-600">{emergencyStatus}</p>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
              alt="Doctor profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium text-sm">Dr. Sarah Wilson</h3>
              <p className="text-xs text-gray-500">Chief Medical Officer</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <Calendar className="text-gray-500" />
              <span className="text-gray-600">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <Clock className="text-gray-500 ml-4" />
              <span className="text-gray-600">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:scale-[1.02]">
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Sections */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Appointments Table */}
            <div className="lg:w-[60%] bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3">Patient</th>
                      <th className="pb-3">Doctor</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b last:border-b-0">
                        <td className="py-3">{appointment.patient}</td>
                        <td className="py-3">{appointment.doctor}</td>
                        <td className="py-3">{appointment.time}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alerts Panel */}
            <div className="lg:w-[40%] bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg flex items-start gap-3
                      ${alert.type === 'urgent' ? 'bg-red-50' :
                        alert.type === 'warning' ? 'bg-yellow-50' :
                        'bg-blue-50'
                      }`}
                  >
                    <AlertCircle className={`h-5 w-5 mt-0.5
                      ${alert.type === 'urgent' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} 
                    />
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;