import React, { useState, useEffect } from 'react';
import { rfpService } from '../services/api';
import { Link } from 'react-router-dom';

const ProposalsDashboard = () => {
    const [rfps, setRfps] = useState([]);

    useEffect(() => {
        const fetchRfps = async () => {
            try {
                const response = await rfpService.getAll();
                setRfps(response.data);
            } catch (error) {
                console.error("Error fetching RFPs", error);
            }
        };
        fetchRfps();
    }, []);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">RFP Dashboard</h3>
                <Link to="/send-rfp" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    Send New RFP
                </Link>
            </div>
            <ul className="divide-y divide-gray-200">
                {rfps.map((rfp) => (
                    <li key={rfp._id}>
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">{rfp.title}</p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {rfp.selectedVendors.length} Vendors
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Budget: {rfp.budget}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <Link to={`/comparison/${rfp._id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                        View Comparison &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProposalsDashboard;
