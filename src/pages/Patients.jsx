import React, { useState } from 'react';
import { Search, Filter, Plus, Phone, Mail, X, FileText } from 'lucide-react';

export function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedPatientReports, setSelectedPatientReports] = useState([]);
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 45,
      gender: "Female",
      contact: "+1 (555) 123-4567",
      email: "sarah.j@example.com",
      lastVisit: "2025-03-28",
      status: "Active",
      reports: [
        { date: "2025-03-25", link: "#" },
        { date: "2025-03-20", link: "#" },
      ],
    },
  ]);

  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    email: '',
    lastVisit: new Date().toISOString().split('T')[0],
    status: 'Active',
    reports: []
  });

  const addPatient = () => {
    setPatients([...patients, { id: patients.length + 1, ...newPatient }]);
    setShowModal(false);
    setNewPatient({ name: '', age: '', gender: '', contact: '', email: '', lastVisit: new Date().toISOString().split('T')[0], status: 'Active', reports: [] });
  };

  return (
    <div className="space-y-6">
      {!showModal ? (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <button
              className="flex items-center gap-2 px-4 py-2 my-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-5 w-5" />
              Add Patient
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(patient.lastVisit).toLocaleDateString('en-US')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">{patient.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:underline" onClick={() => { setSelectedPatientReports(patient.reports); setShowReportsModal(true); }}>View Reports</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Patient</h2>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input className="w-full p-2 border rounded" type="text" placeholder="Patient Name" value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} />
              <input className="w-full p-2 border rounded" type="number" placeholder="Age" value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} />
              <input className="w-full p-2 border rounded" type="text" placeholder="Gender" value={newPatient.gender} onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })} />
              <input className="w-full p-2 border rounded" type="tel" placeholder="Phone" value={newPatient.contact} onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })} />
              <input className="w-full p-2 border rounded" type="email" placeholder="Email" value={newPatient.email} onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} />
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500" onClick={addPatient}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
