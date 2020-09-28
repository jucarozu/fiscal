<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// Fiscalización electrónica
Route::group(['prefix' => 'fiscalizacion', 'middleware' => ['cors']], function() {
    
    // Autenticación
    Route::post('/login', 'LoginController@login');

    // Autenticación WS Carga Detección
    Route::post('/loginWSDeteccion', 'LoginWSDeteccionController@login');

    // Administración
    Route::group(['prefix' => '/administracion'], function() {

        Route::group(['prefix' => '/divipos'], function() {
            Route::resource('/api', 'DivipoController', [ 'only' => [ 'index', 'show', 'store', 'update', 'destroy' ] ]);
            Route::get('/getDepartamentos', 'DivipoController@getDepartamentos');
            Route::get('/getMunicipios/{cod_departamento}', 'DivipoController@getMunicipios');
            Route::get('/getPoblados/{cod_municipio}', 'DivipoController@getPoblados');
        });

        Route::group(['prefix' => '/parametros'], function() {
            Route::resource('/api', 'ParametroController', [ 'only' => [ 'index', 'show', 'store', 'update', 'destroy' ] ]);
            Route::get('/getByGrupo/{grupo}', 'ParametroController@getByGrupo');
        });

        Route::group(['prefix' => '/personas'], function() {
            Route::resource('/api', 'PersonaController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByFilters/{tipo_doc}/{numero_doc}/{nombres}/{apellidos}', 'PersonaController@getByFilters');
            Route::get('/getByDocumento/{tipo_doc}/{numero_doc}', 'PersonaController@getByDocumento');
        });

        Route::group(['prefix' => '/agentes'], function() {
            Route::resource('/api', 'AgenteController', [ 'only' => [ 'index', 'show', 'store', 'update', 'destroy' ] ]);
            Route::get('/getByFilters/{entidad}/{placa}/{tipo_doc}/{numero_doc}/{nombres_apellidos}/{estado}', 'AgenteController@getByFilters');
            Route::get('/getByUsuario/{usuario}', 'AgenteController@getByUsuario');
            Route::get('/mostrarFirma/{persona}', 'AgenteController@mostrarFirma');
            Route::post('/cargarFirma', 'AgenteController@cargarFirma');
            Route::delete('/borrarFirma', 'AgenteController@borrarFirma');
        });

        Route::group(['prefix' => '/fuentes'], function() {
            Route::resource('/api', 'FuenteController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByFilters/{tipo}/{nombre}/{proveedor}/{referenciaUbicacion}', 'FuenteController@getByFilters');
        });

        Route::group(['prefix' => '/infracciones'], function() {
            Route::resource('/api', 'InfraccionController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByFilters/{codigo}/{nombre_corto}/{descripcion}', 'InfraccionController@getByFilters');
            Route::get('/getByCodigo/{codigo}', 'InfraccionController@getByCodigo');
        });

        Route::group(['prefix' => '/intereses'], function() {
            Route::resource('/api', 'InteresController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::get('/getByFilters/{fecha_inicio}/{fecha_fin}', 'InteresController@getByFilters');
        });

        Route::group(['prefix' => '/direcciones'], function() {
            Route::resource('/api', 'DireccionController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByFilters/{tipo_doc}/{numero_doc}', 'DireccionController@getByFilters');
            Route::get('/getByPersona/{persona}', 'DireccionController@getByPersona');
            Route::get('/getAllByPersona/{persona}', 'DireccionController@getAllByPersona');
        });

        Route::group(['prefix' => '/propietarios'], function() {
            Route::resource('/api', 'PropietarioController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByFilters/{placa}/{tipo_doc}/{numero_doc}', 'PropietarioController@getByFilters');
        });

        Route::group(['prefix' => '/vehiculos'], function() {
            Route::resource('/api', 'VehiculoController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByFilters/{placa}', 'VehiculoController@getByFilters');
        });

        Route::group(['prefix' => '/responsables'], function() {
            Route::resource('/api', 'ResponsableController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByTipoActo/{tipo}', 'ResponsableController@getByTipoActo');
        });

        Route::group(['prefix' => '/cargaInformacion'], function() {
            Route::resource('/api', 'CargaInformacionController', [ 'only' => [ 'index', 'store' ] ]);
        });

        Route::group(['prefix' => '/cargaPropietarios'], function() {
            Route::resource('/api', 'CargaPropietariosController', [ 'only' => [ 'index', 'store' ] ]);
        });

        Route::group(['prefix' => '/empresasMensajeria'], function() {
            Route::resource('/api', 'EmpresaMensajeriaController', [ 'only' => [ 'index' ] ]);
        });

    });

    // Comparendos
    Route::group(['prefix' => '/comparendos'], function() {
        
        Route::group(['prefix' => '/comparendos'], function() {
            Route::resource('/api', 'ComparendoController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::post('/sustituirConductor', 'ComparendoController@sustituirConductor');
            Route::get('/getByFilters/{numero}/{infr_tipo_doc}/{infr_numero_doc}/{estado}', 'ComparendoController@getByFilters');
            Route::get('/getComparendosPorNotificar/{infra_desde}/{infra_hasta}/{verifica_desde}/{verifica_hasta}/{detec_sitio}/{detec_agente}/{dir_divipo}', 'ComparendoController@getComparendosPorNotificar');
        });

        Route::group(['prefix' => '/compaSeguimientos'], function() {
            Route::resource('/api', 'CompaSeguimientoController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::get('/getByFilters/{comparendo}', 'CompaSeguimientoController@getByFilters');
        });
        
        Route::group(['prefix' => '/notificaciones'], function() {
            Route::resource('/api', 'NotificacionController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByFilters/{notificacion}/{notif_tipo}/{numero}/{notif_tipo_doc}/{notif_numero_doc}/{notif_estado}', 'NotificacionController@getByFilters');
            Route::get('/imprimir/{imp_orden}/{imp_modo}', 'NotificacionController@imprimir');
            Route::patch('/marcarImpreso', 'NotificacionController@marcarImpreso');
        });

        Route::group(['prefix' => '/notifSeguimientos'], function() {
            Route::resource('/api', 'NotifSeguimientoController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::get('/getByFilters/{notificacion}', 'NotifSeguimientoController@getByFilters');
        });

    });

    // Notificaciones
    Route::group(['prefix' => '/notificaciones'], function() {

        Route::group(['prefix' => '/notifEntregada'], function() {
            Route::resource('/api', 'NotifEntregadaController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::get('/getByFilters/{notificacion}', 'NotifEntregadaController@getByFilters');
        });

        Route::group(['prefix' => '/notifDevuelta'], function() {
            Route::resource('/api', 'NotifDevueltaController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::get('/getByFilters/{notificacion}', 'NotifDevueltaController@getByFilters');
        });

        Route::group(['prefix' => '/notifDescarte'], function() {
            Route::resource('/api', 'NotifDescarteController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::get('/getByFilters/{notificacion}', 'NotifDescarteController@getByFilters');
        });

        Route::group(['prefix' => '/notifCola'], function() {
            Route::resource('/api', 'NotifColaController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::get('/getByFilters/{notificacion}', 'NotifColaController@getByFilters');
        });

        Route::group(['prefix' => '/notifAviso'], function() {
            Route::resource('/api', 'NotifAvisoController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByNotificacion/{notificacion}', 'NotifAvisoController@getByNotificacion');
        });

    });

    // Pruebas
    Route::group(['prefix' => '/pruebas'], function() {

        Route::group(['prefix' => '/detecciones'], function() {
            Route::resource('/api', 'DeteccionController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
            Route::get('/getByFilters/{fuente}/{estado}', 'DeteccionController@getByFilters');
        });

        Route::group(['prefix' => '/evidencias'], function() {
            Route::resource('/api', 'EvidenciaController', [ 'only' => [ 'index', 'show', 'store', 'destroy' ] ]);
            Route::post('/recortarEvidencia', 'EvidenciaController@recortarEvidencia');
            Route::get('/getByDeteccion/{deteccion}', 'EvidenciaController@getByDeteccion');
        });

        Route::group(['prefix' => '/infraDetecciones'], function() {
            Route::resource('/api', 'InfraDeteccionController', [ 'only' => [ 'index', 'show', 'store', 'destroy' ] ]);
            Route::get('/getByDeteccion/{deteccion}', 'InfraDeteccionController@getByDeteccion');
        });

        Route::group(['prefix' => '/deteccionesSeguimiento'], function() {
            Route::resource('/api', 'DeteccionSeguimientoController', [ 'only' => [ 'index', 'show', 'store' ] ]);
            Route::get('/getByFilters/{deteccion}/{estado}', 'DeteccionSeguimientoController@getByFilters');
        });

        Route::group(['prefix' => '/deteccionesDescarte'], function() {
            Route::resource('/api', 'DeteccionDescarteController', [ 'only' => [ 'index', 'show', 'store' ] ]);
        });

        Route::group(['prefix' => '/detallesDescarte'], function() {
            Route::resource('/api', 'DetalleDescarteController', [ 'only' => [ 'index', 'show', 'store' ] ]);
        });

        Route::group(['prefix' => '/placasSinDatos'], function() {
            Route::resource('/api', 'PlacasSinDatosController', [ 'only' => [ 'index' ] ]);
            Route::get('/count', 'PlacasSinDatosController@count');
        });

        Route::group(['prefix' => '/prevalidacion'], function() {
            Route::get('/api/{fuente}', 'PrevalidacionController@consultar');
            Route::patch('/api', 'PrevalidacionController@validar');
            Route::patch('/api/descarte', 'PrevalidacionController@descartar');
        });

        Route::group(['prefix' => '/validacion'], function() {
            Route::get('/api/{fuente}', 'ValidacionController@consultar');
            Route::patch('/api', 'ValidacionController@validar');
            Route::patch('/api/descarte', 'ValidacionController@descartar');
        });
        
    });

    // Seguridad
    Route::group(['prefix' => '/seguridad'], function() {
        
        Route::group(['prefix' => '/auditoria'], function() {
            Route::resource('/api', 'AuditoriaController', [ 'only' => [ 'index', 'store' ] ]);
        });
        
        Route::group(['prefix' => '/opciones'], function() {
            Route::resource('/api', 'OpcionController', [ 'only' => [ 'index', 'show', 'store', 'update', 'destroy' ] ]);
        });

        Route::group(['prefix' => '/roles'], function() {
            Route::resource('/api', 'RolController', [ 'only' => [ 'index', 'show', 'store', 'update' ] ]);
        });

        Route::group(['prefix' => '/usuarios'], function() {
            Route::resource('/api', 'UsuarioController', [ 'only' => [ 'index', 'show', 'store', 'update', 'destroy' ] ]);
            Route::patch('/resetPassword/{id}', 'UsuarioController@resetPassword');
            Route::patch('/forcePassword/{id}', 'UsuarioController@forcePassword');
            Route::patch('/changePassword/{id}', 'UsuarioController@changePassword');
            Route::get('/getByPersona/{persona}', 'UsuarioController@getByPersona');
        });

    });

});