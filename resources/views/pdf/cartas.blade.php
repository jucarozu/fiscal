@php
    // Obtener fecha actual.
    use App\Services\GeneralService;
    $array_fecha = explode('-', GeneralService::getFechaActual('j-F-Y'));
    $fecha_actual = $array_fecha[0] . " de " . $array_fecha[1] . " de " . $array_fecha[2];

    // Obtener evidencias de la infracción.
    use App\Services\EvidenciaService;
    $evidenciaService = new EvidenciaService();
    $evidencias = $evidenciaService->getByDeteccion($notif->deteccion);

    $evid_principal = null;
    $evid_placa = null;
    $ruta_evidencia = null;

    foreach ($evidencias as $evid)
    {
        if ($evid->principal == 1)
        {
            $evid_principal = $evid;
        }
        else if ($evid->placa == 1)
        {
            $evid_placa = $evid;
        }
    }
@endphp

{!! Html::style('angular/app/resources/css/cartas.pdf.css') !!}

<article id="cartas" class="container">
    <!-- ENCABEZADO -->
    <div class="row">
        <div class="col-xs-2">
            <!-- LOGO -->
            <div class="row">
                <div class="col-xs-12">
                    <div class="div-barcode">
                        <!-- Municipio -->
                        <img src="@php echo(storage_path('app/plantillas/logo_municipio.png')); @endphp" width="100px" height="100px" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-10">
            <!-- TÍTULO -->
            <div class="row">
                <div class="col-xs-12 div-center">
                    <h1>
                        {{ $institucion->nombre }}<br /> NIT {{ $institucion->nit }}
                    </h1>
                </div>
            </div>
        </div>
    </div>

    <!-- CABECERA -->
    <div class="row div-margin-out div-font-16">
        <!-- Ciudad y fecha -->
        <div class="col-xs-12">
            <div class="row">
                <div class="col-xs-12">
                    <span>{{ $institucion->municipio }}, {{ $institucion->departamento }}. {{ $fecha_actual }}</span>
                </div>
            </div>
        </div>
        <!-- Destinatario -->
        <div class="col-xs-12">
            <div class="row">
                <div class="col-xs-12 div-margin-dest">
                    <span>
                        Señor (a): <br />
                        <strong>{{ $notif->infr_nombres_apellidos }}</strong><br />
                        {{ $notif->notif_dir_descripcion }} <br />
                        {{ $notif->notif_dir_municipio }}, {{ $notif->notif_dir_departamento }}
                    </span>
                </div>
            </div>
        </div>
        <!-- Asunto -->
        <div class="col-xs-12">
            <div class="row">
                <div class="col-xs-12 div-align-right">
                    <span>
                        Asunto: Comparendo No. {{ $notif->numero }}, Infracción: {{ $notif->infr_codigo }}, Valor: ${{ number_format($notif->infr_valor, 0, ',', '.') }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- CUERPO -->
    <div class="row div-margin-out div-font-16">
        <div class="col-xs-12">
            <div class="row">
                <div class="col-xs-12 div-margin-cuerpo">
                    <p>
                        Le solicitamos comparecer personalmente a la Sede Principal de la {{ $institucion->nombre }}, ubicada en {{ $institucion->direccion }}; dentro de los once (11) días hábiles siguientes al recibo de la presente citación, a efectos de rendir descargos de la infracción del comparendo adjuntado. De conformidad con los artículos 136 y 137 de la ley 769 de 2002.
                    </p>
                    <p>
                        Tiene derecho a estar asistido por un apoderado si así lo desea. En la eventualidad de la no asistencia se registrará la sanción a su cargo en el registro de conductores e infractores en concordancia con lo dispuesto por la Ley 769 de 2002 y 1383 de 2010. Presentarse con documentación personal y del vehículo.
                    </p>
                    <p>
                        De conformidad con el Articulo 137 de la Ley 769 de 2002 Código Nacional de Tránsito Terrestre, se anexa la prueba de la comisión de la infracción:
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- EVIDENCIAS -->
    <div class="row div-margin-out div-outline-out div-font-16">
        <div class="col-xs-12">
            <div class="row">
                <div class="col-xs-6">
                    <div class="row">
                        <div class="col-xs-12 div-outline-in">
                            PRUEBA A
                        </div>
                        <div class="col-xs-12 div-outline-in">
                            @php
                                if (!is_null($evid_principal))
                                {
                                    // Se obtiene la extensión del archivo a partir del nombre original.
                                    $archivo_original = explode('.', $evid_principal->nombre_archivo);
                                    $extension = end($archivo_original);

                                    // Se obtiene la ruta donde se encuentra almacenada la evidencia.
                                    $ruta_evidencia = $evid_principal->ruta . str_pad($evid_principal->evidencia, 10, '0', STR_PAD_LEFT) . '.' . $extension;
                                }
                            @endphp

                            <img src="@php echo($ruta_evidencia); @endphp" width="400px" height="300px" />
                        </div>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div class="row">
                        <div class="col-xs-12 div-outline-in">
                            PRUEBA B
                        </div>
                        <div class="col-xs-12 div-outline-in">
                            @php
                                if (!is_null($evid_principal))
                                {
                                    // Se obtiene la extensión del archivo a partir del nombre original.
                                    $archivo_original = explode('.', $evid_placa->nombre_archivo);
                                    $extension = end($archivo_original);

                                    // Se obtiene la ruta donde se encuentra almacenada la evidencia.
                                    $ruta_evidencia = $evid_placa->ruta . str_pad($evid_placa->evidencia, 10, '0', STR_PAD_LEFT) . '.' . $extension;
                                }
                            @endphp

                            <img src="@php echo($ruta_evidencia); @endphp" width="400px" height="300px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- FIRMA -->
    <div class="row div-margin-out div-font-16">
        <div class="col-xs-12">
            <div class="row">
                <div class="col-xs-12 div-padding">
                    @if(!is_null($responsable->firma))
                        <img src="@php echo($resp_ruta_firma); @endphp" width="150px" height="80px" />
                    @else
                        <span>&nbsp;</span>
                    @endif
                </div>
                <div class="col-xs-12 div-padding">
                    <span>
                        <strong>{{ $responsable->nombres_apellidos }}</strong>
                        <br />{{ $responsable->cargo_desc }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- CONSULTA EN LÍNEA -->
    <div class="row div-margin-out div-font-16">
        <div class="col-xs-12">
            <div class="row">
                <div class="col-xs-12 div-padding div-align-right div-font-italic">
                    <span>
                        DATOS PARA LA CONSULTA EN LÍNEA
                        <br />URL: &nbsp; Placa: {{ $notif->placa_vehiculo }}
                        <br />Clave: &nbsp;
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- PIE DE PÁGINA -->
    <div class="row div-margin-out">
        <div class="col-xs-12">
            <div class="row">
                <div class="col-xs-8 div-margin-footer div-font-8">
                    <img src="@php echo(storage_path('app/plantillas/img_alcaldia_2016_2019.png')); @endphp" width="100%" />
                    <span>
                        OFICINA PRINCIPAL SEDE PLAN PAREJO: Carretera Troncal de Occidente, Calle 27 N° 26-335 Sector Plan Parejo - Centro Empresarial Villa Esmeralda
                        <br />OFICINA RODEO: Carretera Troncal de Occidente, Kilómetro 1 Vía a Turbaco, Cra 107 31-146 1er piso - EDS Petromil
                        <br />Sitio Web: www.transitoturbaco.gov.co - Email: info@transitoturbaco.gov.co
                        <br />Teléfono: (5) 661 5197 - FAX: (5) 661 5197
                    </span>
                </div>
                <div class="col-xs-4 div-padding">
                    <!-- Alcaldía de Turbaco 2016 - 2019 -->
                    <img src="@php echo(storage_path('app/plantillas/logo_alcaldia_2016_2019.png')); @endphp" width="260px" height="150px" />
                </div>
            </div>
        </div>
    </div>
</article>