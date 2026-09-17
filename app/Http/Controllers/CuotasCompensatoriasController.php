<?php

namespace App\Http\Controllers;

use App\Models\CalculoCuotaCompensatoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CuotasCompensatoriasController extends Controller
{
    public function index()
{
    $bitacora = CalculoCuotaCompensatoria::orderBy('id', 'desc')->get();

    return Inertia::render('Modulos/Cuotas', [ // <-- Asegúrate de que la ruta de la vista coincida con tu estructura de carpetas
        'bitacoraInicial' => $bitacora
    ]);
}

    public function store(Request $request)
    {
        // 1. Validar la información recibida desde React
        $validated = $request->validate([
            'pedimento' => 'nullable|string',
            'n_fraccion' => 'nullable|string',
            'operacion' => 'nullable|string',
            'capitulo' => 'nullable|string',
            'partida' => 'nullable|string',
            'subpartida' => 'nullable|string',
            'sector' => 'nullable|string',
            'producto' => 'nullable|string',
            'pais' => 'nullable|string',
            'empresa' => 'nullable|string',
            'uma' => 'nullable|string',
            'cantidad_valor_base' => 'nullable|numeric',
            'tipo_cuota' => 'nullable|string',
            'cuota_c' => 'nullable|numeric',
            'monto_cuota_usd' => 'nullable|numeric',
            'tipo_cambio_mxn' => 'nullable|numeric',
            'total_a_pagar_mxn' => 'nullable|numeric',
        ]);

        // 2. Guardar el registro en la base de datos (PostgreSQL)
        CalculoCuotaCompensatoria::create($validated);

        // 3. Retornar la respuesta con Inertia asegurando que devuelva la bitácora fresca
        return redirect()->back()->with('success', 'Cálculo guardado correctamente en la bitácora.');
    }
}