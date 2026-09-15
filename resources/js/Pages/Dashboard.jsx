import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';


// ==========================================
// COMPONENTE: Red de Partículas Interactivas (Más Brillantes)
// ==========================================
function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const mouse = { x: null, y: null, radius: 150 };
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const particleCount = Math.floor((width * height) / 20000);
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1.2, // Partículas ligeramente más grandes
                color: Math.random() > 0.4 ? 'rgba(98, 17, 50, ' : 'rgba(179, 142, 93, '
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                // Aumentado el brillo y la opacidad del punto de la partícula
                ctx.fillStyle = p.color + '0.75)'; 
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        // Líneas con un toque más de visibilidad
                        let opacity = (1 - dist / 130) * 0.28;
                        ctx.strokeStyle = `rgba(98, 17, 50, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-85"
        />
    );
}

export default function Dashboard({ auth }) {
    const [activeTab, setActiveTab] = useState('todos');

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const modules = [
        { id: 1, name: 'SAM', description: 'Descripcion 1', icon: 'fa-solid fa-ship', routeName: 'sam', badge: 'Principal', category: 'operativo' },
        { id: 2, name: 'Pedimentos', description: 'Descripcion 2', icon: 'fa-solid fa-barcode', routeName: 'pedimentos', badge: 'Operativo', category: 'operativo' },
        { id: 3, name: 'Partiddas', description: 'Descripcion 3', icon: 'fa-shield-halved', routeName: 'partidas', badge: 'Seguridad', category: 'seguridad' },
        { id: 4, name: 'Reportes de Alertas', description: 'Descripcion 4', icon: 'fa-solid fa-triangle-exclamation', routeName: 'reportes', badge: 'Finanzas', category: 'finanzas' },
        { id: 5, name: 'Tipo de Persona', description: 'Descripcion 5', icon: 'fa-solid fa-magnifying-glass', routeName: 'tipop', badge: 'Logística', category: 'operativo' },
        { id: 6, name: 'Proveedores', description: 'Descripcion 6', icon: 'fa-solid fa-users-viewfinder', routeName: 'proveedores', badge: 'Trámites', category: 'operativo' },
        { id: 7, name: 'Analisis de Pedimentos', description: 'Descripcion 7', icon: 'fa-solid fa-chart-line', routeName: 'analisis', badge: 'Padrón', category: 'sistema' },
        { id: 8, name: 'SICADED', description: 'Descripcion 8', icon: 'fa-solid fa-money-bill-wave', routeName: 'sicaded', badge: 'Inteligencia', category: 'seguridad' },
        { id: 9, name: 'Subvaluacion', description: 'Descripcion 9', icon: 'fa-warehouse', routeName: 'subvaluacion', badge: 'Fiscal', category: 'finanzas' },
        { id: 10, name: 'Ficha Importador', description: 'Descripcion 10', icon: 'fa-truck-fast', routeName: 'f_importador', badge: 'Logística', category: 'operativo' },
        { id: 11, name: 'Fichas por Aduanas', description: 'Descripcion 11', icon: 'fa-solid fa-chart-pie', routeName: 'f_aduanas', badge: 'Fiscalización', category: 'seguridad' },
        { id: 12, name: 'Taxis Aereos', description: 'Descripcion 12', icon: 'fa-solid fa-plane', routeName: 'taereos', badge: 'Legal', category: 'seguridad' },
        { id: 13, name: 'Pagados no Despachados', description: 'Descripcion 13', icon: 'fa-solid fa-file-circle-xmark', routeName: 'nodespachados', badge: 'Reportes', category: 'sistema' },
        { id: 14, name: 'Incidencias de Laboratorio', description: 'Descripcion 14', icon: 'fa-solid fa-flask', routeName: 'laboratorio', badge: 'Sistema', category: 'sistema' },
        { id: 15, name: 'IDC', description: 'Descripcion 15', icon: 'fa-solid fa-file-shield', routeName: 'idc', badge: 'Seguridad', category: 'seguridad' },
        { id: 16, name: 'Busqueda Patente Aduanal', description: 'Descripcion 16', icon: 'fa-solid fa-user', routeName: 'patente', badge: 'Comunicación', category: 'sistema' },
        { id: 17, name: 'Cuotas Compensatorias', description: 'Calculo de Cuotas Compensatorias Correspondientes', icon: 'fa-scale-balanced', routeName: 'Cuotas', badge: 'Despacho', category: 'Despacho' },
        { id: 18, name: 'Pendiente 2', description: 'Descripcion 18', icon: 'fa-calendar-days', routeName: 'turnos', badge: 'Pendeiente', category: 'pendeiente' },
        { id: 19, name: 'Pendiente 3', description: 'Descripcion 19', icon: 'fa-user-shield', routeName: 'usuarios', badge: 'Pendeiente', category: 'pendeiente' },
        { id: 20, name: 'Pendiente 4', description: 'Descripcion 20', icon: 'fa-clock-rotate-left', routeName: 'bitacora', badge: 'Pendeiente', category: 'pendeiente' },
    ];

    const filteredModules = activeTab === 'todos' 
        ? modules 
        : modules.filter(m => m.category === activeTab);

    return (
        <>
            <Head title="Dashboard — Centro de Procesamiento de Datos">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                .diagonal-top-right {
                    clip-path: polygon(30% 0%, 100% 0%, 100% 100%, 0% 0%);
                }
                .diagonal-bottom-left {
                    clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(98, 17, 50, 0.25);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(98, 17, 50, 0.45);
                }
            `}</style>

            <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 font-['Plus_Jakarta_Sans'] overflow-hidden flex flex-col justify-between">
                
                <ParticleBackground />

                {/* Bandas geométricas decorativas fijas */}
                <div className="fixed top-0 right-0 w-[35%] h-[25%] pointer-events-none hidden lg:block overflow-hidden z-10 opacity-70">
                    <div className="absolute inset-0 bg-gradient-to-l from-white/40 via-[#621132]/60 to-[#621132] transform translate-x-3 -translate-y-3 diagonal-top-right"></div>
                    <div className="absolute inset-0 bg-gradient-to-bl from-[#621132] via-[#4d0d27] to-[#B38E5D] diagonal-top-right shadow-xl"></div>
                </div>

                <div className="fixed bottom-0 left-0 w-[35%] h-[25%] pointer-events-none hidden lg:block overflow-hidden z-10 opacity-70">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-[#621132]/60 to-[#621132] transform -translate-x-3 translate-y-3 diagonal-bottom-left"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#621132] via-[#4d0d27] to-[#B38E5D] diagonal-bottom-left shadow-xl"></div>
                </div>

                {/* ==========================================
                    BARRA SUPERIOR (Fija)
                ========================================== */}
                <header className="w-full bg-white/75 backdrop-blur-md border-b border-gray-200/50 fixed top-0 left-0 right-0 z-30 px-6 lg:px-12 py-3.5 flex justify-between items-center shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center overflow-hidden shadow-xs p-1">
                            <img 
                                src="logo.png" 
                                alt="Logo" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <span className="font-['Playfair_Display'] font-bold text-sm text-gray-900 tracking-tight block">
                                Centro de Procesamiento de Datos Aduaneros
                            </span>
                            <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#B38E5D] block">
                                SIA Fichas
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200/60 text-xs text-gray-700 font-medium">
                            <i className="fa-regular fa-user text-[#621132]"></i>
                            <span>{auth.user ? auth.user.name : 'Administrador'}</span>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="text-xs font-semibold text-gray-600 hover:text-[#621132] transition-colors flex items-center gap-2 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs cursor-pointer"
                        >
                            <i className="fa-solid fa-right-from-bracket text-[#621132]"></i>
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </button>
                    </div>
                </header>

                {/* ==========================================
                    CONTENIDO PRINCIPAL ESTÁTICO
                ========================================== */}
                <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6 relative z-25 flex-grow overflow-hidden flex">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full h-full">
                        
                        {/* ==========================================
                            COLUMNA IZQUIERDA: Estática
                        ========================================== */}
                        <aside className="lg:col-span-1 space-y-4 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar pr-1">
                            <div className="space-y-4">
                                {/* Tarjeta de Perfil Rápido */}
                                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#621132]/10 text-[#621132] flex items-center justify-center font-bold text-base">
                                            {auth.user ? auth.user.name.charAt(0) : 'A'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-xs text-gray-900 truncate">
                                                {auth.user ? auth.user.name : 'Usuario Operativo'}
                                            </h4>
                                            <span className="text-[0.65rem] text-emerald-600 font-semibold flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                En línea
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100 text-[0.7rem] text-gray-500 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Rol:</span>
                                            <span className="font-semibold text-gray-700">Operador</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Entorno:</span>
                                            <span className="font-semibold text-emerald-700">Producción</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Menú de Categorías / Filtros Laterales */}
                                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
                                    <h3 className="font-['Playfair_Display'] font-bold text-sm text-gray-900 mb-1 px-1">
                                        Filtrar Módulos
                                    </h3>
                                    <div className="flex flex-col space-y-1">
                                        <button 
                                            onClick={() => setActiveTab('todos')}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${activeTab === 'todos' ? 'bg-[#621132] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <i className="fa-solid fa-border-all"></i> Todos
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-[0.6rem] ${activeTab === 'todos' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                20
                                            </span>
                                        </button>

                                        <button 
                                            onClick={() => setActiveTab('operativo')}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'operativo' ? 'bg-[#621132] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <i className="fa-solid fa-boxes-stacked"></i> Operativos
                                        </button>

                                        <button 
                                            onClick={() => setActiveTab('seguridad')}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'seguridad' ? 'bg-[#621132] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <i className="fa-solid fa-shield-halved"></i> Seguridad
                                        </button>

                                        <button 
                                            onClick={() => setActiveTab('finanzas')}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'finanzas' ? 'bg-[#621132] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <i className="fa-solid fa-calculator"></i> Finanzas
                                        </button>

                                        <button 
                                            onClick={() => setActiveTab('sistema')}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'sistema' ? 'bg-[#621132] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <i className="fa-solid fa-gear"></i> Sistema
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('pendeiente')}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'pendeiente' ? 'bg-[#621132] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <i className="fa-solid fa-person-digging"></i> Pendientes
                                        </button>

                                        <button 
                                            onClick={() => setActiveTab('Despacho')}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'Despacho' ? 'bg-[#621132] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <i className="fa-solid fa-person-digging"></i> Despacho
                                        </button>
                                    </div>
                                </div>

                                {/* Tarjeta de Aviso Institucional */}
                                <div className="bg-gradient-to-br from-[#621132] to-[#4d0d27] rounded-2xl p-4 text-white shadow-md relative overflow-hidden hidden sm:block">
                                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#B38E5D]/20 rounded-full blur-xl pointer-events-none"></div>
                                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#B38E5D] block mb-0.5">
                                        Aviso Oficial
                                    </span>
                                    <h5 className="font-['Playfair_Display'] font-bold text-xs mb-1">
                                        Protocolos Aduaneros
                                    </h5>
                                    <p className="text-[0.7rem] text-gray-200 leading-relaxed opacity-90">
                                        Manifiestos electrónicos operando con normalidad.
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* ==========================================
                            COLUMNA DERECHA: Bienvenida Estática + Cuadrícula con Scroll
                        ========================================== */}
                        <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">

                            {/* Tarjeta de Bienvenida (Estática) */}
                            <div className="bg-white/90 backdrop-blur-md rounded-[20px] p-5 sm:p-6 shadow-sm border border-red-100/40 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shrink-0 mb-4">
                                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#B38E5D]/15 to-transparent rounded-bl-full pointer-events-none"></div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#B38E5D] block">
                                        Panel de Control General
                                    </span>
                                    <h3 className="font-['Playfair_Display'] font-bold text-xl sm:text-2xl text-gray-900">
                                        Módulos del Sistema
                                    </h3>
                                    <p className="text-gray-500 text-xs max-w-lg">
                                        Selecciona el módulo requerido para iniciar tus operaciones dentro del sistema aduanero.
                                    </p>
                                </div>
                                <div className="flex shrink-0">
                                    <div className="px-4 py-2.5 rounded-2xl bg-[#621132] text-white text-center shadow-md">
                                        <span className="block text-[0.6rem] font-medium text-[#B38E5D]">Disponibles</span>
                                        <span className="font-bold text-lg">{filteredModules.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cuadrícula de Módulos (Con Scroll interno) */}
                            <div className="overflow-y-auto custom-scrollbar pr-2 pb-10 flex-grow">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredModules.map((mod) => (
                                        <Link
                                            key={mod.id}
                                            href={route('modulo.show', { modulo: mod.routeName })} 
                                            className="group bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-gray-100..."
                                        >
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#621132] to-[#B38E5D] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="w-9 h-9 rounded-xl bg-[#621132]/5 text-[#621132] group-hover:bg-[#621132] group-hover:text-white transition-all duration-300 flex items-center justify-center text-sm shadow-xs">
                                                        <i className={`fa-solid ${mod.icon}`}></i>
                                                    </div>
                                                    <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-[#B38E5D]/15 group-hover:text-[#621132] transition-colors">
                                                        {mod.badge}
                                                    </span>
                                                </div>

                                                <h4 className="font-['Playfair_Display'] font-bold text-sm text-gray-900 group-hover:text-[#621132] transition-colors mb-1">
                                                    {mod.name}
                                                </h4>
                                                
                                                <p className="text-gray-500 text-[0.7rem] leading-relaxed line-clamp-2">
                                                    {mod.description}
                                                </p>
                                            </div>

                                            <div className="mt-4 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[0.7rem] font-semibold text-[#621132]">
                                                <span>Acceder</span>
                                                <i className="fa-solid fa-arrow-right-long transform group-hover:translate-x-1 transition-transform"></i>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                </main>

                {/* _packet_header = [102, 111, 114, 32, 109, 97, 114, 116, 104, 97] */}


                {/*var_org=[68,69,3271,85,73,76,76,69,82,77,79,32,77,65,78,90,65,78,79]*/}


                {/* FOOTER Estático */}
                <footer className="w-full text-center py-3 text-[0.7rem] text-gray-500 relative z-20 border-t border-gray-200/40 bg-white/40 shrink-0">
                    Centro de Procesamiento de Datos Aduaneros &copy; {new Date().getFullYear()}
                </footer>

            </div>
        </>
    );
}