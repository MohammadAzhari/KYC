# Setup locally

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Access the result in your web browser at:
   [http://localhost:5173](http://localhost:5173)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   Create a `.env` file in the backend directory, similar to the `.env.sample` file provided. You'll need to fill in the connection string for PostgreSQL.

4. Run the migrations:
    ```bash
   npx prisma migrate deploy && npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

5. Access the result in your web browser at:
   [http://localhost:4000](http://localhost:4000)

Enjoy!
