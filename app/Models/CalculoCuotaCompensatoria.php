<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalculoCuotaCompensatoria extends Model
{
    protected $table = 'calculo_cuota_compensatoria';

    // Tu tabla usa 'id' como llave primaria autoincremental
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    // Desactivamos los timestamps predeterminados de Laravel (created_at/updated_at) 
    // porque tu tabla usa 'fecha_creacion'
    public $timestamps = false;

    protected $fillable = [
        'pedimento',
        'n_fraccion',
        'operacion',
        'capitulo',
        'partida',
        'subpartida',
        'sector',
        'producto',
        'pais',
        'empresa',
        'uma',
        'cantidad_valor_base',
        'tipo_cuota',
        'cuota_c',
        'monto_cuota_usd',
        'tipo_cambio_mxn',
        'total_a_pagar_mxn',
    ];
}