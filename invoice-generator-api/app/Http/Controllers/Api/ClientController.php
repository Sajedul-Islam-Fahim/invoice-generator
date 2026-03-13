<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->clients();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'phone'   => 'nullable|string',
            'address' => 'nullable|string',
            'city'    => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $data['user_id'] = $request->user()->id;
        $client = Client::create($data);

        return response()->json($client, 201);
    }

    public function update(Request $request, Client $client)
    {
        $this->authorize('update', $client);

        $data = $request->validate([
            'name'    => 'sometimes|required|string|max:255',
            'email'   => 'sometimes|required|email',
            'phone'   => 'nullable|string',
            'address' => 'nullable|string',
            'city'    => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $client->update($data);

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $this->authorize('delete', $client);
        $client->delete();

        return response()->json(['message' => 'Client deleted successfully']);
    }
}
