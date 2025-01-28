# Littlefish NFT Wallet Authentication Framework

The npm package is updated to have serve both client and server functions.

Install latest Next JS version

```jsx
npx create-next-app@latest
```

For the demonstration we used the following values:

![Image 1](public/image1.png)


Install littlefish npm package

```jsx
npm install littlefish-nft-auth-framework
```

In your app directory create a “providers.jsx” file.

![Image 2](public/image2.png)


```jsx
"use client"
import { WalletProvider} from 'littlefish-nft-auth-framework/frontend';

export default function Providers({children}) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  )
};
```

In your “app/layout.tsx” file import the Providers and wrap your {children} around the wallet provider.

![Image 3](public/image3.png)


Now you are ready to use the package.

## UI Components

We have created two UI components that serve wallet connection and disconnection.
These are **WalletConnectButton** and **WalletConnectPage**. Both of them can be imported from **littlefish-nft-auth-framework/frontend**

## Client Types, Returned Values, and Function Descriptions

### Types

```typescript
interface Asset {
  policyID: string;
  assetName: string;
  amount: number;
};

interface Wallet {
  name: string;
  icon: string;
};

interface WalletContextProps {
  isConnected: boolean;
  assets: Asset[];
  connectedWalletId: string | null;
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: () => void;
  decodeHexToAscii: (processedArray: Asset[]) => Asset[];
  isClient: boolean;
  wallets: Wallet[];
  networkID: number;
  addresses: [string];
  balance: number;
};

```

### Hooks

- **`useWallet()`**
  - **Returns**: An object containing:
    - `isConnected` (`boolean`): Indicates if a wallet is currently connected.
    - `wallets` (`Array<Array<string, string>>`): List of detected wallet names and icons.
    - `connectedWalletId` (`string|null`): Identifier of the currently connected wallet.
    - `assets` (`Array<Array<string, string, number>>`): Decoded assets from the connected wallet, each represented as `[policyID, assetName, amount]`.

### Provider Component

- **`WalletProvider`**
  - **Purpose**: Provides wallet context to all child components in the application, allowing them access to wallet data and functions.

### Utility Functions

- **`connectWallet(walletName: string)`**
  - **Returns**: `Promise<void>`
  - **Description**: Attempts to connect to the specified wallet and updates the context with wallet details if successful. The function is asynchronous and resolves without returning any specific data.

- **`disconnectWallet()`**
  - **Returns**: `void`
  - **Description**: Resets connection-related state variables to reflect no active wallet connection. Does not return any data.

- **`decodeHexToAscii(processedArray: Array)`**
  - **Returns**: `Array<Array<string>>`
  - **Description**: Converts hex-encoded assetName strings within the processed array into ASCII strings. Returns an array with elements formatted as [policyID, assetName, amount].

- **`signMessage(walletName: string, isConnected: boolean, message: string, address: string)`**
  - **Returns**: `Promise<[string, string] | void>`
  - **Description**: uses the enabled browser wallet to sign a message to verify the ownership of the current connected wallet.
 
## SSO Metadata
This is the metadata standard for the NFT Authentication Framework. This metadata is designed to be used in various scenarios. The metadata is designed to be used in the 721 standard of Cardano. The assets with this metadata will need to be provided by the platform and distributed to the users for authentication on their platforms. Usage of Issuer and uniqueIdentifier allows the issuers to limit which of their applications can use the asset for authentication.
```json
{
    "721": {
      "policyID": {
        "LittleFishAuthNFT010": {
          "name": "Asset Name",
          "image": "ipfs image link",
          "mediaType": "image/png",
          "description": "Authentication token for the LittleFish platform - User 010",
          "files": [
            {
              "name": "image name",
              "mediaType": "image/png",
              "src": "ipfs image link"
            }
          ],
          "sso": {
            "version": "0.1.0", // The current version of the SSO Metadata.
            "uniqueIdentifier": "LF-AUTH-010-2024", // Unique identifier is set by the platform that provides this asset.
            "issuer": "littlefishFoundation",
            "issuanceDate": "2024-10-07T10:00:00Z",
            "expirationDate": "2025-10-07T10:00:00Z",
            "isTransferable": 0, // 0 for non-transferable, 1 for transferable asset
            "tiedWallet": "stake_test1uzjearxju092qyrc9v5rz6ejmz4yfyhj3vtc32mcvxs52as8zgjua" // if the wallet is non-transferable, tied wallet address,
            "isMaxUsageEnabled": 1, // if the maximum usage is enabled, 0 for no, 1 for yes
            "maxUsage": 10, // maximum usage limit
            "isInactivityEnabled": 1, // Inactivity period checker, 0 for no, 1 for yes
            "inactivityPeriod": "30d", // inactivity period, "d" for days, "m" for months, "y" for years
            "role": [
              "admin"
            ] // roles array, this is custom, the provided can assign their custom roles.
          }
        }
      }
    }
  }
```
## Server Types, Returned Values, and Function Descriptions

