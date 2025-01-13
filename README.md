# Setup locally

1. Clone the repository:

   ```bash
   git clone git@github.com:MohammadAzhari/KYC.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:
   Create a `.env` file in the backend directory, similar to the `.env.sample` file provided. You'll need to fill in the connection string for MySql.

4. Run the migrations:

   ```bash
   npx prisma migrate deploy && npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Enjoy!
