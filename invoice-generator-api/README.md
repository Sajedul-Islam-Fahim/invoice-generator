# Invoice Generator API

REST API backend for Invoice Generator built with Laravel 10 and Sanctum.

## Tech Stack

- **Framework:** Laravel 10
- **PHP:** 8.1+
- **Database:** MySQL
- **Authentication:** Laravel Sanctum (Token Based)
- **PDF:** Laravel DomPDF

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login user |
| POST | `/api/logout` | Logout user |
| GET | `/api/me` | Get current user |

### Clients
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/clients` | Get all clients |
| POST | `/api/clients` | Create client |
| PUT | `/api/clients/{id}` | Update client |
| DELETE | `/api/clients/{id}` | Delete client |

### Invoices
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/invoices` | Get all invoices |
| POST | `/api/invoices` | Create invoice |
| GET | `/api/invoices/{id}` | Get invoice |
| PUT | `/api/invoices/{id}` | Update invoice |
| DELETE | `/api/invoices/{id}` | Delete invoice |
| GET | `/api/invoices/{id}/pdf` | Download PDF |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get dashboard stats |

## Author

**Sajedul Islam Fahim**
GitHub: [@Sajedul-Islam-Fahim](https://github.com/Sajedul-Islam-Fahim)
