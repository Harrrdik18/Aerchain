import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { rfpService } from '../services/api';

const Comparison = () => {
    const { id } = useParams();
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComparison = async () => {
            try {
                const response = await rfpService.getComparison(id);
                setComparison(response.data);
            } catch (error) {
                console.error("Error fetching comparison", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComparison();
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading comparison...</div>;
    if (!comparison || !comparison.vendorScores) return <div className="text-center py-10">No proposals found yet.</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">AI Recommendation</h3>
                <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Recommended Vendor: {comparison.recommendation}</h3>
                            <div className="mt-2 text-sm text-green-700">
                                <p>{comparison.justification}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Comparison Summary</h3>
                <p className="text-gray-600 mb-6">{comparison.summary}</p>
                
                <h4 className="text-md font-medium text-gray-900 mb-2">Vendor Scores</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {comparison.vendorScores.map((score, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">Vendor ID: {score.vendorId}</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Score: {score.score}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Comparison;
