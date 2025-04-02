/* eslint-disable no-unused-vars */
import React from 'react';
import { AlertCircle } from 'lucide-react';

export function Dashboard() {
  const appointments = [
    { id: 1, patient: "Sarah Johnson", time: "09:00 AM", status: "scheduled" },
    { id: 2, patient: "Mike Brown", time: "10:30 AM", status: "completed" },
    { id: 3, patient: "Emma Wilson", time: "11:45 AM", status: "cancelled" },
    { id: 4, patient: "James Miller", time: "02:15 PM", status: "scheduled" },
  ];

  const alerts = [
    { id: 1, type: "urgent", message: "Emergency room capacity at 85%" },
    { id: 2, type: "info", message: "New COVID-19 guidelines updated" },
    { id: 3, type: "warning", message: "Maintenance scheduled for Wing B" },
  ];

  const stats = [
    { title: "Available Beds", value: "45", change: "-3%" },
    { title: "Appointments", value: "89", change: "+5%" },
    { title: "Staff on Duty", value: "142", change: "0%" },
  ];

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
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b last:border-b-0">
                    <td className="py-3">{appointment.patient}</td>
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
  
      </div>
    </>
  );
}