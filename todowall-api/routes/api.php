<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'me']);

    // Todos
    Route::get('/todos/stats',       [TodoController::class, 'stats']);
    Route::get('/todos',             [TodoController::class, 'index']);
    Route::post('/todos',            [TodoController::class, 'store']);
    Route::put('/todos/{id}',        [TodoController::class, 'update']);
    Route::patch('/todos/{id}/toggle', [TodoController::class, 'toggle']);
    Route::delete('/todos/{id}',     [TodoController::class, 'destroy']);
});