### Types
```typescript
interface SignupOptions {
    email?: string;
    password?: string;
    stakeAddress?: string;
    walletNetwork?: number;
    asset?: Asset;
    signature?: string;
    key?: string;
    nonce?: string;
    authPolicies?: string[];
    authPolicyStrict?: boolean;
}
    
interface LoginOptions {
    email?: string;
    password?: string;
    stakeAddress?: string;
    walletNetwork?: number;
    assets?: Asset[];
    signature?: string;
    key?: string;
    nonce?: string;
    authPolicy?: string;
}

interface SsoOptions {
    stakeAddress: string;
    walletNetwork: number;
    signature: string;
    key: string;
    nonce: string;
    asset: Asset;
    issuerOption: string;
    platformUniqueIdentifiers: string[];
    usageCount?: number;
    lastUsage?: string;
}

interface User {
    email?: string;
    password?: string;
    stakeAddress?: string;
    walletNetwork?: number;
    asset?: Asset;
}

interface SignupResult {
    success: boolean;
    email?: string;
    passwordHash?: string;
    stakeAddress?: string;
    walletNetwork?: number;
    asset?: Asset;
    error?: string;
    verifiedPolicy?: string;
}

interface LoginResult {
    success: boolean;
    error?: string;
}

interface SsoResult {
    success: boolean;
    roles?: string[];
    error?: string;
}
````
### Authentication Functions


- **`signupUser(options: SignupOptions)`**
    - **Returns**: SignupResult
    - **Description**: Can sign a user up with email and password or a Cardano wallet or assets. It verifies the ownership of the wallet by checking a signed data by the wallet. If provided, this function makes Blockfrost API call to verify the asset is actually in the the provided wallet. If the project provides authPolicies, this function will check if the provided asset is a member of any collection of the policy IDs provided. Depending on authPolicyStrict state, it can reject authentication.
- **`loginUser(user: User, options: signupOptions)`**
    - **Returns:** LoginResult
    - **Description**: This function can validate a user with either email and password or a Cardano wallet. It also verifies the ownership of the cardano wallet by verifying the signed data. If provided, this function makes Blockfrost API call to verify the asset is actually in the the provided wallet.
- **`sso(options: SsoOptions)`**
    - **Returns**: SsoResult
    - **Description**: Authentication function to validate users based on cardano asset and its sso metadata. The asset ownership verification and metadata fetching relies on Blockfrost API.

### Utility Functions

- **`generateNonce()`**
    - **Returns**: string
    - **Description**: It provides a one time use string to sign a data to the server.
- **`verifyWalletAddress(signature: string, key: string, message: string, hex: string)`**
    - **Returns**: boolean
    - **Description**: It verifies the ownership of the Cardano wallet.
- **`hashPassword(password: string)`**
    - **Returns**: string
    - **Description**: This function hashes the password entered by the user.
- **`validateEmail(email: string)`**
    - **Returns**: boolean
    - **Description**: This function checks if the entered email address is valid.
- **`validatePassword(password: string)`**
    - **Returns**: boolean
    - **Description**: Checks if the entered password for:
        - Contains at least one digit.
        - Contains at least one lowercase letter.
        - Contains at least one uppercase letter.
        - Is at least 8 characters long.
        
**In order to use the next functions you need to provide blockfrost API key and network**
```jsx
import { setConfig } from "littlefish-nft-auth-framework/backend";


