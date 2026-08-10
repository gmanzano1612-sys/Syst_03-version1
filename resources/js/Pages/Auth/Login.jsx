import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// ==========================================
// COMPONENTE: Red de Partículas Interactivas
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

        // Configuración del mouse
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

        // Creación de partículas
        const particleCount = Math.floor((width * height) / 18000); // Adaptable a la pantalla
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1.5,
                // Alternar entre tono vino y dorado para las partículas
                color: Math.random() > 0.4 ? 'rgba(98, 17, 50, ' : 'rgba(179, 142, 93, '
            });
        }

        // Bucle de animación
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Rebote en los bordes
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Dibujar partícula
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color + '0.6)';
                ctx.fill();

                // Conectar partículas cercanas (Efecto red que se conecta y desconecta)
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        // La opacidad disminuye dinámicamente según la distancia (se desconectan al alejarse)
                        let opacity = (1 - dist / 120) * 0.25;
                        ctx.strokeStyle = `rgba(98, 17, 50, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Interacción con el cursor del mouse
                if (mouse.x !== null && mouse.y !== null) {
                    let mdx = p.x - mouse.x;
                    let mdy = p.y - mouse.y;
                    let mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdist < mouse.radius) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        let mOpacity = (1 - mdist / mouse.radius) * 0.35;
                        ctx.strokeStyle = `rgba(179, 142, 93, ${mOpacity})`; // Línea dorada hacia el cursor
                        ctx.lineWidth = 1;
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
            className="absolute inset-0 pointer-events-none z-0 w-full h-full"
        />
    );
}

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión — Portal Institucional">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
            </Head>

            {/* Estilos CSS personalizados para los cortes diagonales */}
            <style>{`
                .diagonal-top-right {
                    clip-path: polygon(30% 0%, 100% 0%, 100% 100%, 0% 0%);
                }
                .diagonal-bottom-left {
                    clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
                }
            `}</style>

            <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] relative flex flex-col justify-between overflow-x-hidden">
                
                {/* LLAMADO AL FONDO DE PARTÍCULAS DINÁMICAS CONECTADAS */}
                <ParticleBackground />

                {/* ==========================================
                    1. BANDA GEOMÉTRICA SUPERIOR DERECHA (Vino y Dorado)
                ========================================== */}
                <div className="absolute top-0 right-0 w-[42%] h-[32%] pointer-events-none hidden lg:block overflow-hidden z-10">
                    <div className="absolute inset-0 bg-gradient-to-l from-[#B38E5D] to-[#621132] opacity-50 transform translate-x-3 -translate-y-3 diagonal-top-right"></div>
                    <div className="absolute inset-0 bg-gradient-to-bl from-[#621132] via-[#621132] to-[#B38E5D] diagonal-top-right shadow-2xl"></div>
                </div>

                {/* ==========================================
                    2. BANDA GEOMÉTRICA INFERIOR IZQUIERDA (Vino y Dorado)
                ========================================== */}
                <div className="absolute bottom-0 left-0 w-[42%] h-[32%] pointer-events-none hidden lg:block overflow-hidden z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B38E5D] to-[#621132] opacity-50 transform -translate-x-3 translate-y-3 diagonal-bottom-left"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#621132] via-[#621132] to-[#B38E5D] diagonal-bottom-left shadow-2xl"></div>
                </div>

                {/* HEADER SUPERIOR */}
                <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 pt-8 flex justify-between items-center relative z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center overflow-hidden shadow-sm p-1.2">
                            <img 
                                src="logo.png" 
                                alt="Logo Institucional" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="font-['Playfair_Display'] font-bold text-lg tracking-tight text-gray-900">
                            Centro de Procesamiento de Datos Aduaneros
                        </span>
                    </div>

                    <Link 
                        href="/Syst_01/public/" 
                        className="text-xs sm:text-sm font-medium text-gray-600 hover:text-[#621132] transition-colors flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-full border border-gray-200/80 shadow-xs"
                    >
                        <i className="fa-solid fa-arrow-left text-xs"></i>
                        <span>Volver al inicio</span>
                    </Link>
                </header>

                {/* ==========================================
                    3. CONTENIDO CENTRAL (Formulario Flotante)
                ========================================== */}
                <main className="w-full max-w-[440px] mx-auto px-6 relative z-20 my-auto py-10">
                    
                    <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(98,17,50,0.1)] border border-gray-100 relative">
                        
                        {/* Cabecera del Formulario */}
                        <div className="mb-8 text-center sm:text-left">
                            <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#B38E5D] block mb-1">
                                Acceso Seguro
                            </span>
                            <h1 className="font-['Playfair_Display'] font-bold text-3xl text-gray-900 mb-2">
                                Iniciar sesión
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Ingresa tus credenciales institucionales.
                            </p>
                        </div>

                        {/* Mensajes de estado */}
                        {status && (
                            <div className="mb-6 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
                                {status}
                            </div>
                        )}

                        {Object.keys(errors).length > 0 && (
                            <div className="bg-rose-50 border border-rose-100 p-3.5 mb-6 rounded-xl text-[#621132] text-xs flex items-center gap-2.5">
                                <i className="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
                                <span>{errors.email || errors.password || 'Por favor verifica los datos ingresados.'}</span>
                            </div>
                        )}

                        {/* Formulario */}
                        <form onSubmit={submit} className="space-y-4">
                            
                            {/* Input Correo */}
                            <div>
                                <label className="block mb-1.5 text-xs font-semibold text-gray-700 tracking-wide">
                                    CORREO ELECTRÓNICO
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <i className="fa-regular fa-envelope text-xs"></i>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        placeholder="usuario@institucion.gob"
                                        className="w-full py-3.5 pl-10 pr-4 bg-gray-50/60 border border-gray-200 rounded-xl text-sm text-gray-800 transition-all focus:outline-none focus:bg-white focus:border-[#621132] focus:ring-2 focus:ring-[#621132]/15"
                                    />
                                </div>
                            </div>

                            {/* Input Contraseña */}
                            <div>
                                <label className="block mb-1.5 text-xs font-semibold text-gray-700 tracking-wide">
                                    CONTRASEÑA
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <i className="fa-solid fa-lock text-xs"></i>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full py-3.5 pl-10 pr-10 bg-gray-50/60 border border-gray-200 rounded-xl text-sm text-gray-800 transition-all focus:outline-none focus:bg-white focus:border-[#621132] focus:ring-2 focus:ring-[#621132]/15"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#621132] transition-colors"
                                    >
                                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Opciones adicionales */}
                            <div className="flex items-center justify-between text-xs pt-1 pb-1">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#621132] focus:ring-[#621132]"
                                    />
                                    <span>Recordar sesión</span>
                                </label>

                                {canResetPassword && (
                                    <Link 
                                        href={route('password.request')} 
                                        className="font-semibold text-[#B38E5D] hover:text-[#621132] transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Botón de acción principal en Rojo Vino (#621132) */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-2 py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-[#621132] hover:bg-[#4d0d27] transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                                        <span>Ingresando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Iniciar sesión</span>
                                        <i className="fa-solid fa-arrow-right text-xs"></i>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Pie de tarjeta / Registro */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
                            ¿Aún no tienes una cuenta?{' '}
                            <Link href={route('register')} className="font-semibold text-[#621132] hover:underline">
                                Regístrate hier
                            </Link>
                        </div>
                    </div>
                </main>

                {/* FOOTER INFERIOR */}
                <footer className="w-full max-w-7xl mx-auto px-6 sm:px-12 pb-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 relative z-20 gap-2">
                    <p>© {new Date().getFullYear()} — Todos los derechos reservados.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-gray-600 cursor-pointer">Privacidad</span>
                        <span>•</span>
                        <span className="hover:text-gray-600 cursor-pointer">Términos</span>
                        <span>•</span>
                        <span className="hover:text-gray-600 cursor-pointer">Soporte</span>
                    </div>
                </footer>

            </div>
        </>
    );
}