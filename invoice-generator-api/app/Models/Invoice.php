<?php

namespace App\Models;

use App\Models\Client;
use App\Models\InvoiceItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'client_id',
        'invoice_number',
        'status',
        'issue_date',
        'due_date',
        'subtotal',
        'tax_total',
        'grand_total',
        'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date'   => 'date',
        'subtotal'   => 'decimal:2',
        'tax_total'  => 'decimal:2',
        'grand_total'=> 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public static function generateInvoiceNumber(int $userId): string
    {
        $last = self::where('user_id', $userId)->latest()->first();
        $number = $last ? (int) substr($last->invoice_number, 4) + 1 : 1;
        return 'INV-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
