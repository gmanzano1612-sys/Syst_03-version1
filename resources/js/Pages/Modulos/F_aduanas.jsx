import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// ==========================================
// COMPONENTE: Red de Partículas (Misma línea visual)
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

        const particles = [];
        const particleCount = Math.floor((width * height) / 20000);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1.2,
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
                ctx.fillStyle = p.color + '0.75)';
                ctx.fill();
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-85" />;
}

export default function ManifiestosIndex({ auth }) {
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Control de Manifiestos — Centro de Procesamiento de Datos">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
            </Head>

            <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 font-['Plus_Jakarta_Sans'] overflow-hidden flex flex-col justify-between">
                <ParticleBackground />

                {/* BARRA SUPERIOR */}
                <header className="w-full bg-white/75 backdrop-blur-md border-b border-gray-200/50 fixed top-0 left-0 right-0 z-30 px-6 lg:px-12 py-3.5 flex justify-between items-center shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link href={route('dashboard')} className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center overflow-hidden shadow-xs p-1 hover:border-[#621132] transition-colors">
                            <img src="logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </Link>
                        <div>
                            <span className="font-['Playfair_Display'] font-bold text-sm text-gray-900 tracking-tight block">
                                Fichas Por Aduana
                            </span>
                            <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#B38E5D] block">
                                Módulo Operativo
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link 
                            href={route('dashboard')}
                            className="text-xs font-semibold text-gray-600 hover:text-[#621132] transition-colors flex items-center gap-2 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs cursor-pointer"
                        >
                            <i className="fa-solid fa-arrow-left text-[#621132]"></i>
                            <span>Regresar al Dashboard</span>
                        </Link>

                        <button 
                            onClick={handleLogout}
                            className="text-xs font-semibold text-gray-600 hover:text-[#621132] transition-colors flex items-center gap-2 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs cursor-pointer"
                        >
                            <i className="fa-solid fa-right-from-bracket text-[#621132]"></i>
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </button>
                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL DEL MÓDULO */}
                <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6 relative z-25 flex-grow overflow-hidden flex flex-col justify-center">
                    
                    {/* Tarjeta de Módulo en Desarrollo */}
                    <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-8 sm:p-12 shadow-sm border border-red-100/40 text-center max-w-2xl mx-auto w-full relative overflow-hidden">
                        
                        {/* Detalle visual sutil de fondo */}
                        <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-[#621132]/5 rounded-full pointer-events-none blur-2xl"></div>
                        <div className="absolute -left-12 -top-12 w-40 h-40 bg-[#B38E5D]/5 rounded-full pointer-events-none blur-2xl"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-[#621132]/10 text-[#621132] flex items-center justify-center text-3xl mb-6 shadow-inner">
                                <i className="fa-solid fa-person-digging"></i>
                            </div>

                            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#B38E5D] block mb-2">
                                Próximamente Disponible
                            </span>

                            <h2 className="font-['Playfair_Display'] font-bold text-2xl sm:text-3xl text-gray-900 mb-4">
                                Módulo en Desarrollo
                            </h2>

                            <p className="text-sm text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
                                Estamos trabajando en la integración de este apartado para ofrecerte una mejor experiencia.
                            </p>

                            <Link 
                                href={route('dashboard')}
                                className="px-6 py-3 bg-[#621132] hover:bg-[#4d0d27] text-white text-xs font-semibold rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                            >
                                <i className="fa-solid fa-house"></i> Volver al Inicio
                            </Link>
                        </div>
                    </div>

                </main>

                {/* FOOTER */}
                <footer className="w-full text-center py-3 text-[0.7rem] text-gray-500 relative z-20 border-t border-gray-200/40 bg-white/40 shrink-0">
                    Centro de Procesamiento de Datos &copy; {new Date().getFullYear()}
                </footer>

            </div>
        </>
    );
}