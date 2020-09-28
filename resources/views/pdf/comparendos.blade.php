@php
    // FECHA Y HORA IMPOSICIÓN
    $array_meses = array('01','02','03','04','05','06','07','08','09','10','11','12');
    $array_horas = array('00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23');
    $array_minutos = array('00','10','20','30','40','50');

    $fecha_imposicion = explode('-', $notif->fecha_imposicion);
    $hora_imposicion = explode(':', $notif->hora_imposicion);

    // Redondear minutos hacia abajo a la decena.
    $hora_imposicion[1] = intval($hora_imposicion[1] / 10) * 10;

    // TIPO DE VÍA
    $array_tipo_via = array('AV','CL','CR','AU','DG','TR');

    // PLACA
    $array_letras = array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
    
    // Letra moto
    $array_letras_motos = array('A','B','C','D');
    $letra_moto = null;
    
    // Si es Motocicleta
    if ($notif->clase_vehiculo == 9)
    {
        $array_placa_letras = substr($notif->placa_vehiculo, 0, 3);
        $array_placa_numeros = substr($notif->placa_vehiculo, 3, 5);
        $letra_moto = strlen($notif->clase_vehiculo == 6 ? substr($notif->placa_vehiculo, 5, 6) : null);
    }
    // Si es Motocarro
    else if ($notif->clase_vehiculo == 11)
    {
        $array_placa_numeros = substr($notif->placa_vehiculo, 0, 3);
        $array_placa_letras = substr($notif->placa_vehiculo, 3, 6);
    }
    // Si es Remolque/Semiremolque
    else if ($notif->clase_vehiculo == 15 || $notif->clase_vehiculo == 16)
    {
        $array_placa_letras = substr($notif->placa_vehiculo, 0, 1);
        $array_placa_numeros = substr($notif->placa_vehiculo, 1, 6);
    }
    // Si es otra clase de vehículo
    else
    {
        $array_placa_letras = substr($notif->placa_vehiculo, 0, 3);
        $array_placa_numeros = substr($notif->placa_vehiculo, 3, 6);
    }

    // INFRACCIÓN
    $array_letras_infraccion = array('A','B','C','D','E','F','G','H','I','J');
    $array_infraccion = str_split($notif->infr_codigo);

    // TIPOS DE VEHÍCULO
    $array_tipos_vehi = array(
        ['codigo' => [10], 'descripcion' => 'BICICLETA/TRICICLO'],
        ['codigo' => [14], 'descripcion' => 'TRACCIÓN ANIMAL'],
        ['codigo' => [1], 'descripcion' => 'AUTOMÓVIL'],
        ['codigo' => [6], 'descripcion' => 'CAMPERO'],
        ['codigo' => [5], 'descripcion' => 'CAMIONETA'],
        ['codigo' => [7], 'descripcion' => 'MICROBUS'],
        ['codigo' => [3], 'descripcion' => 'BUSETA'],
        ['codigo' => [2], 'descripcion' => 'BUS'],
        ['codigo' => [2], 'descripcion' => 'BUS ARTICULADO'],
        ['codigo' => [14], 'descripcion' => 'CAMIÓN'],
        ['codigo' => [14], 'descripcion' => 'VOLQUETA'],
        ['codigo' => [14], 'descripcion' => 'TRACTOCAMIÓN'],
        ['codigo' => [14], 'descripcion' => 'MOTOCICLO'],
        ['codigo' => [14], 'descripcion' => 'MOTOTRICICLO'],
        ['codigo' => [14], 'descripcion' => 'MOTOCARRO'],
        ['codigo' => [14], 'descripcion' => 'MOTOCICLETA'],
        ['codigo' => [14], 'descripcion' => 'CUATRIMOTO'],
        ['codigo' => [15, 16], 'descripcion' => 'REMOLQUE/SEMIREM.']
    );

    // CLASES DE SERVICIO
    $array_servicios_vehi = array(
        ['codigo' => 3, 'descripcion' => 'DIPLOMÁTICO'],
        ['codigo' => 4, 'descripcion' => 'OFICIAL'],
        ['codigo' => 1, 'descripcion' => 'PARTICULAR'],
        ['codigo' => 2, 'descripcion' => 'PÚBLICO']
    );

    // RADIO DE ACCIÓN
    $array_radio_accion = array(
        ['codigo' => 2, 'descripcion' => 'NACIONAL'],
        ['codigo' => 3, 'descripcion' => 'MUNICIPAL']
    );

    // MODALIDAD DE TRANSPORTE
    $array_modalidad = array(
        ['codigo' => 1, 'descripcion' => 'PASAJEROS'],
        ['codigo' => 3, 'descripcion' => 'MIXTO'],
        ['codigo' => 2, 'descripcion' => 'CARGA']
    );

    // TRANSPORTE DE PASAJEROS
    $array_pasajeros = array(
        ['codigo' => 1, 'descripcion' => 'INDIVIDUAL'],
        ['codigo' => 2, 'descripcion' => 'COLECTIVO'],
        ['codigo' => 3, 'descripcion' => 'MASIVO'],
        ['codigo' => 4, 'descripcion' => 'ESPECIAL', 'opciones' =>
            [
                ['codigo' => 1, 'descripcion' => 'ESCOLAR'],
                ['codigo' => 2, 'descripcion' => 'ASALARIADO'],
                ['codigo' => 3, 'descripcion' => 'DE TURISMO'],
                ['codigo' => 4, 'descripcion' => 'OCASIONAL']
            ]
        ]
    );

    // TIPOS DE DOCUMENTO
    $array_tipos_doc = array(
        1 => 'C.C.',
        2 => 'T.I.',
        3 => 'C.E.',
        4 => 'PASAP.'
    );

    // ORGANISMO VEHÍCULO
    $array_organismo_vehiculo = !is_null($notif->organismo_vehiculo) ? str_split($notif->organismo_vehiculo) : null;

    // LICENCIA TRÁNSITO VEHÍCULO
    $array_licencia_vehiculo = !is_null($notif->licencia_vehiculo) ? str_split($notif->licencia_vehiculo) : null;

    // NÚMERO DOCUMENTO INFRACTOR
    $array_infr_numero_doc = !is_null($notif->infr_numero_doc) ? str_split($notif->infr_numero_doc) : null;

    // LICENCIA CONDUCCIÓN INFRACTOR
    $array_lcond_numero = !is_null($notif->lcond_numero) ? str_split($notif->lcond_numero) : null;

    // CATEGORÍA LIC. CONDUCCIÓN
    $array_lcond_categoria = !is_null($notif->lcond_categoria) ? str_split($notif->lcond_categoria_desc) : null;

    // FECHA EXPEDICIÓN LIC. CONDUCCIÓN
    $array_lcond_expedicion = !is_null($notif->lcond_expedicion) ? explode(' ', $notif->lcond_expedicion) : null;
    $lcond_expedicion = !is_null($array_lcond_expedicion) ? explode('-', $array_lcond_expedicion[0]) : null;

    // FECHA VENCIMIENTO LIC. CONDUCCIÓN
    $array_lcond_vencimiento = !is_null($notif->lcond_vencimiento) ? explode(' ', $notif->lcond_vencimiento) : null;
    $lcond_vencimiento = !is_null($array_lcond_vencimiento) ? explode('-', $array_lcond_vencimiento[0]) : null;

    // NÚMERO DOCUMENTO PROPIETARIO
    $array_prop_numero_doc = !is_null($notif->prop_numero_doc) ? str_split($notif->prop_numero_doc) : null;
