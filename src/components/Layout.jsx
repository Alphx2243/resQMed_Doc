import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  FileText,
  ChevronDown,
  Siren,
  Bell,
  Settings,
  LogOut,
  Clock,
  X,
} from "lucide-react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifications, setNotifications] = useState([
    "New patient admitted",
    "Reminder: Surgery at 3 PM",
    "System update scheduled",
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleEmergencySOS = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    try {
      setIsEmergencyLoading(true);
      setEmergencyStatus("Accessing location...");

      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      setEmergencyStatus("Creating emergency request...");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emergency-sos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
            patientInfo: {
              requestedFrom: "Dashboard Emergency",
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create emergency request");

      setEmergencyStatus("Emergency services dispatched!");
    } catch (error) {
      console.error("Emergency SOS error:", error);
      setEmergencyStatus("Failed to process emergency request");
    } finally {
      setIsEmergencyLoading(false);
      setTimeout(() => setEmergencyStatus(null), 5000);
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">ResQMed</h1>
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
                    location.pathname === to
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

        {/* Profile Section */}
        <button onClick={() => navigate("/profile")} className="p-4 border-t">
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
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm flex justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Calendar className="text-gray-500" />
            <span className="text-gray-600">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <Clock className="text-gray-500 ml-4" />
            <span className="text-gray-600">
              {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {/* Notification and Settings */}
          <div className="relative flex items-center gap-4">
            <button onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            {showNotifications && (
              <div className="absolute right-[2rem] top-[2rem] w-64 bg-white shadow-lg rounded-lg p-3">
                {notifications.length > 0 ? (
                  notifications.map((note, index) => (
                    <div key={index} className="p-2 border-b last:border-none">
                      {note}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No notifications</p>
                )}
              </div>
            )}

            <button onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-5 w-5 text-gray-600" />
            </button>

            {showSettings && (
              <div className="absolute right-7 top-[2.5rem] right-[0.5rem] w-64 bg-white shadow-lg rounded-lg p-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                  Dark Mode
                </label>
              </div>
            )}
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
