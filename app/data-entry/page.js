'use client';
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('training'); // Default tab is "Training"

  // Function to handle opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Head>
        <title>Data Entry</title>
      </Head>

      {/* Sidebar */}
      <aside className="w-1/4 bg-green-900 h-screen flex flex-col justify-between">
        <div className="text-white p-6">
          <div className="font-bold text-lg mb-12">LIST OF APPLIED JOBS</div>
          <div className="text-sm cursor-pointer">&gt;</div>
        </div>
        <div className="p-6 text-white">
          <div className="cursor-pointer">View account details</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-green-800">Data Entry</h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            <span className="mr-2 text-lg">+</span> Add Data Entry
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('skills')}
            className={`border-2 border-green-600 text-green-800 font-bold py-2 px-6 mr-4 rounded-lg ${
              activeTab === 'skills' ? 'bg-green-600 text-white' : ''
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`bg-green-600 text-white py-2 px-6 rounded-lg ${
              activeTab === 'training' ? 'bg-green-800' : ''
            }`}
          >
            Training
          </button>
        </div>

        {/* Skills Table */}
        {activeTab === 'skills' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-black rounded-lg">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="py-3 px-6 text-left">Data ID</th>
                  <th className="py-3 px-6 text-left">Data Skills</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '0001', skill: 'Project Management' },
                  { id: '0002', skill: 'Data Visualization' },
                  { id: '0003', skill: 'Data Analysis' },
                  { id: '0004', skill: 'Computer Literacy' },
                  { id: '0005', skill: 'Organizational Skills' },
                  { id: '0006', skill: 'Technical Aptitude' },
                  { id: '0007', skill: 'Machine Learning' },
                  { id: '0008', skill: 'Leadership' },
                ].map((row) => (
                  <tr key={row.id} className="odd:bg-green-100 even:bg-green-50 hover:bg-green-200">
                    <td className="py-3 px-6">{row.id}</td>
                    <td className="py-3 px-6">{row.skill}</td>
                    <td className="py-3 px-6 text-center">
                      <button className="bg-green-800 text-white px-4 py-1 rounded-lg mr-2 hover:bg-green-900">
                        Edit
                      </button>
                      <button className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Training Table */}
        {activeTab === 'training' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-black rounded-lg">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="py-3 px-6 text-left">Data ID</th>
                  <th className="py-3 px-6 text-left">Data Training</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '0001', training: 'Human Resources Manager' },
                  { id: '0002', training: 'Event Coordinator' },
                  { id: '0003', training: 'Project Manager' },
                  { id: '0004', training: 'Sales Trainer' },
                  { id: '0005', training: 'Technical Trainer' },
                  { id: '0006', training: 'Operation Trainer' },
                  { id: '0007', training: 'Sales and Marketing Trainer' },
                  { id: '0008', training: 'Retail Training Manager' },
                ].map((row) => (
                  <tr key={row.id} className="odd:bg-green-100 even:bg-green-50 hover:bg-green-200">
                    <td className="py-3 px-6">{row.id}</td>
                    <td className="py-3 px-6">{row.training}</td>
                    <td className="py-3 px-6 text-center">
                      <button className="bg-green-800 text-white px-4 py-1 rounded-lg mr-2 hover:bg-green-900">
                        Edit
                      </button>
                      <button className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-green-700 text-white p-8 rounded-lg w-1/3">
              <h2 className="text-3xl font-bold mb-4">Add New Data Entry</h2>

              {/* Modal Tabs */}
              <div className="flex mb-6">
                <button className="border-2 border-white text-white font-bold py-2 px-4 mr-4 rounded-lg">
                  Skills
                </button>
                <button className="bg-white text-green-700 py-2 px-4 rounded-lg">
                  Training
                </button>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <label className="block mb-2">Enter Skills</label>
                <input
                  type="text"
                  placeholder="Enter Skills"
                  className="w-full p-3 rounded-lg bg-green-600 text-white placeholder-white"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-green-800 text-white px-6 py-2 rounded-lg mr-4"
                >
                  Add
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}