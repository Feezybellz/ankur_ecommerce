# **Ankur E-Commerce**

Ankur E-Commerce is a Node.js-based e-commerce platform built with Express.js and MongoDB. This guide will help you set up and run the project locally.

---

## **📌 Getting Started**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/Feezybellz/ankur_ecommerce.git
cd ankur_ecommerce
```

### **2️⃣ Configure Environment Variables**

Copy the example environment file and set up your variables:

```sh
cp .env.example .env
```

Edit `.env` and add your credentials (Admin Credentials, MongoDB URI, JWT secret, Flutterwave API keys, etc.).

### **3️⃣ Install Dependencies**

```sh
npm install
```

This installs all required dependencies.

### **4️⃣ Run the Application**

```sh
npm start
```

This starts the server on `http://localhost:5000`.

---

## **📌 API Endpoints**

Below are sample requests to test the API.

### **🔹 Register a User**

```http
POST /api/auth/register
```

**Body:**

```json
{
  "name": "Afeez Bello",
  "email": "belloafeez7@gmail.com",
  "password": "12345678"
}
```

### **🔹 User & Admin Login**

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "belloafeez7@gmail.com",
  "password": "12345678"
}
```

**Response:**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWZkODFkMzRmZDg2YzNjMmZlODhlYyIsImlhdCI6MTczOTYzMDM3NSwiZXhwIjoxNzM5NjMzOTc1fQ.UV41KX2uiHzMHplGD7soNGvJ_1q3OHM9r6XvWMEOQMA"
}
```

### **🔹 Create Product Category (Admin Only)**

```http
POST /api/product/category/add
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Body:**

```json
{
  "name": "Toys"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Category created successfully",
  "category_id": "67b0a819a59122023cdcd41d"
}
```

### **🔹 Add a Product (Admin Only)**

```http
POST /api/product/add
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Body:**

```json
{
  "name": "Cloth 102",
  "price": "500",
  "stock": "10"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Product added successfully",
  "product_id": "67b0a7fba59122023cdcd418"
}
```

### **🔹 Get All Products**

```http
GET /api/products
```

**Response:**

```json
{
  "status": "success",
  "products": [
    {
      "_id": "67b05d3385e6947ca24af447",
      "name": "Cloth 101",
      "price": 500.5,
      "category": null,
      "__v": 0
    },
    {
      "_id": "67b05d3f85e6947ca24af44b",
      "name": "Cloth 102",
      "price": 500,
      "category": null,
      "__v": 0
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalProducts": 5,
    "pageLimit": 2
  }
}
```

### **🔹 Add Product to Cart**

```http
POST /api/cart/add
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Body:**

```json
{
  "productId": "67b05d3f85e6947ca24af44b",
  "quantity": "3"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Product added to cart",
  "cart": {
    "cart_data": [
      {
        "productId": "...",
        "quantity": 2,
        "id": "..."
      },
      {
        "productId": "...",
        "quantity": 6,
        "id": "..."
      }
      {
        "productId": "67b05d3f85e6947ca24af44b",
        "quantity": 3,
        "id": "67b05d3f85e6947ca24af44b"
      }
    ]
  }
}
```

### **🔹 Get Cart Items**

```http
GET /api/cart
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Response:**

```json
{
  "status": "success",
  "cart": {
    "cart_data": [
      {
        "productId": "...",
        "quantity": 5,
        "product": {
          "name": "Cloth 102",
          "price": 500,
          "stock": 10,
          "id": "67b05dd3fa7d7c580b41d810"
        }
      }
    ]
  }
}
```

### **🔹 Place an Order**

```http
POST /api/order/place
Authorization: Bearer <YOUR_JWT_TOKEN>
```

### **🔹 Generate Payment Link (Flutterwave)**

```http
POST /api/payment/pay/{orderId}
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Response:**

```json
{
  "status": "success",
  "message": "Payment URL generated successfully",
  "payment_url": "https://checkout.flutterwave.com/v3/hosted/pay/xyz123"
}
```

### **🔹 Get Top 3 Most-Purchased Items**

```http
GET /api/transactions/top-products
```

**Response:**

```json
{
  "status": "success",
  "topProducts": [
    { "productId": "65c7890def456", "count": 1500 },
    { "productId": "65b1234abc123", "count": 1200 },
    { "productId": "65a5678xyz123", "count": 1000 }
  ]
}
```

---

## **📌 Technologies Used**

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Payment Processing:** Flutterwave

---

## **📌 Contributors**

Maintained by [Feezybellz](https://github.com/Feezybellz).

---
