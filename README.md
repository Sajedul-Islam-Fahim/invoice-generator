# Invoice Generator

A full-stack Invoice Generator SaaS built with Laravel REST API and React.

## Projects

| Project | Tech | Description |
|---|---|---|
| `invoice-generator-api` | Laravel 10 + Sanctum | REST API backend |
| `invoice-generator-web` | React + Vite | Frontend SPA |

## Features

- User Authentication (Register/Login)
- Client Management (Create/Edit/Delete)
- Invoice Create/Edit/Delete
- Invoice Items with Tax Calculation
- Auto-generate Invoice Number (INV-0001)
- Invoice Status (Draft/Sent/Paid/Overdue)
- PDF Export & Download
- Dashboard with Revenue Stats

## Tech Stack

- **Backend:** Laravel 10, MySQL, Sanctum, DomPDF
- **Frontend:** React 19, Vite, Zustand, Axios
- **Auth:** Laravel Sanctum (Token Based)

## Getting Started

### Requirements
- PHP 8.1+
- Composer
- Node.js 20+
- MySQL

### Setup API
```bash
cd invoice-generator-api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Setup Web
```bash
cd invoice-generator-web
npm install
npm run dev
```

## Author

**Sajedul Islam Fahim**
GitHub: [@Sajedul-Islam-Fahim](https://github.com/Sajedul-Islam-Fahim)