@endphp

{!! Html::style('angular/app/resources/css/comparendos.pdf.css') !!}

<article id="comparendos" class="container">
    <!-- ENCABEZADO -->
    <div class="row">
        <div class="col-xs-8">
            <!-- TÍTULO -->
            <div class="row">
                <div class="col-xs-12">
                    <h1>ORDEN DE COMPARENDO ÚNICO NACIONAL N° {{ $notif->numero }}</h1>
                </div>
            </div>
            <!-- 1. FECHA Y HORA -->
            <div class="row">
                <div class="col-xs-12">
                    <div class="row div-margin-out div-outline-out">
                        <div class="col-xs-12 div-bg-gray div-outline-in">
                            <h2>1. FECHA Y HORA</h2>
                        </div>
                    </div>
                    <div class="row">
                        <!-- AÑO Y MES -->
                        <div class="col-xs-4">
                            <div class="row div-margin-out div-outline-out">
                                <div class="col-xs-4">
                                    <div class="row">
                                        <div class="col-xs-12 div-bg-gray div-center div-padding div-outline-in">
                                            <span class="span-bold span-lg">AÑO</span>
                                        </div>
                                        <div class="col-xs-12 div-center div-padding div-outline-in">
                                            <span>{{ $fecha_imposicion[0] }}</span>
                                        </div>
                                        <div class="col-xs-12 div-bg-gray div-center div-padding div-outline-in">
                                            <span class="span-bold span-lg">DÍA</span>
                                        </div>
                                        <div class="col-xs-12 div-center div-padding div-outline-in">
                                            <span>{{ $fecha_imposicion[2] }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="row">
                                        <div class="col-xs-12 div-bg-gray div-center div-padding div-outline-in">
                                            <span class="span-bold span-lg">MES</span>
                                        </div>
                                        @foreach($array_meses as $mes)
                                            @if($mes == $fecha_imposicion[1])
                                                <div class="col-xs-3 div-bg-gray div-center div-padding div-outline-in">
                                                    <span>{{ $mes }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-3 div-center div-padding div-outline-in">
                                                    <span>{{ $mes }}</span>
                                                </div>
                                            @endif
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- HORA -->
                        <div class="col-xs-6">
                            <div class="row div-margin-out div-outline-out">
                                <div class="col-xs-12 div-bg-gray div-center div-padding div-outline-in">
                                    <span class="span-bold span-lg">HORA</span>
                                </div>
                                @foreach($array_horas as $hora)
                                    @if($hora == $hora_imposicion[0])
                                        <div class="col-xs-1 col-1-8-width div-bg-gray div-center div-padding div-outline-in">
                                            <span>{{ $hora }}</span>
                                        </div>
                                    @else
                                        <div class="col-xs-1 col-1-8-width div-center div-padding div-outline-in">
                                            <span>{{ $hora }}</span>
                                        </div>
                                    @endif
                                @endforeach
                            </div>
                        </div>
                        <!-- MINUTOS -->
                        <div class="col-xs-2">
                            <div class="row div-margin-out div-outline-out">
                                <div class="col-xs-12 div-bg-gray div-center div-padding div-outline-in">
                                    <span class="span-bold span-lg">MINUTOS</span>
                                </div>
                                @foreach($array_minutos as $minuto)
                                    @if($minuto == round($hora_imposicion[1], -1))
                                        <div class="col-xs-6 div-bg-gray div-center div-padding div-outline-in">
                                            <span>{{ $minuto }}</span>
                                        </div>
                                    @else
                                        <div class="col-xs-6 div-center div-padding div-outline-in">
                                            <span>{{ $minuto }}</span>
                                        </div>
                                    @endif
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-4">
            <!-- CÓDIGO DE BARRAS -->
            <div class="row">
                <div class="col-xs-12">
                    <h4>CÓDIGO DE BARRAS</h4>
                </div>
                <div class="col-xs-12">
                    <!-- Código de barras -->
                    <div class="div-barcode div-center">
                        @php echo DNS1D::getBarcodeHTML($notif->numero, "C128"); @endphp
                        <span>{{ $notif->numero }}</span>
                    </div>
                </div>
            </div>
            <!-- LOGO -->
            <div class="row">
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-12">
                            <h4>LOGO</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="div-barcode">
                                <!-- Escudo de Colombia -->
                                <img src="@php echo(storage_path('app/plantillas/logo_colombia.png')); @endphp" width="50px" height="50px" />
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="div-barcode">
                                <!-- Ministerio de Transporte -->
                                <img src="@php echo(storage_path('app/plantillas/logo_mintransporte.png')); @endphp" width="50px" height="50px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. LUGAR DE LA INFRACCIÓN -->
    <div class="row div-margin-out div-outline-out">
        <div class="col-xs-12">
            <div class="row div-outline-in">
                <div class="col-xs-12 div-bg-gray div-outline-in">
                    <h2>2. LUGAR DE LA INFRACCIÓN (VÍA, KILÓMETRO O SITIO, DIRECCIÓN)</h2>
                </div>
            </div>
            <div class="row div-outline-in">
                <div class="col-xs-8">
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="row">
                                <div class="col-xs-12 div-center div-padding div-outline-in">
                                    <span class="span-bold span-lg">VÍA PRINCIPAL</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-5">
                                    <div class="row">
                                        <div class="col-xs-12 div-center div-padding div-outline-in">
                                            <span class="span-bold">TIPO DE VÍA</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        @foreach($array_tipo_via as $tipo_via)
                                            <div class="col-xs-2 div-center div-padding div-outline-in option-list-xs">
                                                <span>{{ $tipo_via }}</span>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                                <div class="col-xs-7">
                                    <div class="row">
                                        <div class="col-xs-12 div-center div-padding div-outline-in">
                                            <span class="span-bold">NÚMERO O NOMBRE</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 div-center div-padding div-outline-in">
                                            <span>&nbsp;</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="row">
                                <div class="col-xs-12 div-center div-padding div-outline-in">
                                    <span class="span-bold span-lg">VÍA SECUNDARIA</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-5">
                                    <div class="row">
                                        <div class="col-xs-12 div-center div-padding div-outline-in">
                                            <span class="span-bold">TIPO DE VÍA</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        @foreach($array_tipo_via as $tipo_via)
                                            <div class="col-xs-2 div-center div-padding div-outline-in option-list-xs">
                                                <span>{{ $tipo_via }}</span>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                                <div class="col-xs-7">
                                    <div class="row">
                                        <div class="col-xs-12 div-center div-padding div-outline-in">
                                            <span class="span-bold">NÚMERO O NOMBRE</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 div-center div-padding div-outline-in">
                                            <span>&nbsp;</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-4">
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="row">
                                <div class="col-xs-12 div-center div-padding div-outline-in">
                                    <span class="span-bold">MUNICIPIO</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12 div-center div-padding div-outline-in div-rowspan-municipio">
                                    @if(!is_null($notif->div_municipio))
                                        <span>{{ $notif->div_municipio }}</span>
                                    @else
                                        <span>&nbsp;</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="row">
                                <div class="col-xs-12 div-center div-padding div-outline-in">
                                    <span class="span-bold">LOCALIDAD O COMUNA</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12 div-center div-padding div-outline-in div-rowspan-municipio">
                                    <span>&nbsp;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- PLACA - INFRACCIÓN - SERVICIO -->
    <div class="row">
        <div class="col-xs-12">
            <!-- 3. PLACA (MARQUE LETRAS) -->
            <div class="row div-margin-out div-outline-out">
                <div class="col-xs-12 div-bg-gray div-outline-in">
                    <h2>3. PLACA (MARQUE LETRAS)</h2>
                </div>

                <!-- INICIO LETRA 1 -->
                <div class="col-xs-12">
                    <div class="row">
                        @foreach($array_letras as $letra)
                            @if($letra == $array_placa_letras[0])
                                <div class="col-xs-1 col-1-26-width div-bg-gray div-center div-padding div-outline-in option-list-md">
                                    <span>{{ $letra }}</span>
                                </div>
                            @else
                                <div class="col-xs-1 col-1-26-width div-center div-padding div-outline-in option-list-md">
                                    <span>{{ $letra }}</span>
                                </div>
                            @endif
                        @endforeach
                    </div>
                </div>
                <!-- FIN LETRA 1 -->

                <!-- INICIO LETRA 2 -->
                <div class="col-xs-12">
                    <div class="row">
                        @foreach($array_letras as $letra)
                            @if($letra == $array_placa_letras[1])
                                <div class="col-xs-1 col-1-26-width div-bg-gray div-center div-padding div-outline-in option-list-md">
                                    <span>{{ $letra }}</span>
                                </div>
                            @else
                                <div class="col-xs-1 col-1-26-width div-center div-padding div-outline-in option-list-md">
                                    <span>{{ $letra }}</span>
                                </div>
                            @endif
                        @endforeach
                    </div>
                </div>
                <!-- FIN LETRA 2 -->

                <!-- INICIO LETRA 3 -->
                <div class="col-xs-12">
                    <div class="row">
                        @foreach($array_letras as $letra)
                            @if($letra == $array_placa_letras[2])
                                <div class="col-xs-1 col-1-26-width div-bg-gray div-center div-padding div-outline-in option-list-md">
                                    <span>{{ $letra }}</span>
                                </div>
                            @else
                                <div class="col-xs-1 col-1-26-width div-center div-padding div-outline-in option-list-md">
                                    <span>{{ $letra }}</span>
                                </div>
                            @endif
                        @endforeach
                    </div>
                </div>
                <!-- FIN LETRA 3 -->
            </div>
            <div class="row">
                <div class="col-xs-4">
                    <!-- 4. PLACA (MARQUE NÚMERO) -->
                    <div class="row div-margin-out div-outline-out">
                        <div class="col-xs-12 div-bg-gray div-outline-in">
                            <h2>4. PLACA (MARQUE NÚMERO)</h2>
                        </div>

                        <!-- INICIO NÚMERO 1 -->
                        <div class="col-xs-12">
                            <div class="row">
                                @for($i = 0; $i <= 9; $i++)
                                    @if($i == $array_placa_numeros[0])
                                        <div class="col-xs-1 col-1-10-width div-bg-gray div-center div-padding div-outline-in option-list-md">
                                            <span>{{ $i }}</span>
                                        </div>
                                    @else
                                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                                            <span>{{ $i }}</span>
                                        </div>
                                    @endif
                                @endfor
                            </div>
                        </div>
                        <!-- FIN NÚMERO 1 -->

                        <!-- INICIO NÚMERO 2 -->
                        <div class="col-xs-12">
                            <div class="row">
                                @for($i = 0; $i <= 9; $i++)
                                    @if($i == $array_placa_numeros[1])
                                        <div class="col-xs-1 col-1-10-width div-bg-gray div-center div-padding div-outline-in option-list-md">
                                            <span>{{ $i }}</span>
                                        </div>
                                    @else
                                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                                            <span>{{ $i }}</span>
                                        </div>
                                    @endif
                                @endfor
                            </div>
                        </div>
                        <!-- FIN NÚMERO 2 -->

                        <!-- INICIO NÚMERO 3 -->
                        <div class="col-xs-12">
                            <div class="row">
                                @for($i = 0; $i <= 9; $i++)
                                    @if($i == $array_placa_numeros[2])
                                        <div class="col-xs-1 col-1-10-width div-bg-gray div-center div-padding div-outline-in option-list-md">
                                            <span>{{ $i }}</span>
                                        </div>
                                    @else
                                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                                            <span>{{ $i }}</span>
                                        </div>
                                    @endif
                                @endfor
                            </div>
                        </div>
                        <!-- FIN NÚMERO 3 -->

                        <!-- INICIO NÚMERO 4 -->
                        <div class="col-xs-12">
                            <div class="row">
                                @for($i = 0; $i <= 9; $i++)
                                    <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                                        <span>{{ $i }}</span>
                                    </div>
                                @endfor
                            </div>
                        </div>
                        <!-- FIN NÚMERO 4 -->

                        <div class="col-xs-12 div-outline-in">
                            <div class="row">
                                <div class="col-xs-12 div-padding">
                                    <span class="span-bold">MATRICULADO EN:</span>
                                </div>
                                <div class="col-xs-12 div-padding">
                                    @if(!is_null($notif->organismo_vehiculo_desc))
                                        <span>{{ $notif->organismo_vehiculo_desc }}</span>
                                    @else
                                        <span>&nbsp;</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="row">
                        <div class="col-xs-4">
                            <!-- LETRAS (MOTOS) -->
                            <div class="row div-margin-out div-outline-out">
                                <div class="col-xs-12 div-bg-gray div-outline-in">
                                    <h2>LETRAS (MOTOS)</h2>
                                </div>

                                <!-- INICIO LETRA 1 -->
                                <div class="col-xs-12">
                                    <div class="row">
                                        @foreach($array_letras_motos as $letra)
                                            @if($letra == $letra_moto)
                                                <div class="col-xs-3 div-bg-gray div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-3 div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @endif
                                        @endforeach
                                    </div>
                                </div>
                                <!-- FIN LETRA 1 -->

                                <!-- INICIO LETRA 2 -->
                                <div class="col-xs-12">
                                    <div class="row">
                                        @foreach($array_letras_motos as $letra)
                                            @if($letra == $letra_moto)
                                                <div class="col-xs-3 div-bg-gray div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-3 div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @endif
                                        @endforeach
                                    </div>
                                </div>
                                <!-- FIN LETRA 2 -->

                                <!-- INICIO LETRA 3 -->
                                <div class="col-xs-12">
                                    <div class="row">
                                        @foreach($array_letras_motos as $letra)
                                            @if($letra == $letra_moto)
                                                <div class="col-xs-3 div-bg-gray div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-3 div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @endif
                                        @endforeach
                                    </div>
                                </div>
                                <!-- FIN LETRA 3 -->

                                <!-- INICIO LETRA 4 -->
                                <div class="col-xs-12">
                                    <div class="row">
                                        @foreach($array_letras_motos as $letra)
                                            @if($letra == $letra_moto)
                                                <div class="col-xs-3 div-bg-gray div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-3 div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @endif
                                        @endforeach
                                    </div>
                                </div>
                                <!-- FIN LETRA 4 -->
                            </div>
                        </div>
                        <div class="col-xs-8">
                            <!-- 5. CÓDIGO DE LA INFRACCIÓN -->
                            <div class="row div-margin-out div-outline-out">
                                <div class="col-xs-12 div-bg-gray div-outline-in">
                                    <h2>5. CÓDIGO DE INFRACCIÓN</h2>
                                </div>

                                <!-- INICIO LETRA -->
                                <div class="col-xs-12">
                                    <div class="row">
                                        @foreach($array_letras_infraccion as $letra)
                                            @if($letra == $array_infraccion[0])
                                                <div class="col-xs-1 col-1-10-width div-bg-gray div-center div-padding div-outline-in option-list-lg">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-lg">
                                                    <span>{{ $letra }}</span>
                                                </div>
                                            @endif
                                        @endforeach
                                    </div>
                                </div>
                                <!-- FIN LETRA -->

                                <!-- INICIO NÚMERO 1 -->
                                <div class="col-xs-12">
                                    <div class="row">
                                        @for($i = 0; $i <= 9; $i++)
                                            @if($i == $array_infraccion[1])
                                                <div class="col-xs-1 col-1-10-width div-bg-gray div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $i }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $i }}</span>
                                                </div>
                                            @endif
                                        @endfor
                                    </div>
                                </div>
                                <!-- FIN NÚMERO 1 -->

                                <!-- INICIO NÚMERO 2 -->
                                <div class="col-xs-12">
                                    <div class="row">
                                        @for($i = 0; $i <= 9; $i++)
                                            @if($i == $array_infraccion[2])
                                                <div class="col-xs-1 col-1-10-width div-bg-gray div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $i }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                                                    <span>{{ $i }}</span>
                                                </div>
                                            @endif
                                        @endfor
                                    </div>
                                </div>
                                <!-- FIN NÚMERO 2 -->
                            </div>
                        </div>
                    </div>
                    <!-- 6. CLASE DE SERVICIO -->
                    <div class="row div-margin-out div-outline-out">
                        <div class="col-xs-12 div-bg-gray div-outline-in">
                            <h2>6. CLASE DE SERVICIO</h2>
                        </div>
                        @for($i = 0; $i < 4; $i++)
                            <div class="col-xs-3">
                                <div class="row">
                                    <div class="col-xs-10 div-padding div-outline-in">
                                        <span>{{ $array_servicios_vehi[$i]['descripcion'] }}</span>
                                    </div>
                                    <div class="col-xs-2 div-center div-padding div-outline-in">
                                        @if ($array_servicios_vehi[$i]['codigo'] == $notif->servicio_vehiculo)
                                            <span>X</span>
                                        @else
                                            <span>&nbsp;</span>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        @endfor
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- TIPO VEHÍCULO - RADIO DE ACCIÓN - MODALIDAD - INFRACTOR -->
    <div class="row">
        <div class="col-xs-4">
            <!-- 7. TIPO DE VEHÍCULO -->
            <div class="row div-margin-out div-outline-out">
                <div class="col-xs-12 div-bg-gray div-outline-in">
                    <h2>7. TIPO DE VEHÍCULO</h2>
                </div>
                <div class="col-xs-6 option-list-xs">
                    @for($i = 0; $i < 9; $i++)
                        <div class="row">
                            <div class="col-xs-10 div-padding div-outline-in">
                                <span>{{ $array_tipos_vehi[$i]['descripcion'] }}</span>
                            </div>
                            <div class="col-xs-2 div-center div-padding div-outline-in">
                                @if (in_array($notif->clase_vehiculo, $array_tipos_vehi[$i]['codigo']))
                                    <span>X</span>
                                @else
                                    <span>&nbsp;</span>
                                @endif    
                            </div>
                        </div>
                    @endfor
                </div>
                <div class="col-xs-6 option-list-xs">
                    @for($i = 9; $i < 18; $i++)
                        <div class="row">
                            <div class="col-xs-10 div-padding div-outline-in">
                                <span>{{ $array_tipos_vehi[$i]['descripcion'] }}</span>
                            </div>
                            <div class="col-xs-2 div-padding div-outline-in">
                                @if (in_array($notif->clase_vehiculo, $array_tipos_vehi[$i]['codigo']))
                                    <span>X</span>
                                @else
                                    <span>&nbsp;</span>
                                @endif    
                            </div>
                        </div>
                    @endfor
                </div>
            </div>
            <!-- 11. TIPO DE INFRACTOR -->
            <div class="row div-margin-out div-outline-out">
                <div class="col-xs-12 div-bg-gray div-outline-in">
                    <h2>11. TIPO DE INFRACTOR</h2>
                </div>
                <div class="col-xs-11 div-padding div-outline-in">
                    <span>CONDUCTOR</span>
                </div>
                <div class="col-xs-1 div-center div-padding div-outline-in">
                    <span>X</span>
                </div>
                <div class="col-xs-11 div-padding div-outline-in">
                    <span>PEATÓN</span>
                </div>
                <div class="col-xs-1 div-center div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
                <div class="col-xs-11 div-padding div-outline-in">
                    <span>PASAJERO</span>
                </div>
                <div class="col-xs-1 div-center div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
            <!-- 12. LICENCIA DE TRÁNSITO -->
            <div class="row div-margin-out div-outline-out">
                <div class="col-xs-12 div-bg-gray div-outline-in">
                    <h2>12. LICENCIA DE TRÁNSITO</h2>
                </div>
                <div class="col-xs-4">
                    <div class="row">
                        <div class="col-xs-12 div-padding div-outline-in">
                            <span class="span-bold">ORG. DE TTO</span>
                        </div>
                        <div class="col-xs-12">
                            <div class="row">
                                @for ($i = 0; $i < 6; $i++)
                                    <div class="col-xs-2 div-center div-padding div-outline-in option-list-md">
                                        @if(!is_null($array_organismo_vehiculo) && $i < count($array_organismo_vehiculo))
                                            <span>{{ $array_organismo_vehiculo[$i] }}</span>
                                        @else
                                            <span>&nbsp;</span>
                                        @endif
                                    </div>
                                @endfor
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="row">
                        <div class="col-xs-12 div-padding div-outline-in">
                            <span class="span-bold">NÚMERO DEL DOCUMENTO</span>
                        </div>
                        <div class="col-xs-12">
                            <div class="row">
                                @for ($i = 0; $i < 7; $i++)
                                    <div class="col-xs-1 col-1-7-width div-center div-padding div-outline-in option-list-md">
                                        @if(!is_null($array_licencia_vehiculo) && $i < count($array_licencia_vehiculo))
                                            <span>{{ $array_licencia_vehiculo[$i] }}</span>
                                        @else
                                            <span>&nbsp;</span>
                                        @endif
                                    </div>
                                @endfor
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-8">
            <div class="row">
                <div class="col-xs-5">
                    <!-- 8. RADIO DE ACCIÓN -->
                    <div class="row div-margin-out div-outline-out">
                        <div class="col-xs-12 div-bg-gray div-outline-in">
                            <h2>8. RADIO DE ACCIÓN</h2>
                        </div>
                        @for($i = 0; $i < 2; $i++)
                            <div class="col-xs-6">
                                <div class="row">
                                    <div class="col-xs-10 div-padding div-outline-in">
                                        <span>{{ $array_radio_accion[$i]['descripcion'] }}</span>
                                    </div>
                                    <div class="col-xs-2 div-center div-padding div-outline-in">
                                        @if ($array_radio_accion[$i]['codigo'] == $notif->radio_accion)
                                            <span>X</span>
                                        @else
                                            <span>&nbsp;</span>
                                        @endif    
                                    </div>
                                </div>
                            </div>
                        @endfor
                    </div>
                </div>
                <div class="col-xs-7">
                    <!-- 9. MODALIDAD DE TRANSPORTE -->
                    <div class="row div-margin-out div-outline-out">
                        <div class="col-xs-12 div-bg-gray div-outline-in">
                            <h2>9. MODALIDAD DE TRANSPORTE</h2>
                        </div>
                        @for($i = 0; $i < 3; $i++)
                            <div class="col-xs-4">
                                <div class="row">
                                    <div class="col-xs-10 div-padding div-outline-in">
                                        <span>{{ $array_modalidad[$i]['descripcion'] }}</span>
                                    </div>
                                    <div class="col-xs-2 div-center div-padding div-outline-in">
                                        @if ($array_modalidad[$i]['codigo'] == $notif->modalidad)
                                            <span>X</span>
                                        @else
                                            <span>&nbsp;</span>
                                        @endif    
                                    </div>
                                </div>
                            </div>
                        @endfor
                    </div>
                </div>
            </div>
            <!-- 9.1. TRANSPORTE DE PASAJEROS -->
            <div class="row div-margin-out div-outline-out">
                <div class="col-xs-12 div-bg-gray div-outline-in">
                    <h3>9.1. TRANSPORTE DE PASAJEROS</h3>
                </div>
                <div class="col-xs-8">
                    <div class="row">
                        @for($i = 0; $i < 3; $i++)
                            <div class="col-xs-4">
                                <div class="row">
                                    <div class="col-xs-10 div-padding div-outline-in div-rowspan-pasajeros-out">
                                        <span>{{ $array_pasajeros[$i]['descripcion'] }}</span>
                                    </div>
                                    <div class="col-xs-2 div-center div-padding div-outline-in div-rowspan-pasajeros-out">
                                        @if ($array_pasajeros[$i]['codigo'] == $notif->tipo_pasajero)
                                            <span>X</span>
                                        @else
                                            <span>&nbsp;</span>
                                        @endif    
                                    </div>
                                </div>
                            </div>
                        @endfor
                    </div>
                </div>
                <div class="col-xs-4">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="row">
                                <div class="col-xs-4 div-padding div-outline-in div-rowspan-pasajeros-out">
                                    <span>{{ $array_pasajeros[3]['descripcion'] }}</span>
                                </div>
                                <div class="col-xs-8">
                                    @for($i = 0; $i < 4; $i++)
                                        <div class="row">
                                            <div class="col-xs-10 div-padding div-outline-in div-rowspan-pasajeros-in option-list-xs">
                                                <span>{{ $array_pasajeros[3]['opciones'][$i]['descripcion'] }}</span>
                                            </div>
                                            <div class="col-xs-2 div-center div-padding div-outline-in div-rowspan-pasajeros-in option-list-xs">
                                                @if ($array_pasajeros[$i]['codigo'] == 4 && $array_pasajeros[3]['opciones'][$i]['codigo'] == $notif->tipo_pasajero)
                                                    <span>X</span>
                                                @else
                                                    <span>&nbsp;</span>
                                                @endif    
                                            </div>
                                        </div>
                                    @endfor
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 10. DATOS DEL INFRACTOR -->
            <div class="row div-margin-out div-outline-out">
                <div class="col-xs-12 div-bg-gray div-outline-in">
                    <h2>10. DATOS DEL INFRACTOR</h2>
                </div>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-4">
                            <div class="row">
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>TIPO DE DOCUMENTO</span>
                                </div>
                                <div class="col-xs-12">
                                    <div class="row">
                                        @foreach($array_tipos_doc as $tipo_doc_codigo => $tipo_doc_desc)
                                            @if($tipo_doc_codigo == $notif->infr_tipo_doc)
                                                <div class="col-xs-3 div-bg-gray div-center div-padding div-outline-in option-list-xs">
                                                    <span>{{ $tipo_doc_desc }}</span>
                                                </div>
                                            @else
                                                <div class="col-xs-3 div-center div-padding div-outline-in option-list-xs">
                                                    <span>{{ $tipo_doc_desc }}</span>
                                                </div>
                                            @endif
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8">
                            <div class="row">
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>NÚMERO DE DOCUMENTO DE IDENTIDAD</span>
                                </div>
                                <div class="col-xs-12">
                                    <div class="row">
                                        @for ($i = 0; $i < 11; $i++)
                                            <div class="col-xs-1 col-1-11-width div-center div-padding div-outline-in option-list-md">
                                                @if(!is_null($array_infr_numero_doc) && $i < count($array_infr_numero_doc))
                                                    <span>{{ $array_infr_numero_doc[$i] }}</span>
                                                @else
                                                    <span>&nbsp;</span>
                                                @endif
                                            </div>
                                        @endfor
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </div>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-10">
                            <div class="row">
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>LICENCIA DE CONDUCCIÓN NÚMERO</span>
                                </div>
                                <div class="col-xs-12">
                                    <div class="row">
                                        @for ($i = 0; $i < 5; $i++)
                                            <div class="col-xs-1 col-1-14-width div-center div-padding div-outline-in option-list-md">
                                                @if(!is_null($array_lcond_numero) && $i < count($array_lcond_numero))
                                                    <span>{{ $array_lcond_numero[$i] }}</span>
                                                @else
                                                    <span>&nbsp;</span>
                                                @endif
                                            </div>
                                        @endfor
                                        <div class="col-xs-1 col-1-14-width div-bg-black div-center div-padding div-outline-in option-list-md">
                                            <span>&nbsp;</span>
                                        </div>
                                        @for ($i = 5; $i < 13; $i++)
                                            <div class="col-xs-1 col-1-14-width div-center div-padding div-outline-in option-list-md">
                                                @if(!is_null($array_lcond_numero) && $i < count($array_lcond_numero))
                                                    <span>{{ $array_lcond_numero[$i] }}</span>
                                                @else
                                                    <span>&nbsp;</span>
                                                @endif
                                            </div>
                                        @endfor
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-2">
                            <div class="row">
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>CATEG.</span>
                                </div>
                                @for ($i = 0; $i < 2; $i++)
                                    <div class="col-xs-6 div-padding div-outline-in">
                                        @if(!is_null($array_lcond_categoria) && $i < count($array_lcond_categoria))
                                            <span>{{ $array_lcond_categoria[$i] }}</span>
                                        @else
                                            <span>&nbsp;</span>
                                        @endif
                                    </div>
                                @endfor
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-2">
                            <div class="row">
                                <div class="col-xs-4 div-padding div-outline-in">
                                    <span>EXP.</span>
                                </div>
                                <div class="col-xs-2 div-center div-padding div-outline-in">
                                    @if(!is_null($lcond_expedicion) && is_null($lcond_vencimiento))
                                        <span>X</span>    
                                    @else
                                        <span>&nbsp;</span>
                                    @endif
                                </div>
                                <div class="col-xs-4 div-padding div-outline-in">
                                    <span>VENC.</span>
                                </div>
                                <div class="col-xs-2 div-center div-padding div-outline-in">
                                    @if(!is_null($lcond_vencimiento))
                                        <span>X</span>
                                    @else
                                        <span>&nbsp;</span>
                                    @endif
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-4 div-center div-padding div-outline-in">
                                    @if(!is_null($lcond_expedicion) && is_null($lcond_vencimiento))
                                        <span>{{ $lcond_expedicion[0] }}</span>
                                    @elseif(!is_null($lcond_vencimiento))
                                        <span>{{ $lcond_vencimiento[0] }}</span>
                                    @else
                                        <span>&nbsp;</span>
                                        <!--<span>D</span>&nbsp;<span>D</span>-->
                                    @endif
                                </div>
                                <div class="col-xs-4 div-center div-padding div-outline-in">
                                    @if(!is_null($lcond_expedicion) && is_null($lcond_vencimiento))
                                        <span>{{ $lcond_expedicion[1] }}</span>
                                    @elseif(!is_null($lcond_vencimiento))
                                        <span>{{ $lcond_vencimiento[1] }}</span>
                                    @else
                                        <span>&nbsp;</span>
                                        <!--<span>M</span>&nbsp;<span>M</span>-->
                                    @endif
                                </div>
                                <div class="col-xs-4 div-center div-padding div-outline-in">
                                    @if(!is_null($lcond_expedicion) && is_null($lcond_vencimiento))
                                        <span>{{ $lcond_expedicion[2] }}</span>
                                    @elseif(!is_null($lcond_vencimiento))
                                        <span>{{ $lcond_vencimiento[2] }}</span>
                                    @else
                                        <span>&nbsp;</span>
                                        <!--<span>A</span>&nbsp;<span>A</span>-->
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-10">
                            <div class="row">
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>NOMBRES Y APELLIDOS COMPLETOS</span>
                                </div>
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>{{ $notif->infr_nombres_apellidos }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-12 div-padding div-outline-in">
                            <span>DIRECCIÓN</span>
                        </div>
                        <div class="col-xs-12 div-padding div-outline-in">
                            @if(!is_null($notif->direccion_infractor))
                                <span>{{ $notif->direccion_infractor }}</span>
                            @else
                                <span>&nbsp;</span>
                            @endif
                        </div>
                    </div>
                </div>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-1">
                            <div class="row">
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>EDAD</span>
                                </div>
                                <div class="col-xs-12 div-padding div-outline-in">
                                    @if(!is_null($notif->edad_infractor))
                                        <span>{{ $notif->edad_infractor }}</span>
                                    @else
                                        <span>&nbsp;</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8">
                            <div class="row">
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>TELÉFONO FIJO Y/O CELULAR</span>
                                </div>
                                <div class="col-xs-12 div-padding div-outline-in">
                                    @if(!is_null($notif->telefono_infractor))
                                        <span>{{ $notif->telefono_infractor }}</span>
                                    @else
                                        <span>&nbsp;</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="row">
                                <div class="col-xs-12 div-padding div-outline-in">
                                    <span>MUNICIPIO</span>
                                </div>
                                <div class="col-xs-12 div-padding div-outline-in">
                                    @if(!is_null($notif->dinfr_municipio))
                                        <span>{{ $notif->dinfr_municipio }}</span>
                                    @else
                                        <span>&nbsp;</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-12 div-padding div-outline-in">
                            <span>DIRECCIÓN ELECTRÓNICA</span>
                        </div>
                        <div class="col-xs-12 div-padding div-outline-in">
                            @if(!is_null($notif->email_infractor))
                                <span>{{ $notif->email_infractor }}</span>
                            @else
                                <span>&nbsp;</span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 13. DATOS DEL PROPIETARIO -->
    <div class="row div-margin-out div-outline-out">
        <div class="col-xs-12 div-bg-gray div-outline-in">
            <h2>13. DATOS DEL PROPIETARIO</h2>
        </div>
        <div class="col-xs-6">
            <div class="row">
                <div class="col-xs-4">
                    <div class="row">
                        <div class="col-xs-12 div-padding div-outline-in">
                            <span>TIPO DE DOCUMENTO</span>
                        </div>
                        <div class="col-xs-12">
                            <div class="row">
                                @foreach($array_tipos_doc as $tipo_doc_codigo => $tipo_doc_desc)
                                    @if($tipo_doc_codigo == $notif->prop_tipo_doc)
                                        <div class="col-xs-3 div-bg-gray div-center div-padding div-outline-in option-list-xs">
                                            <span>{{ $tipo_doc_desc }}</span>
                                        </div>
                                    @else
                                        <div class="col-xs-3 div-center div-padding div-outline-in option-list-xs">
                                            <span>{{ $tipo_doc_desc }}</span>
                                        </div>
                                    @endif
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="row">
                        <div class="col-xs-12 div-padding div-outline-in">
                            <span>NÚMERO DE DOCUMENTO DE IDENTIDAD</span>
                        </div>
                        <div class="col-xs-12">
                            <div class="row">
                                @for ($i = 0; $i < 11; $i++)
                                    <div class="col-xs-1 col-1-11-width div-center div-padding div-outline-in option-list-md">
                                        @if(!is_null($array_prop_numero_doc) && $i < count($array_prop_numero_doc))
                                            <span>{{ $array_prop_numero_doc[$i] }}</span>
                                        @else
                                            <span>&nbsp;</span>
                                        @endif
                                    </div>
                                @endfor
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-6">
            <div class="row">
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>NOMBRES Y APELLIDOS</span>
                </div>
                <div class="col-xs-12 div-padding div-outline-in">
                    @if(!is_null($notif->prop_nombres_apellidos))
                        <span>{{ $notif->prop_nombres_apellidos }}</span>
                    @else
                        <span>&nbsp;</span>
                    @endif
                </div>
            </div>
        </div>                
    </div>

    <!-- 14. DATOS DE LA EMPRESA -->
    <div class="row div-margin-out div-outline-out">
        <div class="col-xs-12 div-bg-gray div-outline-in">
            <h2>14. DATOS DE LA EMPRESA</h2>
        </div>
        <div class="col-xs-8">
            <div class="row">
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-4 div-padding div-outline-in">
                            <span class="span-bold">NOMBRE DE LA EMPRESA</span>
                        </div>
                        <div class="col-xs-8 div-padding div-outline-in">
                            <span>&nbsp;</span>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-1 col-1-15-width div-padding div-outline-in">
                            <span class="span-bold">NIT</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-15-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 div-padding div-outline-in">
                    <span class="span-bold">TARJETA DE OPERACIÓN N°</span>
                </div>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                        <div class="col-xs-1 col-1-10-width div-center div-padding div-outline-in option-list-md">
                            <span>&nbsp;</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 15. DATOS DEL AGENTE DE TRÁNSITO -->
    <div class="row div-margin-out div-outline-out">
        <div class="col-xs-12 div-bg-gray div-outline-in">
            <h2>15. DATOS DEL AGENTE DE TRÁNSITO</h2>
        </div>
        <div class="col-xs-7">
            <div class="row">
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>APELLIDOS Y NOMBRES COMPLETOS</span>
                </div>
                <div class="col-xs-12 div-padding div-outline-in">
                    @if(!is_null($notif->agt_nombres_apellidos))
                        <span>{{ $notif->agt_apellidos . ' ' . $notif->agt_nombres }}</span>
                    @else
                        <span>&nbsp;</span>
                    @endif
                </div>
            </div>
        </div>
        <div class="col-xs-5">
            <div class="row">
                <div class="col-xs-6">
                    <div class="row">
                        <div class="col-xs-12 div-padding div-outline-in">
                            <span>PLACA</span>
                        </div>
                        <div class="col-xs-12 div-padding div-outline-in">
                            @if(!is_null($notif->agt_placa))
                                <span>{{ $notif->agt_placa }}</span>
                            @else
                                <span>&nbsp;</span>
                            @endif
                        </div>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div class="row">
                        <div class="col-xs-12 div-padding div-outline-in">
                            <span>ENTIDAD</span>
                        </div>
                        <div class="col-xs-12 div-padding div-outline-in">
                            @if(!is_null($notif->agt_entidad))
                                <span>{{ $notif->agt_entidad }}</span>
                            @else
                                <span>&nbsp;</span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12 div-padding div-outline-in">
            <p>NOTA: EL AGENTE DE TRÁNSITO QUE RECIBA DIRECTA O INDIRECTAMENTE DINERO O DÁDIVAS PARA RETARDAR U OMITIR ACTO PROPIO DE SU CARGO, O DE IGUAL FORMA, AL EXTENDER DOCUMENTO PÚBLICO, CONSIGUE UNA FALSEDAD O CALLE TOTAL O PARCIALMENTE LA VERDAD INCURRIRÁ EN LA SANCIÓN PREVISTA EN EL CÓDIGO PENAL (CONCUSIÓN-COHECHO O FALSEDAD IDEOLÓGICA EN DOCUMENTO PÚBLICO).</p>
        </div>
    </div>

    <!-- 16. DATOS DE LA INMOVILIZACIÓN -->
    <div class="row div-margin-out div-outline-out">
        <div class="col-xs-12 div-bg-gray div-outline-in">
            <h2>16. DATOS DE LA INMOVILIZACIÓN</h2>
        </div>
        <div class="col-xs-7">
            <div class="row">
                <div class="col-xs-3 div-padding div-outline-in">
                    <span>PATIO N°</span>
                </div>
                <div class="col-xs-9 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-3 div-padding div-outline-in">
                    <span>DIRECCIÓN DEL PATIO</span>
                </div>
                <div class="col-xs-9 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
        </div>
        <div class="col-xs-3">
            <div class="row">
                <div class="col-xs-5 div-padding div-outline-in">
                    <span>GRÚA NÚMERO</span>
                </div>
                <div class="col-xs-7 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-5 div-padding div-outline-in">
                    <span>PLACA GRÚA</span>
                </div>
                <div class="col-xs-7 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
        </div>
        <div class="col-xs-2">
            <div class="row">
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>CONSECUTIVO N°</span>
                </div>
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 17. OBSERVACIONES DEL AGENTE DE TRÁNSITO -->
    <div class="row div-margin-out div-outline-out">
        <div class="col-xs-12 div-bg-gray div-outline-in">
            <h2>17. OBSERVACIONES DEL AGENTE DE TRÁNSITO</h2>
        </div>
        <div class="col-xs-12 div-padding div-outline-in">
            <span>&nbsp;</span>
        </div>
    </div>

    <!-- 18. DATOS DEL TESTIGO EN CASO DE QUE APLIQUE -->
    <div class="row div-margin-out div-outline-out">
        <div class="col-xs-12 div-bg-gray div-outline-in">
            <h2>18. DATOS DEL TESTIGO EN CASO DE QUE APLIQUE</h2>
        </div>
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>NOMBRES Y APELLIDOS COMPLETOS</span>
                </div>
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
        </div>
        <div class="col-xs-2">
            <div class="row">
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>C.C. No</span>
                </div>
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
        </div>
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>DIRECCIÓN</span>
                </div>
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
        </div>
        <div class="col-xs-2">
            <div class="row">
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>TELÉFONO</span>
                </div>
                <div class="col-xs-12 div-padding div-outline-in">
                    <span>&nbsp;</span>
                </div>
            </div>
        </div>
    </div>

    <!-- FIRMAS -->
    <div class="row">
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 div-center div-padding">
                    <span class="span-bold">FIRMA DEL AGENTE DE TRÁNSITO</span>
                </div>
                <div class="col-xs-12 div-center div-padding">
                    @if(!is_null($notif->agt_firma))
                        <img src="@php echo($notif_ruta_firmas[$contador]); @endphp" width="120px" height="50px" />
                    @else
                        <span>&nbsp;</span>
                    @endif
                </div>
                <div class="col-xs-12 div-center div-padding">
                    <span>BAJO LA GRAVEDAD DEL JURAMENTO</span>
                </div>
            </div>
        </div>
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 div-center div-padding">
                    <span class="span-bold">FIRMA DEL PRESUNTO INFRACTOR</span>
                </div>
                <div class="col-xs-12 div-center div-padding" style="width: 120px; height: 50px;">
                    <span>&nbsp;</span>
                </div>
                <div class="col-xs-12 div-center div-padding">
                    <span>C.C. No</span>
                </div>
            </div>
        </div>
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 div-center div-padding">
                    <span class="span-bold">FIRMA DEL TESTIGO</span>
                </div>
                <div class="col-xs-12 div-center div-padding" style="width: 120px; height: 50px;">
                    <span>&nbsp;</span>
                </div>
                <div class="col-xs-12 div-center div-padding">
                    <span>C.C. No</span>
                </div>
            </div>
        </div>
    </div>
</article>