import React, { useState, useEffect } from 'react';
import { rfpService, vendorService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SendRFP = () => {
    const [rfps, setRfps] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedRfp, setSelectedRfp] = useState('');
    const [selectedVendors, setSelectedVendors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rfpRes, vendorRes] = await Promise.all([
                    rfpService.getAll(),
                    vendorService.getAll()
                ]);
                setRfps(rfpRes.data);
                setVendors(vendorRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    const handleVendorToggle = (vendorId) => {
        setSelectedVendors(prev => 
            prev.includes(vendorId) 
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleSend = async () => {
        if (!selectedRfp || selectedVendors.length === 0) {
            alert("Please select an RFP and at least one vendor.");
            return;
        }

        try {
            await rfpService.sendToVendors(selectedRfp, selectedVendors);
            alert("RFP sent successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error sending RFP", error);
            alert("Failed to send RFP");
        }
    };

    return (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Send RFP to Vendors</h3>
            
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Select RFP</label>
                <select 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                    value={selectedRfp}
                    onChange={(e) => setSelectedRfp(e.target.value)}
                >
                    <option value="">Select an RFP</option>
                    {rfps.map(rfp => (
                        <option key={rfp._id} value={rfp._id}>{rfp.title}</option>
                    ))}
                </select>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vendors</label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {vendors.map(vendor => (
                        <div key={vendor._id} className="relative flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id={`vendor-${vendor._id}`}
                                    name={`vendor-${vendor._id}`}
                                    type="checkbox"
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    checked={selectedVendors.includes(vendor._id)}
                                    onChange={() => handleVendorToggle(vendor._id)}
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor={`vendor-${vendor._id}`} className="font-medium text-gray-700">{vendor.name}</label>
                                <p className="text-gray-500">{vendor.categories.join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={handleSend}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Send RFP
                </button>
            </div>
        </div>
    );
};

export default SendRFP;
