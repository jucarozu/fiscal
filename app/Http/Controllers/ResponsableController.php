<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\VTResponsable;

use App\Services\ResponsableService;

class ResponsableController extends Controller
{
    protected $responsableService;

    public function __construct(ResponsableService $responsableService)
    {
        $this->responsableService = $responsableService;
    }

    /**
     * Display a listing of items.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $responsables = VTResponsable::all();
        return response()->json(['responsables' => $responsables]);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $responsable = VTResponsable::find($id);
        return response()->json(['responsable' => $responsable]);
    }

    public function getByTipoActo($tipo_acto)
    {
        $responsable = $this->responsableService->getByTipoActo($tipo_acto);
        return response()->json(['responsable' => $responsable]);
    }
}
