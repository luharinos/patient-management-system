
# **Patient Management System**

This project is a backend service for managing patients, doctors, and administrative workflows for an orthodontist clinic. It includes user authentication, patient record management, and appointment scheduling, with role-based access control for different user types.

---

## **Features**

- **Role-based Authentication**:
  - Admin, Doctor, and Patient roles.
  - Secure access using JWT.
- **Patient Record Management**:
  - Doctors can manage records of their assigned patients.
  - Patients can view their own records.
  - Admins have full access.
- **Appointment Scheduling**:
  - Patients can book appointments with doctors.
  - Doctors can manage their assigned appointments.
  - Admins can view and manage all appointments.

---

## **Technologies Used**

- **Node.js** with **TypeScript**
- **TypeORM**
- **SQLite**
- **Express.js**
- **JWT** for authentication
- **Postman** for API testing

---

## **Setup Instructions**

### **1. Prerequisites**

- Node.js (>=16.x)
- npm or yarn
- Git

### **2. Clone the Repository**

```bash
git clone https://github.com/luharinos/patient-management-system.git
cd patient-management-system
```

### **3. Install Dependencies**

```bash
npm install
```

### **4. Configure Environment Variables**

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
DATABASE="database.sqlite"
JWT_SECRET="myappsecret"
```

### **5. Database Setup**

The project uses SQLite as the database.

- Run the TypeORM migrations to set up the database schema:

```bash
npm run typeorm:sync
```

### **6. Start the Server**

To start the development server:

```bash
npm run start:dev
```

For production:

```bash
npm run build
npm start
```

---

## **API Endpoints**

### **Authentication**

| Method | Endpoint         | Description                   |
|--------|------------------|-------------------------------|
| POST   | `/user/register` | Register a new user           |
| POST   | `/user/login`    | Login and get a JWT token     |

### **Patient Records**

| Method | Endpoint                 | Role         | Description                        |
|--------|--------------------------|--------------|------------------------------------|
| GET    | `/patients`              | Admin/Doctor | Get a patient's record             |
| POST   | `/patients`              | Admin/Doctor | Add a new patient record           |
| PUT    | `/patients/:id`          | Admin/Doctor | Update a patient record            |
| DELETE | `/patients/:id`          | Admin        | Delete a patient record            |

### **Appointments**

| Method | Endpoint                 | Role          | Description                        |
|--------|--------------------------|---------------|------------------------------------|
| GET    | `/appointments`          | All           | View all/assigned appointments     |
| POST   | `/appointments`          | Admin/Patient | Book an appointment                |
| PUT    | `/appointments/:id`      | All           | Update an appointment              |
| DELETE | `/appointments/:id`      | Admin/Patient | Cancel an appointment              |

---

## **Code Quality**

- **ESLint** and **Prettier** are configured for linting and formatting.
  - To check linting:

    ```bash
    npm run lint
    ```

  - To format code:

    ```bash
    npm run format
    ```

---

## **Testing**

- Use **Postman** to test the API endpoints.
- A sample Postman collection is included in the project for convenience.

---

## **Folder Structure**

```text
src/
├── entities/       # TypeORM entities
├── controllers/    # API controllers
├── middleware/     # Middleware for authentication and validation
├── services/       # Business logic and database queries
├── routes/         # Express routes
├── utils/          # Utility functions
└── index.ts        # Entry point
```

---

## **Contributing**

1. Fork the repository.
2. Create a new branch for your feature:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add feature-name"
   ```

4. Push to your branch:

   ```bash
   git push origin feature-name
   ```

5. Create a pull request.

---

## **License**

This project is licensed under the MIT License.

---
