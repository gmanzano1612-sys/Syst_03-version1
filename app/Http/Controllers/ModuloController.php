<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuloController extends Controller
{
    public function show($modulo) // <--- Debe llamarse igual que en la ruta ({modulo})
{
    // Si $modulo llega vacío, lo validamos aquí mismo para evitar el error
    if (!$modulo) {
        abort(404, 'Módulo no especificado.');
    }

    $nombreLimpio = ucfirst(strtolower($modulo));
    $componenteInertia = 'Modulos/' . $nombreLimpio;
    $rutaFisica = resource_path("js/Pages/{$componenteInertia}.jsx");

    if (!file_exists($rutaFisica)) {
        abort(404, "El módulo '{$modulo}' no tiene una vista asignada.");
    }

    return Inertia::render($componenteInertia, [
        'nombreModulo' => $modulo
    ]);
}
}