<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\EmpresaMensajeria;

class EmpresaMensajeriaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $empresasMensajeria = EmpresaMensajeria::all();
        return response()->json(['empresasMensajeria' => $empresasMensajeria]);
    }
}
