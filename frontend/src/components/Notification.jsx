import React from 'react';
import { createPortal } from 'react-dom';

const Notification = ({ message, type = 'success', onClose }) => {
    const colors = {
        success: 'bg-green-100 text-green-800 border-green-300',
        error: 'bg-red-100 text-red-800 border-red-300',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        info: 'bg-blue-100 text-blue-800 border-blue-300'
    };

    return createPortal(
        <div className={`fixed top-4 right-4 p-4 rounded-lg border ${colors[type]} shadow-lg max-w-md z-50`}>
            <div className="flex justify-between items-center">
                <p>{message}</p>
                <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
                    ✕
                </button>
            </div>
        </div>,
        document.body
    );
};

export default Notification; 