'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { colorClasses } from '@/lib/constants';

export default function AlertBox() {
    const [showAlert, setShowAlert] = useState(true);

    if (!showAlert) return null;

    return (
        <div className=" fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 relative">
                {/* Close Button */}
                <button
                    onClick={() => setShowAlert(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Alert Content */}
                <div className="text-center">
                    <div className="flex justify-center mb-1">
                        <AlertTriangle className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Alert!!!</h3>
                    <p className="text-gray-600 mb-2">
                        Website is still under production...
                    </p>
                    <p className="text-sm text-gray-500">
                        Note: Some functionality might not work...
                    </p>
                </div>

                {/* Action Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowAlert(false)}
                        className={`px-6 py-2 rounded-md ${colorClasses.primary.bg} text-white hover:opacity-90 transition-opacity`}
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}