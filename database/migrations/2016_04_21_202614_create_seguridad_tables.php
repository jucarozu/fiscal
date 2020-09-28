<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeguridadTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Crear tabla para almacenar Módulos
        Schema::create('modulos', function (Blueprint $table) {
            $table->increments('modap_codigo');
            $table->string('modap_nombre');
        });

        // Crear tabla para almacenar Opciones
        Schema::create('opciones', function (Blueprint $table) {
            $table->increments('opcap_codigo');
            $table->string('opcap_nombre');
            $table->string('opcap_enlace');
            $table->integer('opcap_estado');
            $table->integer('modap_codigo')->unsigned();

            $table->foreign('modap_codigo')->references('modap_codigo')->on('modulos')
                ->onUpdate('cascade')->onDelete('cascade');
        });

        // Crear tabla para almacenar Roles
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('rolap_codigo');
            $table->string('rolap_nombre')->unique();
            $table->string('rolap_descripcion')->nullable();
        });

        // Crear tabla de asociación entre Roles y Usuarios
        Schema::create('user_roles', function (Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->integer('rolap_codigo')->unsigned();
            $table->date('rolap_desde');
            $table->date('rolap_hasta')->nullable();

            $table->foreign('user_id')->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('rolap_codigo')->references('rolap_codigo')->on('roles')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->primary(['user_id', 'rolap_codigo', 'rolap_desde']);
        });

        // Crear tabla para almacenar Permisos
        Schema::create('permisos', function (Blueprint $table) {
            $table->integer('rolap_codigo')->unsigned();
            $table->integer('opcap_codigo')->unsigned();
            $table->integer('permap_adicionar');
            $table->integer('permap_consultar');
            $table->integer('permap_editar');
            $table->integer('permap_eliminar');

            $table->foreign('rolap_codigo')->references('rolap_codigo')->on('roles')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('opcap_codigo')->references('opcap_codigo')->on('opciones')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->primary(['rolap_codigo', 'opcap_codigo']);
        });

        // Crear tabla de auditoría de actividad del usuario
        Schema::create('auditoria', function (Blueprint $table) {
            $table->increments('audit_codigo');
            $table->integer('audit_accion');
            $table->timestamp('audit_fecha');
            $table->string('audit_host');
            $table->integer('user_id')->unsigned();
            $table->integer('opcap_codigo')->unsigned();

            $table->foreign('user_id')->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('opcap_codigo')->references('opcap_codigo')->on('opciones')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('auditoria');
        Schema::drop('permisos');
        Schema::drop('user_roles');
        Schema::drop('roles');
        Schema::drop('opciones');
        Schema::drop('modulos');
    }
}
