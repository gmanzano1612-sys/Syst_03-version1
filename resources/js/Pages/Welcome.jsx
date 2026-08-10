import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Portal Gubernamental" />
            
            {/* Fondo general y selección de texto */}
            <div className="min-h-screen bg-[#f4f6f8] text-gray-800 font-sans selection:bg-[#B38E5D] selection:text-white flex flex-col">
                
                {/* 1. CINTA SUPERIOR (Estilo Gobierno) */}
                <div className="bg-[#1a1a1a] px-6 py-2 text-xs font-medium text-gray-300 tracking-widest uppercase">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <span>Portal de Gestión y Administración Pública</span>
                        <span>Plataforma Oficial</span>
                    </div>
                </div>

                {/* 2. ENCABEZADO INSTITUCIONAL */}
                <header className="bg-[#621132] border-b-4 border-[#B38E5D] shadow-md">
                    <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        
                        {/* Logo y Título */}
                        <div className="flex items-center gap-4">
                            {/* Escudo/Emblema Abstracto Institucional */}
                            <div className="flex h-16 w-16 items-center justify-center rounded bg-white/10 ring-1 ring-[#B38E5D]/50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#B38E5D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase tracking-wide">
                                    Sistema de Incidencias y Alertas
                                </h1>
                                <p className="text-[#B38E5D] text-sm font-semibold tracking-widest uppercase mt-1">
                                    SIA Fichas
                                </p>
                            </div>
                        </div>

                        {/* Navegación / Acceso */}
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="border border-[#B38E5D] bg-transparent px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-[#B38E5D] transition hover:bg-[#B38E5D] hover:text-white"
                                >
                                    Ir al Panel de Control
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-bold uppercase tracking-wider text-white transition hover:text-[#B38E5D] px-4 py-2"
                                    >
                                        Ingresar
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-[#B38E5D] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#8e6e44]"
                                    >
                                        Alta de Servidor
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* 3. CONTENIDO PRINCIPAL */}
                <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    
                    {/* Mensaje de Bienvenida Formal */}
                    <div className="mb-14 border-l-4 border-[#621132] pl-6">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            Bienvenido al portal de control operativo
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                            Esta plataforma centraliza los procesos administrativos, garantizando la transparencia, 
                            seguridad y eficiencia en el manejo de los recursos públicos e institucionales. 
                            El acceso está restringido a personal autorizado.
                        </p>
                    </div>

                    {/* Grid de Módulos (Estilo Dependencia de Gobierno) */}
                    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                        
                        {/* Módulo 1: Recursos Humanos */}
                        <div className="group bg-white border border-gray-200 p-8 shadow-sm transition duration-300 hover:border-[#B38E5D] hover:shadow-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#621132] transition-all duration-300 group-hover:w-2"></div>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-gray-50 text-[#621132]">
                                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Capital Humano</h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Gestión de expedientes de servidores públicos, control de nóminas, estructura organizacional y asignación de roles operativos.
                            </p>
                        </div>

                        {/* Módulo 2: Transparencia */}
                        <div className="group bg-white border border-gray-200 p-8 shadow-sm transition duration-300 hover:border-[#B38E5D] hover:shadow-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#621132] transition-all duration-300 group-hover:w-2"></div>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-gray-50 text-[#621132]">
                                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Rendición de Cuentas</h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Acceso al portal de transparencia, consulta de presupuestos, reportes financieros y auditorías en tiempo real.
                            </p>
                        </div>

                        {/* Módulo 3: Normatividad */}
                        <div className="group bg-white border border-gray-200 p-8 shadow-sm transition duration-300 hover:border-[#B38E5D] hover:shadow-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#621132] transition-all duration-300 group-hover:w-2"></div>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-gray-50 text-[#621132]">
                                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Control Documental</h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Repositorio oficial de lineamientos, leyes, reglamentos internos y actas administrativas bajo protocolos de alta seguridad.
                            </p>
                        </div>

                        {/* Módulo 4: Soporte */}
                        <div className="group bg-white border border-gray-200 p-8 shadow-sm transition duration-300 hover:border-[#B38E5D] hover:shadow-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#621132] transition-all duration-300 group-hover:w-2"></div>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-gray-50 text-[#621132]">
                                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.827m-1.528-1.528l-5.828-5.828a2.652 2.652 0 00-3.747 3.747l5.828 5.828m1.528 1.528l-1.528 1.528m-1.39-4.33a2 2 0 11-2.828-2.829 2 2 0 012.828 2.829z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Soporte Técnico (TI)</h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Mesa de servicio para la atención de incidencias tecnológicas, solicitud de equipos y reportes de fallas en la red institucional.
                            </p>
                        </div>

                    </div>
                </main>

                {/* 4. PIE DE PÁGINA (Estilo Gobierno) */}
                <footer className="bg-[#1a1a1a] text-gray-300 py-10 mt-auto border-t-4 border-[#621132]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-sm">
                        
                        {/* Columna 1 */}
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Atención Ciudadana</h4>
                            <p>Línea sin costo: 800 123 4567</p>
                            <p>Correo: contacto@institucion.gob.mx</p>
                        </div>
                        
                        {/* Columna 2 */}
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Enlaces Oficiales</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-[#B38E5D] transition">Aviso de Privacidad</a></li>
                                <li><a href="#" className="hover:text-[#B38E5D] transition">Directorio Institucional</a></li>
                                <li><a href="#" className="hover:text-[#B38E5D] transition">Normatividad</a></li>
                            </ul>
                        </div>
                        
                        {/* Columna 3 (Técnica) */}
                        <div className="md:text-right flex flex-col justify-end">
                            <p className="text-xs text-gray-500 mb-1">Tecnología de la plataforma:</p>
                            <p className="font-mono text-gray-400">Laravel v{laravelVersion}</p>
                            <p className="font-mono text-gray-400">PHP v{phpVersion}</p>
                            <p className="mt-4 text-xs text-gray-500">
                                © {new Date().getFullYear()} Sistema Institucional. Todos los derechos reservados.
                            </p>
                        </div>

                    </div>
                </footer>

            </div>

             {/* _packet_header = [102, 111, 114, 32, 109, 97, 114, 116, 104, 97] */}
        </>
    );
}