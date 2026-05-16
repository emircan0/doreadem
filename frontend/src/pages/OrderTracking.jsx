import React, { useState } from 'react';
import { trackOrder } from '../api';
import { toast } from 'react-toastify';

const OrderTracking = () => {
    const [orderNumber, setOrderNumber] = useState('ORD-');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOrderNumberChange = (e) => {
        const value = e.target.value;
        // Eğer kullanıcı ORD- kısmını silmeye çalışırsa engelle
        if (value.startsWith('ORD-')) {
            setOrderNumber(value);
        } else {
            setOrderNumber('ORD-');
        }
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        if (orderNumber.trim() === 'ORD-') {
            toast.error('Lütfen sipariş numaranızı giriniz.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await trackOrder(orderNumber.trim());
            setOrderData(data);
        } catch (error) {
            console.error('Takip hatası:', error);
            const message = error.response?.data?.message || 'Sipariş bulunamadı. Lütfen numaranızı kontrol edin.';
            toast.error(message);
            setOrderData(null);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        const statuses = {
            'pending': 'Sipariş Alındı',
            'processing': 'Hazırlanıyor',
            'shipped': 'Kargoya Verildi',
            'delivered': 'Teslim Edildi',
            'cancelled': 'İptal Edildi'
        };
        return statuses[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'text-yellow-500 bg-yellow-50',
            'processing': 'text-blue-500 bg-blue-50',
            'shipped': 'text-purple-500 bg-purple-50',
            'delivered': 'text-green-500 bg-green-50',
            'cancelled': 'text-red-500 bg-red-50'
        };
        return colors[status] || 'text-gray-500 bg-gray-50';
    };

    return (
        <div className="container mx-auto px-6 py-20 min-h-[60vh]">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-lux-accent text-[10px] font-bold tracking-mega-wide uppercase mb-4 block">SİPARİŞ DURUMU</span>
                    <h1 className="font-display text-4xl text-lux-dark mb-4">Siparişinizi Takip Edin</h1>
                    <p className="text-lux-muted text-sm font-light">
                        Sipariş numaranızı girerek anlık durumunu görüntüleyebilirsiniz.
                    </p>
                </div>
                
                <form onSubmit={handleTrack} className="mb-12">
                    <div className="flex flex-col md:flex-row gap-4 p-2 bg-white shadow-xl rounded-2xl border border-gray-100">
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={handleOrderNumberChange}
                            placeholder="ORD-..."
                            className="flex-1 px-6 py-4 text-sm focus:outline-none bg-transparent font-medium tracking-wide"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-lux-dark text-white px-10 py-4 rounded-xl text-[10px] font-bold tracking-ultra-wide uppercase hover:bg-lux-accent transition-all duration-500 shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Sorgulanıyor...' : 'Sorgula'}
                        </button>
                    </div>
                </form>

                {orderData && (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">SİPARİŞ NO</p>
                                <h2 className="text-lg font-bold text-lux-dark font-sans">{orderData.orderNumber}</h2>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase ${getStatusColor(orderData.status.current)}`}>
                                {getStatusText(orderData.status.current)}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="p-8">
                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100"></div>

                                <div className="space-y-10">
                                    {orderData.status.history && orderData.status.history.map((step, index) => (
                                        <div key={index} className="relative pl-12">
                                            {/* Dot */}
                                            <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 
                                                ${index === orderData.status.history.length - 1 ? 'bg-lux-accent text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                            </div>
                                            
                                            <div>
                                                <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${index === orderData.status.history.length - 1 ? 'text-lux-dark' : 'text-gray-400'}`}>
                                                    {getStatusText(step.status)}
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    {new Date(step.timestamp).toLocaleString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                {step.note && <p className="mt-2 text-xs text-gray-500 font-light italic">"{step.note}"</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer / Summary */}
                        <div className="p-8 bg-lux-dark text-white">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Müşteri</span>
                                    <span className="text-sm font-medium uppercase tracking-wider">{orderData.customer?.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Ürünler</span>
                                    <div className="flex flex-col items-end">
                                        {orderData.items && orderData.items.map((item, i) => (
                                            <span key={i} className="text-xs font-light">{item.quantity}x {item.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
 