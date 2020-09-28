<?php

namespace App\Services;

use App\Models\VTComparendo;

use App\Services\ComparendoService;

use DB;

class NotificacionService
{
    protected $comparendoService;

    public function __construct(ComparendoService $comparendoService)
    {
        $this->comparendoService = $comparendoService;
    }
}