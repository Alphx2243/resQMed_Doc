import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Bell,
  Settings,
  Home,
  Users,
  FileText,
  AlertCircle,
  ChevronDown,
  Guitar as Hospital,
  Siren,
  Mic,
  Brain,
  Save,
} from 'lucide-react';

// API Configuration
const GEMINI_API_KEY = "AIzaSyAQPRlYLbSxKIAC3T4dMYmsdyFeaEFcUUc";
const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT = "67ef8fe3002289dc7ba1";
const APPWRITE_DATABASE = "67f082530002ca5e6588";
const APPWRITE_COLLECTION = "67f0826300128e85bfd9";
const APPWRITE_API_KEY = "standard_fdb78a56fc0637fc70b6d1bf5d315c4a1a67e4fa6947a68b7f706acf4f1ea90795180d00dd90ffeb1dda748520a78c1f03caeb185a8dd7abed31d992784fdd219e7bcffce3f38aa8068e46e7d94f071fe7654db01524d2d75982c9b4f84e4619b9166e90f9f43beb148e90f4c070b924e8cb7a933dfec0e964136f1e8761e4a5";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    "New patient admitted",
    "Reminder: Surgery at 3 PM",
    "System update scheduled",
  ]);
  const [emergencyStatus, setEmergencyStatus] = useState(null);
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, type: "urgent", message: "Emergency room capacity at 85%" },
    { id: 2, type: "info", message: "New COVID-19 guidelines updated" },
    { id: 3, type: "warning", message: "Maintenance scheduled for Wing B" },
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Toggle dark mode on body
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Emergency SOS handler
  const handleEmergencySOS = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    try {
      setIsEmergencyLoading(true);
      setEmergencyStatus('Accessing location...');
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setEmergencyStatus('Creating emergency request...');
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emergency-sos`,
        {
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
        }
      );
      if (!response.ok) {
        throw new Error('Failed to create emergency request');
      }
      setEmergencyStatus('Emergency services dispatched!');
      // Prepend new emergency alert
      setAlerts(prev => [
        { id: Date.now(), type: 'urgent', message: 'Emergency response team dispatched. ETA: 8-10 minutes' },
        ...prev,
      ]);
    } catch (error) {
      console.error('Emergency SOS error:', error);
      setEmergencyStatus('Failed to process emergency request');
    } finally {
      setIsEmergencyLoading(false);
      setTimeout(() => setEmergencyStatus(null), 5000);
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Sidebar
        location={location}
        navigate={navigate}
        handleEmergencySOS={handleEmergencySOS}
        isEmergencyLoading={isEmergencyLoading}
        emergencyStatus={emergencyStatus}
      />
      <main className="flex-1 ml-64 flex flex-col">
        <Header
          currentTime={currentTime}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
        />
        <div className="p-6 flex-1 overflow-auto">
          {location.pathname === "/" ? (
            <Dashboard alerts={alerts} />
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

const Sidebar = ({ location, navigate, handleEmergencySOS, isEmergencyLoading, emergencyStatus }) => {
  return (
    <aside className="w-64 bg-white shadow-lg fixed h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Hospital className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">ResQMed</h1>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {[
            { to: "/", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
            { to: "/patients", label: "Patients", icon: <Users className="h-5 w-5" /> },
            { to: "/appointments", label: "Appointments", icon: <Calendar className="h-5 w-5" /> },
            { to: "/reports", label: "Reports", icon: <FileText className="h-5 w-5" /> },
          ].map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  location?.pathname === to
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                {icon}
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button
          onClick={handleEmergencySOS}
          disabled={isEmergencyLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-colors ${
            isEmergencyLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          <Siren className="h-5 w-5" />
          {isEmergencyLoading ? "Processing..." : "Emergency SOS"}
        </button>
        {emergencyStatus && (
          <p className="text-sm text-center mt-2 text-gray-600">{emergencyStatus}</p>
        )}
      </div>
      <div
        className="p-4 border-t cursor-pointer hover:bg-gray-50"
        onClick={() => navigate("/profile")}
      >
        <div className="flex items-center gap-3">
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
  );
};

const Header = ({ currentTime, showNotifications, setShowNotifications, notifications }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <Calendar className="text-gray-500" />
          <span className="text-gray-600">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <Clock className="text-gray-500 ml-4" />
          <span className="text-gray-600">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="relative flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-10 w-64 bg-white shadow-lg rounded-lg p-3 z-10">
              <h4 className="font-semibold mb-2">Notifications</h4>
              <ul className="space-y-1">
                {notifications.map((note, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

const Dashboard = ({ alerts }) => {
  // Medical Assistant State
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognitionMessage, setRecognitionMessage] = useState('');

  // Ref for MediaRecorder
  const mediaRecorderRef = useRef(null);

  // Static data for appointments and stats
  const appointments = [
    { id: 1, patient: "Sarah Johnson", doctor: "Dr. Smith", time: "09:00 AM", status: "scheduled" },
    { id: 2, patient: "Mike Brown", doctor: "Dr. Davis", time: "10:30 AM", status: "completed" },
    { id: 3, patient: "Emma Wilson", doctor: "Dr. Taylor", time: "11:45 AM", status: "cancelled" },
    { id: 4, patient: "James Miller", doctor: "Dr. Anderson", time: "02:15 PM", status: "scheduled" },
  ];

  const stats = [
    { title: "Total Patients", value: "1,234", change: "+12%" },
    { title: "Available Beds", value: "45", change: "-3%" },
    { title: "Appointments", value: "89", change: "+5%" },
    { title: "Staff on Duty", value: "142", change: "0%" },
  ];

  // Function to send recorded audio to Wit.ai's free Speech-to-Text API
  const sendAudioToSpeechAPI = async (audioBlob) => {
    const response = await fetch('https://api.wit.ai/speech?v=20230401', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YJ6EEQ4NZF4ZW5Z2ONCZEFLCEKBPX6U6',
        'Content-Type': 'audio/wav'
      },
      body: audioBlob
    });
    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }
    const data = await response.json();
    // Wit.ai returns the transcribed text in the 'text' field.
    return data.text;
  };

  // Start/Stop speech recording using MediaRecorder and send the audio to the speech-to-text API.
  const toggleListening = async () => {
    if (!isListening) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = e => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        recorder.onstart = () => {
          setIsListening(true);
          setRecognitionMessage('Recording...');
        };
        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setRecognitionMessage('Processing audio...');
          try {
            const transcript = await sendAudioToSpeechAPI(audioBlob);
            setNote(prev => prev + ' ' + transcript);
            setRecognitionMessage('Processing speech...');
          } catch (error) {
            console.error('Speech API error:', error);
            setRecognitionMessage('Error processing audio');
          }
          setIsListening(false);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setRecognitionMessage('Microphone error');
      }
    } else {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setRecognitionMessage('');
      }
    }
  };

  // Summarize the medical note using the Gemini API
  const summarizeNote = async () => {
    if (!note.trim()) {
      alert("Please add a note");
      return;
    }
    const prompt = `Given the following medical note, extract and summarize it under:
- Problem:
- Prescription:
- Precautions:

Note: Keep it short and clear.
Note: "${note}"`;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setSummary(content || "Could not generate summary.");
    } catch (error) {
      console.error('Error summarizing note:', error);
      setSummary("Error generating summary. Please try again.");
    }
  };

  // Save the summary to Appwrite
  const saveToAppwrite = async () => {
    if (!summary) {
      alert("No summary to save.");
      return;
    }
    try {
      const response = await fetch(
        `${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE}/collections/${APPWRITE_COLLECTION}/documents`,
        {
          method: 'POST',
          headers: {
            'X-Appwrite-Project': APPWRITE_PROJECT,
            'X-Appwrite-Key': APPWRITE_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: { summary, created_at: new Date().toISOString() },
          }),
        }
      );
      if (response.ok) {
        alert("✅ Summary saved!");
        setNote('');
        setSummary('');
      } else {
        alert("❌ Failed to save.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Appwrite error");
    }
  };

  return (
    <>
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
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Appointments Table */}
        <div className="lg:w-3/5 bg-white rounded-xl shadow-sm p-6">
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
                        ${appointment.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
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
        <div className="lg:w-2/5 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg flex items-start gap-3
                  ${alert.type === 'urgent'
                    ? 'bg-red-50'
                    : alert.type === 'warning'
                    ? 'bg-yellow-50'
                    : 'bg-blue-50'
                  }`}
              >
                <AlertCircle className={`h-5 w-5 mt-0.5
                  ${alert.type === 'urgent'
                    ? 'text-red-500'
                    : alert.type === 'warning'
                    ? 'text-yellow-500'
                    : 'text-blue-500'
                  }`}
                />
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical Assistant Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🩺 Medical Assistant</h2>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Speak or type your medical note..."
          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>

        {recognitionMessage && (
          <div className="mt-2 text-sm text-gray-600">
            {recognitionMessage}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={toggleListening}
            className={`flex items-center gap-2 ${
              isListening 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-green-600 hover:bg-green-700"
            } text-white px-5 py-2 rounded-xl`}
          >
            <Mic className="h-5 w-5" />
            {isListening ? "Stop Speech" : "Start Speech"}
          </button>
          <button
            onClick={summarizeNote}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
          >
            <Brain className="h-5 w-5" />
            Summarize
          </button>
          <button
            onClick={saveToAppwrite}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700"
          >
            <Save className="h-5 w-5" />
            Save
          </button>
        </div>

        {summary && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">📝 Summary</h3>
            <pre className="whitespace-pre-wrap text-gray-800">{summary}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;
