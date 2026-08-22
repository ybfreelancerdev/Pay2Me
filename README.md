# Pay2Me

Pay2Me is a full-stack **financial transaction management platform** designed to manage users, parties, internal balances, commissions, beneficiary transfer requests, Hawala transactions, transaction limits, reports, and system notifications.

The application provides role-based access for **Admin, User, and Party**.

> **Important:** Pay2Me does not integrate with banks, UPI, payment gateways, or any real-money payment service. All balances and transactions are maintained as internal ledger records for transaction-management purposes.

---

## Project Type

* **Type:** Full-Stack Web Application
* **Category:** FinTech / Financial Transaction Management
* **Architecture:** Role-Based Enterprise Web Application
* **Frontend:** Angular
* **Backend:** ASP.NET Core Web API
* **Database:** Microsoft SQL Server
* **Authentication:** Role-based authentication with transaction authentication
* **Payment Gateway:** Not integrated
* **Real Money Transactions:** Not supported

---

## Technology Stack

### Frontend

* Angular
* TypeScript
* HTML5
* CSS
* Angular Services
* Angular Routing
* HTTP Client
* Reactive Forms

### Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* RESTful APIs
* Role-Based Authorization

### Database

* Microsoft SQL Server
* Relational database design
* Stored procedures / SQL queries where required

---

## User Roles

Pay2Me has three main roles.

### 1. Admin

The Admin has complete control over the platform.

Admin can:

* Create and manage users
* Create and manage parties
* Manage user balances
* Set user transaction limits
* Set global transaction limits
* Change user passwords
* Change party passwords
* Enable/disable authentication
* Assign parties to users
* Configure party commissions
* Review beneficiary transfer requests
* Approve or reject transactions
* Move transactions to in-progress status
* Manage Hawala transactions
* Reverse Hawala transactions
* View transaction logs
* Generate reports
* Configure broadcast notifications
* Configure promotional/Premium advertisements

### 2. User

Users can:

* Login to the system
* View dashboard notifications
* Manage beneficiaries
* Add bank beneficiary details
* Initiate money-transfer requests
* Verify transactions using authentication codes
* View their balance
* View transaction history
* View transaction status
* View rejected transaction reasons

### 3. Party

Parties have restricted access to the system.

Parties can:

* Login
* View their transactions
* View transaction history
* Monitor transactions associated with their account

---

# Core Modules

## Admin

The Admin module provides centralized management of the entire platform.

Main functionality:

* User Management
* Party Management
* Balance Management
* Transaction Management
* Transaction Limits
* Commission Management
* Hawala Management
* Reports
* Notifications
* System Settings
* Transaction Logs

---

## User Management

Admin can create and manage users.

When creating a user, Admin can configure:

* Username
* Password
* User details
* Assigned parties
* Party-specific commission
* Transaction limit
* Authentication settings

A user can be associated with multiple parties.

---

## Party Management

Admin can create and manage parties.

Admin can:

* Create party
* Edit party
* Change party password
* Enable/disable authentication
* View party transaction logs
* Associate parties with users

---

# Beneficiary Transaction Flow

Users can create bank beneficiaries and initiate transfer requests.

### Step 1 — Add Beneficiary

The user adds beneficiary information such as:

* Beneficiary name
* Bank name
* Bank account number
* IFSC code
* Other required bank details

### Step 2 — Send Money

The user:

1. Selects a beneficiary
2. Enters the transfer amount
3. Provides the required authentication code
4. Submits the transaction

### Step 3 — Balance Blocking

When the request is submitted, the requested amount is temporarily **blocked from the user's available balance**.

The amount is not permanently deducted at this stage.

### Step 4 — Admin Verification

The transaction is sent to Admin for verification.

Admin can:

* Approve
* Reject
* Move transaction to In-Progress
* Assign a party where applicable

### Step 5 — Approval

When Admin approves the transaction:

* The blocked amount is permanently deducted from the user's balance
* The transaction is completed
* The corresponding amount is recorded against the assigned party where applicable
* Transaction logs are created

### Step 6 — Rejection

If Admin rejects the transaction:

* The blocked amount is returned to the user's available balance
* The transaction is marked as rejected
* Admin must provide a rejection reason
* The user can view the rejection reason

---

# Transaction Status

Beneficiary transactions can have different states:

```text
Pending
   ↓
In Progress
   ↓
Approved / Rejected
```

### Pending

The request has been submitted by the user and is waiting for Admin verification.

### In Progress

The transaction is being processed and the amount remains on hold.

### Approved

The transaction has been approved and the amount is permanently deducted.

### Rejected

The transaction has been rejected and the blocked amount is returned to the user.

---

# Hawala Module

The Hawala module allows Admin to create internal balance transfers between users and parties.

Supported transaction directions include:

```text
Party → Party
Party → User
User → User
User → Party
```

