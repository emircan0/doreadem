import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserOrders } from '../../store/actions/userActions';

const OrderHistory = () => {
    const dispatch = useDispatch();
    const { userInfo, orders, loading, error } = useSelector(state => state.user);

    useEffect(() => {
        if (userInfo?.email) {
            dispatch(getUserOrders(userInfo.email));
        }
    }, [dispatch, userInfo?.email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-lux-accent/20 border-t-lux-accent animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-24 text-center border border-dashed border-red-100 bg-red-50/30">
                <p className="text-[10px] tracking-[0.3em] uppercase text-red-400 font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="mb-12 space-y-2 border-b border-lux-accent/10 pb-8">
                <h2 className="text-2xl font-serif text-lux-dark lowercase tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    sipariş geçmişim
                </h2>
                <p className="text-[10px] text-lux-dark/40 uppercase tracking-[0.2em] font-medium">
                    Tüm siparişlerinizi ve durumlarını buradan takip edebilirsiniz.
                </p>
            </div>

            {orders?.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="group bg-white/40 backdrop-blur-sm border border-lux-accent/5 p-8 transition-all duration-500 hover:border-lux-accent/20 hover:shadow-lux">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-lux-accent">
                                        Sipariş #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="text-[9px] text-lux-dark/40 uppercase tracking-[0.1em] font-medium">
                                        {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 text-[8px] font-bold tracking-[0.2em] uppercase ${order.status?.current === 'delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                                            order.status?.current === 'pending' ? 'bg-lux-accent/10 text-lux-accent border border-lux-accent/20' :
                                                'bg-gray-50 text-gray-500 border border-gray-100'
                                        }`}>
                                        {order.status?.current === 'delivered' ? 'Teslim Edildi' :
                                            order.status?.current === 'pending' ? 'Beklemede' :
                                                'Kargoda'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {order.items?.map(item => (
                                    <div key={item._id} className="flex items-center justify-between border-b border-lux-accent/5 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-lux-dark/5 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-lux-dark/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-medium text-lux-dark lowercase">{item.name || " premium ürün"}</p>
                                                <p className="text-[9px] text-lux-dark/40 uppercase tracking-widest">{item.quantity} adet</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-bold text-lux-dark/80 tracking-widest">{item.price?.toLocaleString('tr-TR')} TL</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-lux-accent/10 flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-lux-dark/30">Toplam Tutar</p>
                                    <p className="text-lg font-serif text-lux-dark" style={{ fontFamily: 'var(--font-serif)' }}>
                                        {order.totalAmount?.total?.toLocaleString('tr-TR')} <span className="text-xs ml-1">TL</span>
                                    </p>
                                </div>
                                <button className="text-[9px] font-bold tracking-[0.2em] uppercase text-lux-accent hover:text-lux-dark transition-colors border-b border-transparent hover:border-lux-dark pb-1">
                                    Detayları Görüntüle
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center border border-dashed border-lux-accent/10">
                    <svg className="w-10 h-10 text-lux-dark/10 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-lux-dark/30 font-bold">Henüz bir siparişiniz bulunmuyor.</p>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
