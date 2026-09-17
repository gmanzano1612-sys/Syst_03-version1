<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ModuloController;
use App\Http\Controllers\FraccionArancelariaController;
use Inertia\Inertia;
use App\Http\Controllers\CuotasCompensatoriasController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 1. Rutas específicas primero
    Route::get('/cuotas-compensatorias', [CuotasCompensatoriasController::class, 'index'])->name('cuotas.index');
    Route::post('/cuotas-compensatorias', [CuotasCompensatoriasController::class, 'store'])->name('cuotas.store');

    // 2. Ruta para la búsqueda/autocompletado de fracciones (necesaria para el useEffect)
    Route::get('/api/fracciones-arancelarias', [FraccionArancelariaController::class, 'search'])->name('fracciones.search');

    // 3. Excluir 'cuotas-compensatorias' y 'api' en el regex de la ruta comodín
    Route::get('/{modulo}', [ModuloController::class, 'show'])
        ->where('modulo', '^(?!login$|register$|dashboard$|profile$|logout$|cuotas-compensatorias$|api$).*$')
        ->name('modulo.show');
});

require __DIR__.'/auth.php';