const apiKey = "your-api-key";
const networkId = "network-you-use"; // can be "mainnet", "preprod"
setConfig(
  apiKey,
  networkId,
);
```
- **`verifyAssetOwnership(stakeAddress: string, asset: Asset, walletNetwork: number`**
    - **Returns**: Promise<boolean>
    - **Description**: Verifies the ownership of a specific asset associated with a wallet address.
- **`verifyAssetPolicy(policyId: string, stakeAddress: string, walletNetwork: number)`**
    - **Returns**: Promise<boolean>
    - **Description**: Verifies if a policy ID exists in the assets associated with a wallet address.
- **`verifyWalletAssets(assets: Asset[], stakeAddress: string, walletNetwork: number)`**
    - **Returns**: Promise<boolean>
    - **Description**: Verifies the assets associated with a wallet address.
- **`metadataReader(rawAsset: Asset)`**
    - **Returns**: Promise<[any, boolean]>
    - **Description**: Fetches the metadata of the provided asset and returns its metadata and checks if the metadata has a designated sso and returns true if it does.


## Example Usage

### Client Usage

First you need to import the **useWallet** hook to your component.

```jsx
import { useWallet } from "littlefish-nft-auth-framework/frontend";
```

Use the '**useWallet()**' hook inside your component to get access to several properties and methods such as **isConnected**, **wallets**, **assets**, and functions like **connectWallet**, 00disconnectWallet**, and **decodeHexToAscii**.
```jsx
const {
  isConnected,
  connectWallet,
  disconnectWallet,
  wallets,
  assets,
  networkID,
  addresses,
  decodeHexToAscii,
} = useWallet();
```

#### Wallet Connect

Here is an example of connecting wallet. The wallets array will be displayed to give the user the option which wallet they want to connect.
```jsx
wallets.map((wallet, index) => (
  <a key={index} onClick={() => connectWallet(wallet)}>{wallet}</a>
))

```

After the wallet connection, these will be updated:
- isConnected: It will be **True**
- assets: If there are any assets in the wallet, this will be an array of arrays.

#### Wallet Disconnect
In order to disconnect wallet:

```jsx
<a onClick={() => disconnectWallet()}>Disconnect Wallet</a>
```
This action will update:
- isConnected to **False**.
- assets to an empty array.

#### Displaying Assets

In order to display asset information and use **decodeHexToAscii** function, we initialized these states:
```jsx
const [walletAssets, setWalletAssets] = useState("");
const [isHex, setIsHex] = useState(true);

useEffect(() => {
  setWalletAssets(assets || []);
}, [assets]);
```

Here is how the **decodeHexToAscii** function updates **walletAssets** state:
```jsx
{isHex ? 
  <a onClick={() => {setWalletAssets(decodeHexToAscii(walletAssets)); setIsHex(false)}}>Decode Hex to Ascii</a> : 
  <a onClick={() => {setWalletAssets(assets); setIsHex(true)}}>Show Hex</a>
}

```

Displaying the assets:
```jsx
walletAssets.map((item, index) => (
  <pre key={index}>PolicyID: {item[0]}, Name: {item[1]}, Amount: {item[2]}</pre>
))

```

### Server Usage

All backend functions should be imported like this.
```typescript
import { signupUser, loginUser } from "littlefish-nft-auth-framework/backend";
```

#### Signup

A body is created like this and it is sent to the signupUser function. The body can either have email and password, or wallet information such as stakeAddress, walletNetwork, signature, key, and nonce

```typescript
const body = await request.json();
    const {
        email,
        password,
        stakeAddress,
        walletNetwork,
        signature,
        key,
        nonce,
        asset,
        authPolicies,
        authPolicyStrict,
    } = body;

const result = await signupUser(body)
````
signupUser will return an object in the type:
```typescript
interface SignupResult {
    success: boolean;
    email?: string;
    passwordHash?: string;
    stakeAddress?: string;
    walletNetwork?: number;
    asset?: Asset;
    error?: string;
    verifiedPolicy?: string;
}
```

If the signup process is done with email and password, the returned object will have success, email, passwordHash.
If the signup process is done with wallet information, the returned object will have success, stakeAddress, walletNetwork.
If the signup process is done with asset, the returned object will have success, stakeAddress, walletNetwork, asset, and optionally verifiedPolicy.
If the signup process fails it will return success and error.

#### Login

Login object is fed with two objects. A body is created like this and it is sent to the signupUser function. The body can either have email and password, or wallet information such as stakeAddress, walletNetwork, signature, key, and nonce.
```typescript
const body = await request.json();
    const {
        email,
        password,
        stakeAddress,
        walletNetwork,
        signature,
        key,
        nonce,
        asset
    } = body;
````

And a user object fetched from the used database:
```typescript
interface User {
    email?: string;
    password?: string;
    stakeAddress?: string;
    walletNetwork?: number;
}
```
The loginUser function can be used like this.

```typescript
const result = loginUser(user, body);
```

loginUser will return success and error if failed.

#### SSO
A body is created like this and it is sent to the sso function. 
```jsx
const body = await request.json();
    const {
    	stakeAddress,
    	walletNetwork,
    	signature,
    	key,
    	nonce,
    	asset,
    	issuerOption,
    	platformUniqueIdentifiers,
    	usageCount,
    	lastUsage
    } = body;
const result = await sso(body);
```
The sso function returns an object like this:
```jsx
interface SsoResult {
    success: boolean;
    roles?: string[];
    error?: string;
}
```

#### Utility Functions

##### Address Verification

verifyWalletAddress function can be used to verify ownership of the connected wallet.
```typescript
const result = verifyWalletAddress(signature: string, key: string, message: string, hex: string)
```

The signature and key can be received with the frontend **signMessage** function via asking the user to sign a nonce with their wallet.
The message is the nonce sent to the user by **signMessage** function. the hex is the reward address of the user wallet. It can be accessed via addresses of the context provider.