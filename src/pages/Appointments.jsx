import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Plus, Search, Filter, X, Trash, AlertCircle } from 'lucide-react';

export function Appointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Sarah Johnson",
      department: "Cardiology",
      date: "2025-04-15",
      time: "09:00 AM",
      status: "scheduled",
      type: "Check-up"
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient: '', department: '', date: '', time: '', status: 'scheduled', type: ''
  });
  const [leaveModal, setLeaveModal] = useState(false);
  const [leavePeriod, setLeavePeriod] = useState({ startDate: '', startTime: '', endDate: '', endTime: '' });

  const addAppointment = () => {
    if (!newAppointment.patient || !newAppointment.department || !newAppointment.date || !newAppointment.time || !newAppointment.type) return;
    setAppointments([...appointments, { id: appointments.length + 1, ...newAppointment }]);
    setShowModal(false);
    setNewAppointment({ patient: '', department: '', date: '', time: '', status: 'scheduled', type: '' });
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  const setLeave = () => {
    setLeaveModal(false);
  };

  return (
    <div className="space-y-8 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <div className="flex gap-4">
          <button onClick={() => setLeaveModal(true)} className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md">
            <AlertCircle className="h-6 w-6" />
            Inform Leave
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md">
            <Plus className="h-6 w-6" />
            New Appointment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-gray-700">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Patient</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">{appointment.patient}</td>
                <td className="px-6 py-4">{appointment.department}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {format(new Date(appointment.date), 'MMM d, yyyy')}
                  <Clock className="h-4 w-4 text-gray-400 ml-2" />
                  {appointment.time}
                </td>
                <td className="px-6 py-4">{appointment.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${appointment.status === 'scheduled' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>{appointment.status}</span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteAppointment(appointment.id)} className="text-red-500 hover:text-red-700">
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Inform Leave</h2>
              <button onClick={() => setLeaveModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 mt-4">
              <input type="date" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setLeavePeriod({ ...leavePeriod, startDate: e.target.value })} />
              <input type="time" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setLeavePeriod({ ...leavePeriod, startTime: e.target.value })} />
              <input type="date" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setLeavePeriod({ ...leavePeriod, endDate: e.target.value })} />
              <input type="time" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setLeavePeriod({ ...leavePeriod, endTime: e.target.value })} />
              <button onClick={setLeave} className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all shadow-md">Confirm Leave</button>
            </div>
          </div>
        </div>
      )}

      
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">New Appointment</h2>
        <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
      </div>
      <div className="space-y-4 mt-4">
        <input type="text" placeholder="Patient Name" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })} />
        <input type="text" placeholder="Department" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setNewAppointment({ ...newAppointment, department: e.target.value })} />
        <input type="date" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
        <input type="time" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} />
        <input type="text" placeholder="Type" className="w-full border rounded-lg px-4 py-3 shadow-sm" onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })} />
        <button onClick={addAppointment} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md">Add Appointment</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}











