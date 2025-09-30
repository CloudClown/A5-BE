# Digital Wallet API

A secure, modular, role-based backend API for a digital wallet system using Express.js and Mongoose.

## Features

- 🔐 JWT-based Authentication
- 👥 Role-based Authorization (User, Agent, Admin)
- 💰 Wallet Management
- 💸 Transaction Processing
- 🏦 Agent Cash In/Out Support
- 💵 Transaction Fees & Commission System
- 🔄 Real-time Balance Updates
- 📊 Transaction History
- 🛡️ Secure Password Handling
- 🌐 Google OAuth Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/CloudClown/A5-BE.git
   cd A5-BE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   # Server Configuration
   PORT=5000
   DB_URL=your_mongodb_connection_string
   NODE_ENV=development

   # Super Admin Configuration (Required for initial setup)
   SUPER_ADMIN_NAME=Super Admin
   SUPER_ADMIN_EMAIL=admin@digitalwallet.com
   SUPER_ADMIN_PASSWORD=your_secure_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_refresh_token_secret
   JWT_REFRESH_EXPIRES=30d

   # Wallet Configuration
   INITIAL_BALANCE_CENTS=5000

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

   The server will automatically create a super admin user on first startup if no admin exists, using the credentials specified in your `.env` file.

## Super Admin Setup

The system automatically creates a super admin user on first startup if no admin exists. This is controlled by environment variables:

- `SUPER_ADMIN_NAME`: Name of the super admin (default: "Super Admin")
- `SUPER_ADMIN_EMAIL`: Email for the super admin (default: "admin@digitalwallet.com")
- `SUPER_ADMIN_PASSWORD`: Password for the super admin (default: "admin123")

**Important**: Make sure to change these defaults in your `.env` file before deploying to production!

After the first admin is created, new admin users can only be created by:
1. An existing admin promoting a user to admin role
2. Direct database operations by system administrators

## API Endpoints

### Authentication

#### Register a new user
- **POST** `/api/v1/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
  Note: New users are automatically assigned the 'user' role. Only existing admins can promote users to 'agent' or 'admin' roles.

#### Login
- **POST** `/api/v1/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Refresh Token
- **POST** `/api/v1/auth/refresh-token`
- **Cookie:** `refreshToken` required

### User Operations

#### Get User Profile
- **GET** `/api/v1/users/me`
- **Header:** `Authorization: Bearer {token}`

#### Get User Transactions
- **GET** `/api/v1/transactions/me`
- **Header:** `Authorization: Bearer {token}`
- **Query Parameters:**
  - type: transaction type (optional)
  - startDate: filter by start date (optional)
  - endDate: filter by end date (optional)
  - page: page number (optional)
  - limit: items per page (optional)

### Wallet Operations

#### Deposit Money
- **POST** `/api/v1/wallets/deposit`
- **Header:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "amount": 1000
  }
  ```

#### Withdraw Money
- **POST** `/api/v1/wallets/withdraw`
- **Header:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "amount": 500
  }
  ```

#### Send Money
- **POST** `/api/v1/wallets/send`
- **Header:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "amount": 100,
    "recipientId": "recipient_user_id"
  }
  ```

### Agent Operations

#### Cash In
- **POST** `/api/v1/agents/cash-in`
- **Header:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "userId": "user_id",
    "amount": 1000
  }
  ```

#### Cash Out
- **POST** `/api/v1/agents/cash-out`
- **Header:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "userId": "user_id",
    "amount": 500
  }
  ```

#### Get Agent Commissions
- **GET** `/api/v1/agents/commissions`
- **Header:** `Authorization: Bearer {token}`

### Admin Operations

#### Get All Users
- **GET** `/api/v1/admin/users`
- **Header:** `Authorization: Bearer {token}`

#### Get All Agents
- **GET** `/api/v1/admin/agents`
- **Header:** `Authorization: Bearer {token}`

#### Get All Wallets
- **GET** `/api/v1/admin/wallets`
- **Header:** `Authorization: Bearer {token}`

#### Get All Transactions
- **GET** `/api/v1/admin/transactions`
- **Header:** `Authorization: Bearer {token}`

#### Update User Role
- **PATCH** `/api/v1/admin/users/:id/role`
- **Header:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "role": "agent" // "user", "agent", or "admin"
  }
  ```

#### Block/Unblock Wallet
- **PATCH** `/api/v1/admin/wallets/:id/block`
- **Header:** `Authorization: Bearer {token}`
- **Body:** None (toggles block status)

## Business Rules

1. **Balance Restrictions**
   - Cannot withdraw or send more than available balance
   - Minimum balance requirement enforced
   - Blocked wallets cannot perform transactions

2. **Fees & Commissions**
   - Withdrawal Fee: 1.5%
   - Transfer Fee: 1%
   - Cash-out Fee: 2%
   - Agent Commission: 1%

3. **Transaction Limits**
   - Daily limit: 50,000
   - Monthly limit: 1,000,000

## Testing with Postman

1. Import the Postman collection (link_to_postman_collection)
2. Set up environment variables in Postman:
   - `baseUrl`: http://localhost:5000/api/v1
   - `token`: (will be automatically set after login)

3. Testing Flow:
   - Register a new user
   - Login to get the token
   - The token will be automatically set for other requests
   - Test other endpoints as needed

## Error Handling

The API returns consistent error responses in the following format:
```json
{
  "success": false,
  "message": "Error message here",
  "error": {
    "details": "Detailed error information"
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email your-email@example.com or open an issue in the repository.