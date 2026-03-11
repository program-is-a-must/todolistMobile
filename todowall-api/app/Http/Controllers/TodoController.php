<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $todos = Todo::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($todos);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);
        $title = $data['title'] ?? $data['name'] ?? null;
        $todo = Todo::create([
            'user_id' => $request->user()->id,
            'title' => $title,
            'completed' => false,
        ]);
        return response()->json($todo, Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'completed' => ['nullable', 'boolean'],
            'is_completed' => ['nullable', 'boolean'],
        ]);
        $todo = Todo::where('user_id', $request->user()->id)->findOrFail($id);
        $payload = [];
        if (array_key_exists('title', $data) || array_key_exists('name', $data)) {
            $payload['title'] = $data['title'] ?? $data['name'] ?? $todo->title;
        }
        if (array_key_exists('completed', $data) || array_key_exists('is_completed', $data)) {
            $payload['completed'] = $data['completed'] ?? $data['is_completed'] ?? $todo->completed;
        }
        $todo->update($payload);
        return response()->json($todo);
    }

    public function toggle(Request $request, $id)
    {
        $todo = Todo::where('user_id', $request->user()->id)->findOrFail($id);
        $todo->completed = !$todo->completed;
        $todo->save();
        return response()->json($todo);
    }

    public function destroy(Request $request, $id)
    {
        $todo = Todo::where('user_id', $request->user()->id)->findOrFail($id);
        $todo->delete();
        return response()->noContent();
    }

    public function stats(Request $request)
    {
        $query = Todo::where('user_id', $request->user()->id);
        $total = (clone $query)->count();
        $completed = (clone $query)->where('completed', true)->count();
        $pending = $total - $completed;
        return response()->json([
            'total' => $total,
            'completed' => $completed,
            'pending' => $pending,
        ]);
    }
}

