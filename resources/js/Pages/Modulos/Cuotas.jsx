import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo } from 'react';

// ==========================================
// COMPONENTE: Red de Partículas (Fondo)
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
        const particleCount = Math.floor((width * height) / 25000);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
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
                ctx.fillStyle = p.color + '0.6)';
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

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-70" />;
}

export default function ManifiestosIndex({ auth }) {
    // ------------------------------------------
    // ESTADOS Y DATOS
    // ------------------------------------------
    const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false); // Estado para el modal de Verificador
    const [searchTerm, setSearchTerm] = useState('');

    // Estados del Verificador de Documentos
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [docLoading, setDocLoading] = useState(false);
    const [docResult, setDocResult] = useState(null);
    const [docError, setDocError] = useState(null);

    // Estado del Formulario de Cálculo
    const [formData, setFormData] = useState({
        pedimento: '',
        fraccion: '',
        operacion: 'Importación',
        capitulo: '',
        partida: '',
        subpartida: '',
        sector: '',
        producto: '',
        pais: '',
        empresa: '',
        uma: 'KG',
        cantidad: '',
        tipoCuota: 'monto',
        cuotaC: '',
        moneda: 'USD',
        tipoCambio: '18.50'
    });

    // Bitácora / Histórico simulado
    const [bitacora, setBitacora] = useState([
        {
            id: 1,
            fecha: '14/09/2026',
            pedimento: '4001234',
            empresa: 'Aceros Global S.A.',
            fraccion: '7210.70.01',
            producto: 'Lámina de acero',
            pais: 'China',
            operacion: 'Importación',
            capitulo: '72',
            partida: '7210',
            subpartida: '721070',
            sector: 'Siderúrgico',
            uma: 'KG',
            cantidad: '50000',
            tipoCuotaLabel: 'Monto ($)',
            cuotaC: '0.15',
            moneda: 'USD',
            tipoCambio: '18.50',
            resultado: '$7,500.00 USD',
            totalMXN: '$138,750.00 MXN'
        },
        {
            id: 2,
            fecha: '12/09/2026',
            pedimento: '4005678',
            empresa: 'Textiles del Norte S.A. de C.V.',
            fraccion: '5515.11.01',
            producto: 'Tejido de poliéster',
            pais: 'Vietnam',
            operacion: 'Importación',
            capitulo: '55',
            partida: '5515',
            subpartida: '551511',
            sector: 'Textil',
            uma: 'M2',
            cantidad: '12000',
            tipoCuotaLabel: 'Porcentaje (%)',
            cuotaC: '25',
            moneda: 'USD',
            tipoCambio: '18.45',
            resultado: '$3,000.00 USD',
            totalMXN: '$55,350.00 MXN'
        }
    ]);

    // Logout
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    // Handlers para el Formulario de Cálculo
    const handleFraccionChange = (e) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        setFormData(prev => ({
            ...prev,
            fraccion: value,
            capitulo: raw.length >= 2 ? raw.substring(0, 2) : '',
            partida: raw.length >= 4 ? raw.substring(0, 4) : '',
            subpartida: raw.length >= 6 ? raw.substring(0, 6) : ''
        }));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handler para enviar documento a la API FastAPI
    const handleDocSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDoc) {
            alert("Por favor selecciona un archivo primero.");
            return;
        }

        const dataForm = new FormData();
        dataForm.append('file', selectedDoc);

        setDocLoading(true);
        setDocResult(null);
        setDocError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/analizar/', {
                method: 'POST',
                body: dataForm
            });

            if (!response.ok) {
                throw new Error(`Error en el servidor: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Compatible con data.is_altered o data.is_valid
            const isAltered = data.is_altered !== undefined ? data.is_altered : !data.is_valid;

            setDocResult({
                isAltered,
                message: data.message || (isAltered ? '¡ALERTA DE POSIBLE ALTERACIÓN!' : 'Documento Íntegro y Verificado'),
                details: data.details || []
            });
        } catch (error) {
            console.error("Error al conectar con la API:", error);
            setDocError("Ocurrió un error al conectar con la API. Asegúrate de que el servidor uvicorn esté en ejecución.");
        } finally {
            setDocLoading(false);
        }
    };

    // Resetear formulario de documento
    const closeDocModal = () => {
        setIsDocModalOpen(false);
        setSelectedDoc(null);
        setDocResult(null);
        setDocError(null);
        setDocLoading(false);
    };

    // ------------------------------------------
    // CÁLCULOS MATEMÁTICOS
    // ------------------------------------------
    const cantidadNum = parseFloat(formData.cantidad) || 0;
    const cuotaCNum = parseFloat(formData.cuotaC) || 0;
    const tipoCambioNum = parseFloat(formData.tipoCambio) || 1;

    let totalCalculado = 0;
    if (formData.tipoCuota === 'monto') {
        totalCalculado = cantidadNum * cuotaCNum;
    } else {
        totalCalculado = cantidadNum * (cuotaCNum / 100);
    }

    const showConversion = formData.tipoCuota === 'porcentaje' || formData.moneda === 'USD';
    
    const resultadoFormatted = showConversion 
        ? `$${totalCalculado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
        : `$${totalCalculado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

    const montoUSDFormatted = `$${totalCalculado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const totalMXNNum = showConversion ? totalCalculado * tipoCambioNum : totalCalculado;
    const totalMXNFormatted = `$${totalMXNNum.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

    // ------------------------------------------
    // FUNCIÓN PARA GENERAR E IMPRIMIR PDF
    // ------------------------------------------
    const generarPDF = (itemData) => {
        const prev = document.getElementById('printContainer');
        if (prev) prev.remove();

        const printContainer = document.createElement('div');
        printContainer.id = 'printContainer';
        printContainer.innerHTML = `
            <style>
                @media print {
                    body * { visibility: hidden; }
                    #printContainer, #printContainer * { visibility: visible; }
                    #printContainer { position: absolute; left: 0; top: 0; width: 100%; padding: 25px; font-family: sans-serif; color: #111; }
                    .pdf-header { text-align: center; border-bottom: 2px solid #621132; padding-bottom: 12px; margin-bottom: 24px; }
                    .pdf-header h2 { color: #621132; margin: 0; font-size: 22px; text-transform: uppercase; font-weight: bold; }
                    .pdf-header p { font-size: 11px; color: #555; margin-top: 4px; }
                    .pdf-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
                    .pdf-table th { background-color: #621132; color: white; text-align: left; padding: 7px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .pdf-table td { border: 1px solid #e5e7eb; padding: 9px 12px; }
                    .pdf-table .label-col { background-color: #f9fafb; font-weight: bold; width: 28%; color: #374151; }
                    .highlight-row td { background-color: #f0fdf4 !important; color: #15803d !important; font-weight: bold; border-color: #bbf7d0 !important; }
                    .pdf-footer { text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 30px; }
                }
            </style>
            <div class="pdf-header">
                <h2>Ficha de Cálculo - Cuota Compensatoria</h2>
                <p>Centro de Procesamiento de Datos | Emisión: ${itemData.fecha || new Date().toLocaleDateString('es-MX')}</p>
            </div>

            <table class="pdf-table">
                <thead>
                    <tr><th colspan="4">1. Información General y de Identificación</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="label-col">Pedimento:</td>
                        <td>${itemData.pedimento || 'N/A'}</td>
                        <td class="label-col">Operación:</td>
                        <td>${itemData.operacion || 'Importación'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Empresa:</td>
                        <td>${itemData.empresa || 'N/A'}</td>
                        <td class="label-col">País de Origen:</td>
                        <td>${itemData.pais || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Sector:</td>
                        <td>${itemData.sector || 'N/A'}</td>
                        <td class="label-col">Producto:</td>
                        <td>${itemData.producto || 'N/A'}</td>
                    </tr>
                </tbody>

                <thead>
                    <tr><th colspan="4">2. Clasificación Arancelaria</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="label-col">Fracción Arancelaria:</td>
                        <td><strong>${itemData.fraccion || 'N/A'}</strong></td>
                        <td class="label-col">Desglose:</td>
                        <td>Cap. ${itemData.capitulo || '-'} | Part. ${itemData.partida || '-'} | Subp. ${itemData.subpartida || '-'}</td>
                    </tr>
                </tbody>

                <thead>
                    <tr><th colspan="4">3. Determinación y Liquidación de Cuota</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="label-col">UMA / Medida:</td>
                        <td>${itemData.uma || 'KG'}</td>
                        <td class="label-col">Cantidad / Valor Base:</td>
                        <td>${itemData.cantidad || '0'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tipo de Cuota:</td>
                        <td>${itemData.tipoCuotaLabel}</td>
                        <td class="label-col">Cuota C:</td>
                        <td>${itemData.cuotaC} ${itemData.tipoCuota === 'monto' ? itemData.moneda : '%'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Monto Resultado:</td>
                        <td>${itemData.resultado}</td>
                        <td class="label-col">Tipo Cambio (DOF):</td>
                        <td>$${itemData.tipoCambio} MXN</td>
                    </tr>
                    <tr class="highlight-row">
                        <td class="label-col">TOTAL ESTIMADO A PAGAR:</td>
                        <td colspan="3" style="font-size: 14px;"><strong>${itemData.totalMXN}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div class="pdf-footer">
                Documento oficial generado por el Centro de Procesamiento de Datos. Validez informativa.
            </div>
        `;

        document.body.appendChild(printContainer);
        window.print();
    };

    // Guardar nuevo registro desde el modal y emitir PDF
    const guardarFichaYGenerarPDF = () => {
        const nuevoRegistro = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString('es-MX'),
            pedimento: formData.pedimento || 'Sin especificar',
            fraccion: formData.fraccion || 'Sin especificar',
            capitulo: formData.capitulo || '-',
            partida: formData.partida || '-',
            subpartida: formData.subpartida || '-',
            sector: formData.sector || 'N/A',
            producto: formData.producto || 'N/A',
            pais: formData.pais || 'N/A',
            empresa: formData.empresa || 'N/A',
            operacion: formData.operacion,
            uma: formData.uma,
            cantidad: formData.cantidad || '0',
            tipoCuota: formData.tipoCuota,
            tipoCuotaLabel: formData.tipoCuota === 'monto' ? 'Monto ($)' : 'Porcentaje (%)',
            cuotaC: formData.cuotaC || '0',
            moneda: formData.moneda,
            tipoCambio: formData.tipoCambio || '18.50',
            resultado: resultadoFormatted,
            totalMXN: totalMXNFormatted
        };

        setBitacora([nuevoRegistro, ...bitacora]);
        setIsCalcModalOpen(false);
        generarPDF(nuevoRegistro);
    };

    // ------------------------------------------
    // FILTRADO DE LA BITÁCORA
    // ------------------------------------------
    const bitacoraFiltrada = useMemo(() => {
        if (!searchTerm.trim()) return bitacora;
        const query = searchTerm.toLowerCase();
        return bitacora.filter(item => 
            item.pedimento.toLowerCase().includes(query) ||
            item.empresa.toLowerCase().includes(query) ||
            item.fraccion.toLowerCase().includes(query) ||
            item.producto.toLowerCase().includes(query) ||
            item.pais.toLowerCase().includes(query)
        );
    }, [searchTerm, bitacora]);

    return (
        <>
            <Head title="Cuotas Compensatorias — Centro de Procesamiento de Datos">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
            </Head>

            <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 font-['Plus_Jakarta_Sans'] overflow-hidden flex flex-col justify-between relative">
                <ParticleBackground />

                {/* HEADER SUPERIOR */}
                <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/60 fixed top-0 left-0 right-0 z-30 px-6 lg:px-10 py-3 flex justify-between items-center shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link href={route('dashboard')} className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center overflow-hidden shadow-xs p-1 hover:border-[#621132] transition-colors">
                            <img src="logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </Link>
                        <div>
                            <span className="font-['Playfair_Display'] font-bold text-sm text-gray-900 tracking-tight block">
                                Módulo Cuotas Compensatorias
                            </span>
                            <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#B38E5D] block">
                                Despacho
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            href={route('dashboard')}
                            className="text-xs font-semibold text-gray-600 hover:text-[#621132] transition-colors flex items-center gap-2 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs cursor-pointer"
                        >
                            <i className="fa-solid fa-arrow-left text-[#621132]"></i>
                            <span>Dashboard</span>
                        </Link>

                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL: LAYOUT DE 2 COLUMNAS */}
                <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4 relative z-20 flex-grow overflow-hidden flex flex-col">
                    
                    <div className="mb-4">
                        <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Gestión de Cuotas Compensatorias
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Realice un nuevo cálculo o consulte e imprima expedientes registrados en la bitácora
                        </p>
                    </div>

                    {/* GRID DOS COLUMNAS */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden">
                        
                        {/* COLUMNA IZQUIERDA (OPCIONES EN BAJADA / MENÚ VERTICAL) */}
                        <div className="lg:col-span-4 flex flex-col gap-3">
                            
                            {/* Botón 1: Calcular Cuota */}
                            <button
                                onClick={() => setIsCalcModalOpen(true)}
                                className="w-full text-left bg-gradient-to-r from-[#621132] to-[#4d0d27] rounded-2xl p-4 text-white shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 group relative overflow-hidden flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#B38E5D] shrink-0 group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-calculator text-2xl"></i>
                                </div>
                                <div className="flex-grow">
                                    <span className="font-semibold text-sm tracking-wide block">Cálculo Cuota Compensatoria</span>
                                    <span className="text-[0.7rem] text-gray-200 block mt-0.5">Generar nueva ficha y cálculo de tributo</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-xs text-[#B38E5D]"></i>
                            </button>

                            {/* Botón 2: Verificador (Abre el modal de verificación) */}
                            <button
                                onClick={() => setIsDocModalOpen(true)}
                                className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-gray-200/80 shadow-xs hover:border-[#B38E5D] transition-all cursor-pointer flex items-center gap-4 group text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#621132] shrink-0 group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-file-circle-check text-xl"></i>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm text-gray-800 tracking-wide block">Verificador de Documentos</span>
                                    <span className="text-[0.7rem] text-gray-500 block mt-0.5">Analizador forense y detección de alteraciones</span>
                                </div>
                            </button>

                            {/* Botón 3: Proveedores */}
                            <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-gray-200/80 shadow-xs hover:border-[#B38E5D] transition-all cursor-pointer flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#B38E5D] shrink-0 group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-address-book text-xl"></i>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm text-gray-800 tracking-wide block">Proveedores Registrados</span>
                                    <span className="text-[0.7rem] text-gray-500 block mt-0.5">Directorio e historial de exportadores</span>
                                </div>
                            </div>

                            {/* Tarjeta Informativa Resumen */}
                            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-[#B38E5D]/30 rounded-2xl p-4 mt-auto">
                                <div className="flex items-center gap-2 text-[#621132] font-semibold text-xs mb-1">
                                    <i className="fa-solid fa-circle-info"></i>
                                    <span>Sistema de Consultas</span>
                                </div>
                                <p className="text-[0.75rem] text-gray-600 leading-relaxed">
                                    Las operaciones registradas quedan almacenadas en la bitácora lateral para su descarga en PDF en cualquier momento.
                                </p>
                            </div>

                        </div>

                        {/* COLUMNA DERECHA (BITÁCORA Y BÚSQUEDA DE PDF) */}
                        <div className="lg:col-span-8 bg-white/85 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-sm flex flex-col overflow-hidden">
                            
                            {/* Cabecera Bitácora + Buscador */}
                            <div className="p-4 border-b border-gray-200/80 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                    <h2 className="font-['Playfair_Display'] text-base font-bold text-[#621132] flex items-center gap-2">
                                        <i className="fa-solid fa-book text-[#B38E5D]"></i>
                                        Bitácora de Cálculos Realizados
                                    </h2>
                                    <span className="text-[0.7rem] text-gray-500">
                                        {bitacoraFiltrada.length} expedientes encontrados
                                    </span>
                                </div>

                                {/* Buscador / Filtro */}
                                <div className="relative w-full sm:w-64">
                                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                                    <input 
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar pedimento, empresa..."
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#621132] transition-colors"
                                    />
                                    {searchTerm && (
                                        <button 
                                            onClick={() => setSearchTerm('')} 
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Lista de Registros / Tabla */}
                            <div className="flex-grow overflow-y-auto p-4 space-y-3">
                                {bitacoraFiltrada.length > 0 ? (
                                    bitacoraFiltrada.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="bg-white rounded-xl border border-gray-200/70 p-3.5 hover:border-[#B38E5D] transition-all shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 group"
                                        >
                                            <div className="space-y-1 flex-grow">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-[#621132]/10 text-[#621132] font-bold text-[0.65rem] rounded-md">
                                                        Pedimento: {item.pedimento}
                                                    </span>
                                                    <span className="text-[0.65rem] text-gray-400">• {item.fecha}</span>
                                                </div>
                                                <h4 className="font-semibold text-xs text-gray-800">{item.empresa}</h4>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-gray-500">
                                                    <span><strong className="text-gray-700">Fracción:</strong> {item.fraccion}</span>
                                                    <span><strong className="text-gray-700">Prod:</strong> {item.producto}</span>
                                                    <span><strong className="text-gray-700">Origen:</strong> {item.pais}</span>
                                                </div>
                                            </div>

                                            {/* Monto y Botón PDF */}
                                            <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-2 shrink-0">
                                                <div className="text-right">
                                                    <span className="text-[0.65rem] uppercase text-gray-400 block">Total Liquidación</span>
                                                    <span className="font-bold text-xs text-green-700">{item.totalMXN}</span>
                                                </div>

                                                <button
                                                    onClick={() => generarPDF(item)}
                                                    className="px-3 py-1.5 bg-red-50 hover:bg-[#621132] text-[#621132] hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-red-200/60 shadow-xs cursor-pointer"
                                                    title="Abrir / Imprimir PDF de este cálculo"
                                                >
                                                    <i className="fa-solid fa-file-pdf"></i>
                                                    <span>Abrir PDF</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                                        <i className="fa-solid fa-folder-open text-4xl mb-2 text-gray-300"></i>
                                        <p className="text-xs font-medium">No se encontraron expedientes en la bitácora</p>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                </main>

                {/* FOOTER */}
                <footer className="w-full text-center py-2.5 text-[0.7rem] text-gray-500 relative z-20 border-t border-gray-200/40 bg-white/50 shrink-0">
                    Centro de Procesamiento de Datos &copy; {new Date().getFullYear()}
                </footer>
            </div>

            {/* ==========================================
                VENTANA EMERGENTE 1: MODAL CÁLCULO CUOTA
            ========================================== */}
            {isCalcModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header Modal */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#621132] flex items-center gap-2">
                                <i className="fa-solid fa-calculator text-[#B38E5D]"></i>
                                Nuevo Cálculo de Cuota Compensatoria
                            </h2>
                            <button 
                                onClick={() => setIsCalcModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-lg transition-colors cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                            
                            {/* SECCIÓN 1: IDENTIFICACIÓN */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">pedimento</label>
                                    <input 
                                        type="text" 
                                        id="pedimento"
                                        value={formData.pedimento} 
                                        onChange={handleInputChange} 
                                        placeholder="Ej. 24 16 3000 4001234"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">n_fraccion</label>
                                    <input 
                                        type="text" 
                                        id="fraccion"
                                        value={formData.fraccion} 
                                        onChange={handleFraccionChange} 
                                        placeholder="Ej. 7210.70.01"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">operación</label>
                                    <select 
                                        id="operacion"
                                        value={formData.operacion} 
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    >
                                        <option value="Importación">Importación</option>
                                        <option value="Exportación">Exportación</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">capitulo</label>
                                    <input 
                                        type="text" 
                                        id="capitulo"
                                        value={formData.capitulo} 
                                        onChange={handleInputChange} 
                                        placeholder="Ej. 72"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">partida</label>
                                    <input 
                                        type="text" 
                                        id="partida"
                                        value={formData.partida} 
                                        onChange={handleInputChange} 
                                        placeholder="Ej. 7210"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">subpartida</label>
                                    <input 
                                        type="text" 
                                        id="subpartida"
                                        value={formData.subpartida} 
                                        onChange={handleInputChange} 
                                        placeholder="Ej. 721070"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">sector</label>
                                    <input 
                                        type="text" 
                                        id="sector"
                                        value={formData.sector} 
                                        onChange={handleInputChange} 
                                        placeholder="Ej. Siderúrgico"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">producto</label>
                                    <input 
                                        type="text" 
                                        id="producto"
                                        value={formData.producto} 
                                        onChange={handleInputChange} 
                                        placeholder="Ej. Lámina de acero"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">pais</label>
                                    <input 
                                        type="text" 
                                        id="pais"
                                        value={formData.pais} 
                                        onChange={handleInputChange} 
                                        placeholder="Ej. China"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500 mb-1">empresa</label>
                                    <input 
                                        type="text" 
                                        id="empresa"
                                        value={formData.empresa} 
                                        onChange={handleInputChange} 
                                        placeholder="Ej. Aceros Global S.A."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#621132]"
                                    />
                                </div>
                            </div>

                            {/* SECCIÓN 2: FÓRMULA DE CÁLCULO */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-sm font-bold text-[#621132] flex items-center gap-2 mb-4">
                                    <i className="fa-solid fa-square-root-variable text-red-600"></i>
                                    Fórmula de Cálculo Cuota Compensatoria
                                </h3>

                                <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200/60">
                                    
                                    {/* LÍNEA 1: CÁLCULO BASE */}
                                    <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                                        
                                        <div className="w-full md:w-32">
                                            <label className="block text-[0.65rem] font-bold uppercase text-gray-500 mb-1">uma</label>
                                            <select 
                                                id="uma"
                                                value={formData.uma} 
                                                onChange={handleInputChange}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
                                            >
                                                <option value="KG">KG (Kilogramos)</option>
                                                <option value="PZA">PZA (Piezas)</option>
                                                <option value="L">L (Litros)</option>
                                                <option value="M2">M2 (Metros ²)</option>
                                            </select>
                                        </div>

                                        <div className="w-full md:flex-1">
                                            <label className="block text-[0.65rem] font-bold uppercase text-gray-500 mb-1">
                                                {formData.tipoCuota === 'porcentaje' ? 'valor en aduana' : 'cantidad / valor base'}
                                            </label>
                                            <input 
                                                type="number" 
                                                id="cantidad"
                                                value={formData.cantidad} 
                                                onChange={handleInputChange} 
                                                placeholder="0"
                                                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
                                            />
                                        </div>

                                        <div className="hidden md:flex items-center justify-center font-bold text-gray-400 text-sm pt-4">x</div>

                                        <div className="w-full md:w-36">
                                            <label className="block text-[0.65rem] font-bold uppercase text-gray-500 mb-1">tipo cuota</label>
                                            <select 
                                                id="tipoCuota"
                                                value={formData.tipoCuota} 
                                                onChange={handleInputChange}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
                                            >
                                                <option value="monto">Monto ($)</option>
                                                <option value="porcentaje">Porcentaje (%)</option>
                                            </select>
                                        </div>

                                        <div className="w-full md:w-44">
                                            <label className="block text-[0.65rem] font-bold uppercase text-gray-500 mb-1">cuota c</label>
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    type="number" 
                                                    id="cuotaC"
                                                    value={formData.cuotaC} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    step="0.01"
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
                                                />
                                                {formData.tipoCuota === 'monto' ? (
                                                    <select 
                                                        id="moneda"
                                                        value={formData.moneda} 
                                                        onChange={handleInputChange}
                                                        className="bg-white border border-gray-200 rounded-lg px-1.5 py-1.5 text-xs text-gray-800 focus:outline-none"
                                                    >
                                                        <option value="USD">USD</option>
                                                        <option value="MXN">MXN</option>
                                                    </select>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-200 rounded-lg text-xs font-bold text-gray-600">%</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="hidden md:flex items-center justify-center font-bold text-gray-400 text-sm pt-4">=</div>

                                        <div className="w-full md:w-48">
                                            <label className="block text-[0.65rem] font-bold uppercase text-[#621132]">resultado</label>
                                            <input 
                                                type="text" 
                                                value={resultadoFormatted} 
                                                readOnly 
                                                className="w-full bg-red-50/50 border border-red-200 text-[#621132] font-bold rounded-lg px-2.5 py-1.5 text-xs"
                                            />
                                        </div>

                                    </div>

                                    {/* LÍNEA 2: CONVERSIÓN A PESOS */}
                                    {showConversion && (
                                        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 pt-2 border-t border-gray-200/50">
                                            
                                            <div className="w-full md:w-48">
                                                <label className="block text-[0.65rem] font-bold uppercase text-[#621132]">monto cuota (USD)</label>
                                                <input 
                                                    type="text" 
                                                    value={montoUSDFormatted} 
                                                    readOnly 
                                                    className="w-full bg-amber-50 border border-amber-200 text-[#621132] font-semibold rounded-lg px-2.5 py-1.5 text-xs"
                                                />
                                            </div>

                                            <div className="hidden md:flex items-center justify-center font-bold text-gray-400 text-sm pt-4">x</div>

                                            <div className="w-full md:w-44">
                                                <label className="block text-[0.65rem] font-bold uppercase text-[#621132]">tipo de cambio ($ MXN)</label>
                                                <input 
                                                    type="number" 
                                                    id="tipoCambio"
                                                    value={formData.tipoCambio} 
                                                    onChange={handleInputChange} 
                                                    placeholder="18.50" 
                                                    step="0.01"
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
                                                />
                                            </div>

                                            <div className="hidden md:flex items-center justify-center font-bold text-gray-400 text-sm pt-4">=</div>

                                            <div className="w-full md:flex-1">
                                                <label className="block text-[0.65rem] font-bold uppercase text-green-700">total a pagar (MXN)</label>
                                                <input 
                                                    type="text" 
                                                    value={totalMXNFormatted} 
                                                    readOnly 
                                                    className="w-full bg-green-700 border border-green-800 text-white font-bold rounded-lg px-3 py-1.5 text-xs shadow-xs"
                                                />
                                            </div>

                                        </div>
                                    )}

                                </div>
                            </div>

                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button 
                                type="button" 
                                onClick={guardarFichaYGenerarPDF}
                                className="px-5 py-2.5 bg-[#621132] hover:bg-[#4d0d27] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <i className="fa-solid fa-file-pdf"></i> Guardar en Bitácora y Descargar PDF
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ==========================================
                VENTANA EMERGENTE 2: MODAL VERIFICADOR DE DOCUMENTOS
            ========================================== */}
            {isDocModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header Modal */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#621132] flex items-center gap-2">
                                <i className="fa-solid fa-shield-halved text-[#B38E5D]"></i>
                                Analizador Forense de Documentos
                            </h2>
                            <button 
                                onClick={closeDocModal}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-lg transition-colors cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto space-y-5 flex-grow">
                            <p className="text-xs text-gray-600">
                                Sube un documento (PDF o Imagen) para analizarlo mediante el API local en busca de inconsistencias o modificaciones.
                            </p>

                            {/* Formulario de Carga */}
                            <form onSubmit={handleDocSubmit} className="flex flex-col gap-4">
                                <label className="block">
                                    <span className="sr-only">Elige un archivo</span>
                                    <input 
                                        type="file" 
                                        accept=".pdf, .png, .jpg, .jpeg"
                                        onChange={(e) => setSelectedDoc(e.target.files[0] || null)}
                                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#621132] hover:file:bg-red-100 cursor-pointer border border-gray-200 rounded-xl p-1"
                                        required 
                                    />
                                </label>

                                <button 
                                    type="submit" 
                                    disabled={docLoading}
                                    className="bg-[#621132] hover:bg-[#4d0d27] disabled:bg-gray-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 shadow flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    {docLoading ? 'Analizando documento...' : 'Analizar Documento'}
                                </button>
                            </form>

                            {/* Indicator Spinner */}
                            {docLoading && (
                                <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs text-[#621132] font-semibold animate-pulse flex items-center justify-center gap-2">
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                        Analizando documento en busca de alteraciones...
                                    </p>
                                </div>
                            )}

                            {/* Alerta de Error de Conexión */}
                            {docError && (
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-lg text-amber-800 text-xs">
                                    <p className="font-semibold">{docError}</p>
                                </div>
                            )}

                            {/* Sección de Resultados / Alertas */}
                            {docResult && (
                                <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-xs space-y-3">
                                    
                                    {/* Caja de Estado */}
                                    <div className={`p-3.5 rounded-xl border-l-4 flex items-start gap-3 ${
                                        docResult.isAltered 
                                            ? 'bg-red-50 border-red-500 text-red-800' 
                                            : 'bg-green-50 border-green-500 text-green-800'
                                    }`}>
                                        <i className={`fa-solid text-base mt-0.5 ${
                                            docResult.isAltered ? 'fa-triangle-exclamation text-red-600' : 'fa-circle-check text-green-600'
                                        }`}></i>
                                        <div>
                                            <h3 className="font-bold text-xs uppercase tracking-wide">
                                                {docResult.isAltered ? '⚠️ ¡ALERTA DE POSIBLE ALTERACIÓN!' : '✅ Documento Íntegro'}
                                            </h3>
                                            <p className="text-xs mt-0.5">{docResult.message}</p>
                                        </div>
                                    </div>

                                    {/* Lista de Detalles Técnicos */}
                                    {docResult.details && docResult.details.length > 0 && (
                                        <div className="border-t border-gray-100 pt-3">
                                            <h4 className="font-semibold text-gray-700 text-xs mb-1.5 uppercase tracking-wider">
                                                Detalles del análisis técnico:
                                            </h4>
                                            <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                                                {docResult.details.map((detail, idx) => (
                                                    <li key={idx}>{detail}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                </div>
                            )}

                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button 
                                type="button" 
                                onClick={closeDocModal}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                            >
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}