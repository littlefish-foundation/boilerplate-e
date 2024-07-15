# Littlefish NFT Auth Framework Demo

## Overview

This project demonstrates the implementation of the Littlefish NFT Auth Framework, an open-source JavaScript framework enabling Cardano dApps to implement NFT and wallet-based user authentication. It showcases a practical application of the framework in a Next.js environment.

## Features

- NFT and wallet-based authentication
- Integration with Cardano wallets (e.g., Nami, Eternl, Typhon)
- User dashboard with wallet connection status
- Settings management for authenticated users
- Dark mode support
- Responsive design

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma (for database management)
- NextAuth.js (for authentication)
- Littlefish NFT Auth Framework

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A Cardano wallet (e.g., Nami, Eternl, Typhon)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/littlefish-nft-auth-demo.git
   cd littlefish-nft-auth-demo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   POSTGRES_PRISMA_URL=your_postgres_prisma_url
   POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
   PREPROD_API_KEY=your_preprod_api_key
   MAINNET_API_KEY=your_mainnet_api_key
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations:
   ```
   npx prisma migrate dev
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Connect your Cardano wallet using the "Connect Wallet" button in the header.
2. Navigate to the login page to authenticate using your wallet or NFTs.
3. Explore the dashboard to view your authentication status and wallet information.
4. Access the settings page to manage your account preferences.

## Additional Resources

- [NPM Package](https://www.npmjs.com/package/littlefish-nft-auth-framework)
- [Additional Documentation](https://tools.littlefish.foundation/littlefish-research-hub/littlefish-open-source/open-source-nft-and-wallet-auth-framework-for-cardano)
- [Project Milestones](https://milestones.projectcatalyst.io/projects/1100213)

## Join Us

We welcome you to join our community:

- [Discord](https://discord.gg/96Rjg4b2T6)
- [Twitter](https://x.com/littlefishDAO)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgements

- Littlefish Foundation for developing the NFT Auth Framework
- The Cardano community for their support and inspiration

For more information about the Littlefish NFT Auth Framework, visit [https://littlefish.foundation/](https://littlefish.foundation/).