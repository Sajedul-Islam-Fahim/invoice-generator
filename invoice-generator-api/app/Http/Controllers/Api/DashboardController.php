<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $invoices = $request->user()->invoices();

        $totalRevenue = (clone $invoices)->where('status', 'paid')->sum('grand_total');
        $unpaidAmount = (clone $invoices)->whereIn('status', ['draft', 'sent'])->sum('grand_total');
        $overdueAmount = (clone $invoices)->where('status', 'overdue')->sum('grand_total');

        return response()->json([
            'total_invoices'  => (clone $invoices)->count(),
            'draft'           => (clone $invoices)->where('status', 'draft')->count(),
            'sent'            => (clone $invoices)->where('status', 'sent')->count(),
            'paid'            => (clone $invoices)->where('status', 'paid')->count(),
            'overdue'         => (clone $invoices)->where('status', 'overdue')->count(),
            'total_clients'   => $request->user()->clients()->count(),
            'total_revenue'   => number_format($totalRevenue, 2),
            'unpaid_amount'   => number_format($unpaidAmount, 2),
            'overdue_amount'  => number_format($overdueAmount, 2),
        ]);
    }
}
