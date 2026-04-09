import React, { useState } from 'react';

const OrderTracking = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);

    const trackOrder = (e) => {
        e.preventDefault();
        // API'den sipariş durumu sorgulanacak
        setOrderStatus({
            status: 'Kargoda',
            lastUpdate: '2024-03-15',
            estimatedDelivery: '2024-03-17',
            timeline: [
                { date: '2024-03-13', status: 'Sipariş Alındı' },
                { date: '2024-03-14', status: 'Hazırlanıyor' },
                { date: '2024-03-15', status: 'Kargoya Verildi' }
            ]
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Sipariş Takibi</h1>
            
            <form onSubmit={trackOrder} className="max-w-md mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="Sipariş numaranız"
                        className="flex-1 px-4 py-2 border rounded-md"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Sorgula
                    </button>
                </div>
            </form>

            {orderStatus && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Sipariş Durumu: {orderStatus.status}</h2>
                        <p className="text-gray-600">Tahmini Teslimat: {orderStatus.estimatedDelivery}</p>
                    </div>

                    <div className="relative">
                        {orderStatus.timeline.map((step, index) => (
                            <div key={index} className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                                    ✓
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium">{step.status}</p>
                                    <p className="text-sm text-gray-500">{step.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking; 