# Lottery Smart Contract

This is a smart contract deployed on the Rinkeby Network, an Ethereum test network.
Created for learning purposes.
This contract allows accounts to enter the lottery pool for a small fee.
Once the manager calls the pickWinner() method, one of the accounts in the pool will be selected as the winner and be rewarded with all the eth received by the other players in the pool.

#### Practiced Technologies

- Solidity language: Basic smart contract.
- Web3.js library: Basic use and implementation, used for communicating with different networks (local & Rinkeby), Deployment of the smart contract and testing.
- Ganache library: Used for generating an ethereum blockchain network locally to deploy and test the smart contract in.
- Mocha library: Used for testing our compiled smart contract while deployed in the local network.
- truffle library: Used to compile the smart contract.
- Remix website: Used to test and deploy locally the smart contract all in the same place. Also canbe used to test published smart contract using your MetaMask wallet.
- Infura: Generated an API key to ease the communication with Rinkeby network nodes and deploy our smart contract to Rinkeby network.
- MetaMask crypto currency online hot wallet.

#### Contract Details

- Contract address: 0x2c917c72519d9b60215Cc645eb97d6380060b549
- Deployed Account public key: 0x2c066033F96Eee67e8Af29DeDB2db0e0Ed20ee28

#### Methods:

- manager(): A Call readonly method. Returns the address of the contract's managers.
- players(): A Call readonly method. Returns a single player from the pool, index is expected as input.
- getPlayers(): A Send readonly method. Returns the list of all of the players in the pool, costs gas.
- enter(): A Send payable method. Adds sender address to the players pool, ether payment is expected (atleast 1 finney)
- pickWinner(): A Send readonly method. Picks a pseudorandom player out of the pool and transfers to him the contract's balance. **Can be called by manager only!**

## See for yourself

Steps of validation:

1. Go to Etherscan website: rinkeby.etherscan.io
2. In the search input, enter the contract address given in above section.
3. See details in Transactions, Contract and Events tabs.


## Test for yourself

- Practice MetaMask wallet is required!, <b>Do not</b> play with a real wallet!
- MetaMask wallet has to contain a bit of eth in Rinkeby network to interact atleast 0.005 eth.

Steps for testing: 

1. Go to Remix website: remix.ethereum.org
2. Go to DEPLOY & RUN TRANSACTIONS tab.
3. At the Environment input select Injected Web3 (MetaMask wallet connection will be asked at prompt)
4. In the At Address input paste the contract's address.
5. Click on At Addrress button.
6. You can see a small tab appear bellow with the title: Lottery AT 0X2C9, click on it to open options for transactions.

## Run project

* Requires npm version ^7.20.x

Steps to use project:

1. Clone to your machine.
2. Open Terminal in project folder.
3. Run: npm i

### To locally test using Ganache:

Open Terminal in project folder and run: npm run test

### To deploy the contract:

- You have to have a an Infura api url to succesfully deploy the smart contract.
1. Create a .env file in the project folder:
    - In .env file add: ACCOUNT_MNEMONIC="[[**enter your account mnemonic**]]"
    - In .env file add: INFURA_URL="[[**enter your your Infura URL**]]"
2. Open Terminal in project folder and run: npm run deploy

#### See web app repo [https://github.com/AmitNinoMoveo/Web3-Study-Lottery-Frontend](here)
