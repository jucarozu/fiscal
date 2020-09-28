<?php

namespace App\Services;

use App\VTComparendo;

use DB;

class ComparendoService
{
    public function __construct()
    {
        
    }

    public function get()
    {
        try
        {

        }
        catch(\Exception $e)
        {

        }
    }

    public function insert($comparendoArray)
    {
        try
        {
            // Ejecutar el procedimiento almacenado que realiza la generación del comparendo.
            DB::statement(
                'CALL SP_INSERT_COMPARENDO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                array_values($comparendoArray)
            );
        }
        catch(\Exception $e)
        {
            return false;
        }

        return true;
    }
}