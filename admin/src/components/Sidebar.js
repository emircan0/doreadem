import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Squares2X2Icon, 
  ShoppingBagIcon, 
  TagIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon,
  ArchiveBoxIcon,
  TruckIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const NAV = [
  { to: '/',                    end: true, icon: Squares2X2Icon,      label: 'Dashboard'            },
  { to: '/products',            end: false, icon: ArchiveBoxIcon,      label: 'Ürünler'              },
  { to: '/categories-and-brands', end: false, icon: TagIcon,         label: 'Kategori & Marka'     },
  { to: '/orders',              end: false, icon: ShoppingBagIcon,   label: 'Siparişler'           },
  { to: '/invoices',            end: false, icon: DocumentDuplicateIcon, label: 'Faturalar'         },
  { to: '/shipping',            end: false, icon: TruckIcon,          label: 'Kargo Yönetimi'       },
  { to: '/payment',             end: false, icon: CreditCardIcon,     label: 'Ödeme Yönetimi'       },
  { to: '/organizations',       end: false, icon: SparklesIcon,       label: 'Organizasyonlar'      },
  { to: '/users',               end: false, icon: UsersIcon,          label: 'Kullanıcılar'         },
  { to: '/settings',            end: false, icon: Cog6ToothIcon,      label: 'Ayarlar'              },
];

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="w-[var(--sidebar-w)] min-w-[var(--sidebar-w)] bg-[var(--color-sidebar)] text-white/50 h-screen sticky top-0 flex flex-col border-r border-white/5 z-50">
      {/* Logo Section */}
      <div className="p-8 border-b border-white/5">
        <div className="flex flex-col gap-0">
          <span className="text-white font-serif text-xl tracking-widest uppercase mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Dore</span>
          <span className="text-[var(--color-accent)] font-bold text-[9px] tracking-[0.3em] uppercase leading-none opacity-80">ADEM ADMIN</span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-3 rounded-none text-[11px] font-bold tracking-widest uppercase transition-all duration-300 group
              ${isActive 
                ? 'bg-white/5 text-[var(--color-accent)] border-l-2 border-[var(--color-accent)]' 
                : 'hover:text-white'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-[var(--color-accent)] scale-110' : 'text-white/30 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="py-6 px-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-red-400 transition-all duration-300"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
