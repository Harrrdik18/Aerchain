import React, { useState } from 'react';
import { rfpService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RFPCreation = () => {
    const [text, setText] = useState('');
    const [generatedRFP, setGeneratedRFP] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await rfpService.generateFromText(text);
            setGeneratedRFP(response.data);
        } catch (error) {
            console.error("Error generating RFP", error);
            alert("Failed to generate RFP");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await rfpService.create(generatedRFP);
            alert("RFP Saved Successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error saving RFP", error);
            alert("Failed to save RFP");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Create RFP</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Describe your requirements in plain English, and AI will generate a structured RFP for you.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                                    Requirements
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        rows={5}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                        placeholder="I need 50 high-performance laptops for our engineering team. Budget is around $80,000. Delivery needed by next month."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={loading}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Generate RFP Structure'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {generatedRFP && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Review Generated RFP</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-96">
                        <pre className="text-sm text-gray-800">{JSON.stringify(generatedRFP, null, 2)}</pre>
                    </div>
                    <div className="mt-5">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Save RFP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RFPCreation;
