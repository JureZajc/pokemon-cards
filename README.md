# Pokémon Card Collection

A Next.js application for browsing, searching, and managing your Pokémon card collection.

**Disclaimer:** This project is a fan-made application and is not affiliated with, endorsed by, or in any way officially connected with The Pokémon Company International, Nintendo, or any of their affiliates. Pokémon and all related properties are trademarks of The Pokémon Company International and Nintendo.

## Features

- Browse a comprehensive database of Pokémon card sets.
- Search for specific cards by name.
- Create an account to manage your personal collection and wishlist.
- View card details, including prices and images.
- User authentication with NextAuth.js
- Ability to add/remove cards to collection
- Ability to add/remove cards from wishlist

## Technologies Used

- Next.js
- React
- Tailwind CSS
- NextAuth.js
- MongoDB
- Mongoose
- Pokémon TCG API

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or later)
- npm or yarn
- MongoDB

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/JureZajc/pokemon-cards
    cd pokemon-cards
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the following environment variables:

    ```
    MONGODB_URI=[Your MongoDB Connection String]
    NEXTAUTH_SECRET=[A Strong Secret for NextAuth]
    TCG_API=[Your Pokemon TCG API Key]
    ```

    **Explanation of Environment Variables:**

    - **`MONGODB_URI`:** This is the connection string for your MongoDB database. Replace `[Your MongoDB Connection String]` with the actual connection string for your MongoDB instance. For example:

      ```
      MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/databaseName?retryWrites=true&w=majority
      ```

    - **`NEXTAUTH_SECRET`:** This is a secret key used by NextAuth.js to encrypt session data and JWTs. You should generate a strong, random string for this value. You can use a tool like `openssl` to generate a suitable secret:

      ```bash
      openssl rand -base64 32
      ```

      Replace `[A Strong Secret for NextAuth]` with the generated secret key. Example:

      ```
      NEXTAUTH_SECRET=your-very-long-and-secret-key
      ```

    - **`TCG_API`:** This is your API key for the Pokémon TCG API. Replace `[Your Pokemon TCG API Key]` with your actual API key from the Pokémon TCG API. This API key must also be configured on your hosting provider.

    **Security Note:** Never commit your `.env.local` file to your repository. It contains sensitive information that should not be publicly accessible.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    This will start the Next.js development server on `http://localhost:3000`.

## Deployment

To deploy your Next.js application to a production environment, you can use platforms like Vercel, Netlify, or AWS. Refer to the Next.js deployment documentation for specific instructions:

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

When deploying to production, make sure to set the environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `TCG_API`) in your hosting provider's configuration settings.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request.

## License

This project is licensed under the MIT License.

Copyright (c) [2025] [Jure Zajc]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
