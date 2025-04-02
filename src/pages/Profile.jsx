import React from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit2 } from 'lucide-react';

const Profile = () => {
  const user = {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 234 567 8901',
    dob: 'March 15, 1980',
    location: 'New York, USA',
    specialization: 'Cardiology',
    bio: 'Experienced cardiologist with over 15 years in the field, committed to patient care and medical advancements.',
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <button className="text-blue-600 hover:text-blue-500 flex items-center">
          <Edit2 className="h-5 w-5 mr-1" /> Edit Profile
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
        <p className="text-gray-500">{user.specialization}</p>
        <p className="text-sm text-gray-700 text-center max-w-md mt-2">{user.bio}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard title="Contact Information">
          <ProfileInfo icon={Mail} text={user.email} />
          <ProfileInfo icon={Phone} text={user.phone} />
          <ProfileInfo icon={Calendar} text={user.dob} />
          <ProfileInfo icon={MapPin} text={user.location} />
        </ProfileCard>

        <ProfileCard title="Specialization">
          <p className="text-gray-700">{user.specialization}</p>
        </ProfileCard>
      </div>
    </div>
  );
};

const ProfileCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    <div className="mt-4 space-y-4">{children}</div>
  </div>
);

const ProfileInfo = ({ icon: Icon, text }) => (
  <div className="flex items-center text-gray-700">
    <Icon className="h-5 w-5 text-blue-600 mr-3" /> {text}
  </div>
);

export default Profile;