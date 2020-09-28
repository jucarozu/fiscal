<!DOCTYPE html>
<html lang="es">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>Notificaciones</title>
        
        <!-- CSS -->
        {!! Html::style('angular/app/resources/css/bootstrap-3.3.6.min.css') !!}
    </head>
    <body>
        @php $contador = 0; @endphp

        <!-- Modo 1: Intercalados -->
        @if($imp_modo == 1)
            @foreach($notificaciones as $notif)
                @foreach($paginas as $pagina)
                    @include($pagina)
                @endforeach
                @php $contador++; @endphp
            @endforeach
        <!-- Modo 2: Bloques -->
        @else
            @foreach($paginas as $pagina)
                @foreach($notificaciones as $notif)
                    @include($pagina)
                    @php if($pagina == 'pdf.comparendos') $contador++; @endphp
                @endforeach
            @endforeach
        @endif

        <!-- Scripts -->
        {!! Html::script('angular/app/resources/js/jquery-2.2.3.min.js') !!}
        {!! Html::script('angular/app/resources/js/bootstrap-3.3.6.min.js') !!}
    </body>
</html>