Admin selects:

* Debit Party/User
* Credit Party/User
* Amount
* Remark/Note

When the transaction is created:

```text
Debit Source
     ↓
Credit Destination
```

The amount is deducted from the selected debit account and added to the selected credit account.

The transaction is then recorded in the Hawala logs.

---

# Hawala Reversal

Admin can delete/reverse a Hawala transaction.

For example:

```text
Original Transaction

Party A
   ↓
₹10,000
   ↓
Party B
```

After reversal:

```text
Party B
   ↓
₹10,000
   ↓
Party A
```

The reversal restores the balances by creating the corresponding reverse ledger movement.

This ensures that the original transaction can be cancelled without manually modifying balances.

---

# Commission Management

Users can have multiple parties associated with their account.

Admin can configure a commission percentage for each user-party relationship.

### Example

User **T** has:

```text
Party A
Party B
```

Party A has a configured commission of:

```text
1%
```

If Party A processes a transaction of:

```text
₹10,000
```

The commission is:

```text
₹10,000 × 1% = ₹100
```

The configured commission is credited to the associated user's internal balance according to the application's commission rules.

---

# Transaction Limits

Pay2Me supports transaction limits at multiple levels.

### User-Level Limit

Admin can configure the maximum transaction amount allowed for an individual user.

### Global Limit

Admin can configure a global transaction limit that applies across the platform.

The system can use these limits when validating new transaction requests.

---

# Notifications & Promotions

Admin can configure broadcast notifications that are displayed to users and parties after login.

Examples include:

* System announcements
* Important notifications
* Maintenance notifications
* Promotional messages
* Premium advertisements

The configured notification can be displayed on the user's dashboard after login.

---

# Reports

The Admin reporting module provides visibility into platform activity.

Reports include:

* General transaction reports
* Hawala reports
* User reports
* Pending transactions
* In-progress transactions
* Transaction history
* Transaction logs

---

# Transaction Logs

The system maintains transaction-related logs for monitoring and auditing purposes.

Admin can view:

* User transaction logs
* Party transaction logs
* Beneficiary transaction logs
* Hawala logs
* Transaction status
* Transaction amount
* Transaction timestamps
* Transaction remarks
* Rejection reasons
* Reversal information

---

# High-Level Transaction Architecture

```text
                    ┌──────────────┐
                    │    Admin     │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Users         Parties      Reports
              │            │
              │            │
              └──────┬─────┘
                     │
                     ▼
              Transaction Engine
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
   Beneficiary Flow        Hawala Flow
          │                     │
          ▼                     ▼
      Approval /            Debit /
       Rejection             Credit
          │                     │
          └──────────┬──────────┘
                     ▼
               SQL Server
```

---

# Project Structure

```text
Pay2Me/
│
├── frontend/
│   └── Angular Application
│
├── backend/
│   └── ASP.NET Core Web API
│
├── database/
│   ├── scripts/
│   └── stored-procedures/
│
├── docs/
│
├── .gitignore
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Angular CLI
* .NET SDK
* SQL Server
* SQL Server Management Studio or another SQL client
* Git

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the API URL in the appropriate Angular environment configuration.

Run the application:

```bash
ng serve
```

The Angular application will normally be available at:

```text
http://localhost:4200
```

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Restore dependencies:

```bash
dotnet restore
```

Configure the SQL Server connection string in the appropriate configuration file.

Run the API:

```bash
dotnet run
```

The API URL depends on the configured ASP.NET Core environment and launch settings.

---

# Database Setup

Create a SQL Server database for Pay2Me.

Configure the connection string in the backend configuration.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=Pay2Me;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Do not commit production database credentials or secrets to GitHub.

---

# Security

Pay2Me contains financial-style transaction and balance management functionality.

For production deployment, additional security controls should be implemented, including:

* Secure password hashing
* JWT/access-token security
* Role-based authorization
* Two-factor authentication
* API request validation
* SQL injection protection
* Audit logging
* Rate limiting
* Secure secret management
* HTTPS
* Database backup and recovery
* Encryption of sensitive information

---

# Important Disclaimer

Pay2Me is an internal transaction-management platform.

It does **not**:

* Process real money
* Connect to banks
* Connect to UPI
* Connect to payment gateways
* Execute real bank transfers
* Process real financial settlements

Balances and transactions represented within the application are internal records maintained by the system.

---

# Future Enhancements

Potential future improvements include:

* Advanced audit trail
* Enhanced transaction analytics
* Exportable reports
* Dashboard charts
* Advanced notification management
* Multi-level approval workflows
* Automated reconciliation
* Enhanced authentication
* API documentation with Swagger/OpenAPI
* Automated testing
* Docker deployment
* CI/CD pipeline

---

# License

This project is proprietary software.

Unauthorized copying, distribution, modification, or commercial use is not permitted without permission from the project owner.
