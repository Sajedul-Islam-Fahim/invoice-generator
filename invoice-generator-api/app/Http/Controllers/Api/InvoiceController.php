<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->invoices()->with('client');

        if ($request->status)    $query->where('status', $request->status);
        if ($request->client_id) $query->where('client_id', $request->client_id);
        if ($request->search)    $query->where('invoice_number', 'like', "%{$request->search}%");

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id'  => 'required|exists:clients,id',
            'issue_date' => 'required|date',
            'due_date'   => 'required|date|after_or_equal:issue_date',
            'notes'      => 'nullable|string',
            'items'      => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity'    => 'required|numeric|min:0.01',
            'items.*.unit_price'  => 'required|numeric|min:0',
            'items.*.tax_rate'    => 'nullable|numeric|min:0|max:100',
        ]);

        $subtotal  = 0;
        $taxTotal  = 0;

        foreach ($data['items'] as &$item) {
            $item['tax_rate'] = $item['tax_rate'] ?? 0;
            $itemSubtotal     = $item['quantity'] * $item['unit_price'];
            $itemTax          = $itemSubtotal * ($item['tax_rate'] / 100);
            $item['total']    = $itemSubtotal + $itemTax;
            $subtotal        += $itemSubtotal;
            $taxTotal        += $itemTax;
        }

        $invoice = Invoice::create([
            'user_id'        => $request->user()->id,
            'client_id'      => $data['client_id'],
            'invoice_number' => Invoice::generateInvoiceNumber($request->user()->id),
            'status'         => 'draft',
            'issue_date'     => $data['issue_date'],
            'due_date'       => $data['due_date'],
            'subtotal'       => $subtotal,
            'tax_total'      => $taxTotal,
            'grand_total'    => $subtotal + $taxTotal,
            'notes'          => $data['notes'] ?? null,
        ]);

        $invoice->items()->createMany($data['items']);

        return response()->json($invoice->load('client', 'items'), 201);
    }

    public function show(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        return response()->json($invoice->load('client', 'items'));
    }

    public function update(Request $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $data = $request->validate([
            'client_id'  => 'sometimes|required|exists:clients,id',
            'status'     => 'sometimes|in:draft,sent,paid,overdue',
            'issue_date' => 'sometimes|required|date',
            'due_date'   => 'sometimes|required|date',
            'notes'      => 'nullable|string',
            'items'      => 'sometimes|required|array|min:1',
            'items.*.description' => 'required_with:items|string',
            'items.*.quantity'    => 'required_with:items|numeric|min:0.01',
            'items.*.unit_price'  => 'required_with:items|numeric|min:0',
            'items.*.tax_rate'    => 'nullable|numeric|min:0|max:100',
        ]);

        if (isset($data['items'])) {
            $subtotal = 0;
            $taxTotal = 0;

            foreach ($data['items'] as &$item) {
                $item['tax_rate'] = $item['tax_rate'] ?? 0;
                $itemSubtotal     = $item['quantity'] * $item['unit_price'];
                $itemTax          = $itemSubtotal * ($item['tax_rate'] / 100);
                $item['total']    = $itemSubtotal + $itemTax;
                $subtotal        += $itemSubtotal;
                $taxTotal        += $itemTax;
            }

            $data['subtotal']   = $subtotal;
            $data['tax_total']  = $taxTotal;
            $data['grand_total'] = $subtotal + $taxTotal;

            $invoice->items()->delete();
            $invoice->items()->createMany($data['items']);
        }

        unset($data['items']);
        $invoice->update($data);

        return response()->json($invoice->load('client', 'items'));
    }

    public function destroy(Invoice $invoice)
    {
        $this->authorize('delete', $invoice);
        $invoice->items()->delete();
        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }

    public function downloadPdf(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load('client', 'items', 'user');

        $pdf = Pdf::loadView('invoices.pdf', compact('invoice'));

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }
}
