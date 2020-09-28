<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\VTPlacasSinDatos;

class PlacasSinDatosController extends Controller
{
    /**
     * Display a listing of the items.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $placas = VTPlacasSinDatos::orderBy("placa")->get();
        return response()->json(['placas' => $placas]);
    }

    /**
     * Display quantity of items.
     *
     * @return \Illuminate\Http\Response
     */
    public function count()
    {
        $cantPlacas = VTPlacasSinDatos::count();
        return response()->json(['cantPlacas' => $cantPlacas]);
    }
}
