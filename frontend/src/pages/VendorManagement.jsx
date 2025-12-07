import React, { useState, useEffect } from 'react';
import { vendorService } from '../services/api';

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [newVendor, setNewVendor] = useState({ name: '', email: '', phone: '', categories: '' });

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const response = await vendorService.getAll();
            setVendors(response.data);
        } catch (error) {
            console.error("Error loading vendors", error);
        }
    };

    const handleAddVendor = async (e) => {
        e.preventDefault();
        try {
            const vendorData = {
                ...newVendor,
                categories: newVendor.categories.split(',').map(c => c.trim())
            };
            await vendorService.create(vendorData);
            setNewVendor({ name: '', email: '', phone: '', categories: '' });
            loadVendors();
        } catch (error) {
            console.error("Error adding vendor", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Vendor</h3>
                <form onSubmit={handleAddVendor} className="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" value={newVendor.email} onChange={e => setNewVendor({...newVendor, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input type="text" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" value={newVendor.phone} onChange={e => setNewVendor({...newVendor, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categories (comma separated)</label>
                        <input type="text" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" value={newVendor.categories} onChange={e => setNewVendor({...newVendor, categories: e.target.value})} />
                    </div>
                    <div className="sm:col-span-2">
                        <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Add Vendor
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {vendors.map((vendor) => (
                        <li key={vendor._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">{vendor.name}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {vendor.categories.join(', ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            {vendor.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VendorManagement;
