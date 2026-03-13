<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 13px;
            color: #1e293b;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
        }

        h1 {
            color: #6366f1;
            margin: 0;
        }

        .invoice-meta {
            text-align: right;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .badge-draft {
            background: #e2e8f0;
            color: #475569;
        }

        .badge-sent {
            background: #dbeafe;
            color: #2563eb;
        }

        .badge-paid {
            background: #d1fae5;
            color: #059669;
        }

        .badge-overdue {
            background: #fee2e2;
            color: #dc2626;
        }

        .client-box {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
        }

        th {
            background: #1e293b;
            color: white;
            padding: 10px;
            text-align: left;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }

        tr:nth-child(even) {
            background: #f8fafc;
        }

        .totals {
            width: 300px;
            margin-left: auto;
        }

        .totals td {
            padding: 6px 10px;
        }

        .grand-total {
            font-weight: bold;
            font-size: 15px;
            border-top: 2px solid #1e293b;
        }

        .notes {
            margin-top: 2rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
        }

        .footer {
            margin-top: 3rem;
            text-align: center;
            color: #94a3b8;
            font-size: 11px;
        }
    </style>
</head>

<body>
    <div class="header">
        <div>
            <h1>Invoice Generator</h1>
            <p style="color:#94a3b8; margin:0">{{ $invoice->user->name }}</p>
        </div>
        <div class="invoice-meta">
            <h2 style="margin:0">{{ $invoice->invoice_number }}</h2>
            <span class="badge badge-{{ $invoice->status }}">{{ $invoice->status }}</span>
            <p>Issue Date: {{ $invoice->issue_date->format('d M Y') }}</p>
            <p>Due Date: {{ $invoice->due_date->format('d M Y') }}</p>
        </div>
    </div>

    <div class="client-box">
        <strong>Bill To:</strong>
        <p style="margin:4px 0">{{ $invoice->client->name }}</p>
        <p style="margin:4px 0; color:#64748b">{{ $invoice->client->email }}</p>
        @if ($invoice->client->phone)
            <p style="margin:4px 0; color:#64748b">{{ $invoice->client->phone }}</p>
        @endif
        @if ($invoice->client->address)
            <p style="margin:4px 0; color:#64748b">{{ $invoice->client->address }}, {{ $invoice->client->city }},
                {{ $invoice->client->country }}</p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Tax (%)</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->unit_price, 2) }}</td>
                    <td>{{ $item->tax_rate }}%</td>
                    <td>${{ number_format($item->total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td>Subtotal</td>
            <td>${{ number_format($invoice->subtotal, 2) }}</td>
        </tr>
        <tr>
            <td>Tax</td>
            <td>${{ number_format($invoice->tax_total, 2) }}</td>
        </tr>
        <tr class="grand-total">
            <td>Grand Total</td>
            <td>${{ number_format($invoice->grand_total, 2) }}</td>
        </tr>
    </table>

    @if ($invoice->notes)
        <div class="notes">
            <strong>Notes:</strong>
            <p style="margin:4px 0; color:#64748b">{{ $invoice->notes }}</p>
        </div>
    @endif

    <div class="footer">
        <p>Thank you for your business!</p>
    </div>
</body>

</html>
