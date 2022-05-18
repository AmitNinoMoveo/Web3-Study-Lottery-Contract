const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile.js'); 

let accounts;
let lottery;
beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', ()=>{

    it('Contract deployed', ()=>{
        assert.ok(lottery.options.address);
    });

    it('Allows one account to enter', async ()=>{
        // Entering lottery
        await enterLotteryWithAccount(1, defaultWeiAmount());
        // Checking players list
        const players = await lottery.methods.getPlayers().call({from: accounts[1], gas: '1000000'});
        if(players.length <= 0) assert.fail('Players list returned is empty!');
        assert.ok(players.includes(accounts[1]));
    });
    
    it('Allows multiple accounts to enter', async ()=>{
        // Entering lottery.
        await enterLotteryMultipleAccounts(3, defaultWeiAmount());
        // Checking players list.
        const players = await lottery.methods.getPlayers().call({from: accounts[1], gas: '1000000'});
        if(players.length <= 0) assert.fail('Players list returned is empty!');
        assert.equal(players.length, 3);
        for (let i = 1; i < 4; i++) {
            assert.ok(players.includes(accounts[i]));
        }
    });
    
    it('Requires a minimum amount of ether to enter', async ()=>{
        try {
            await enterLotteryWithAccount(1, 1); // Entering with one Wei which is not enough to enter.
            // Syntax might be confusing!
            // This assert.fail('...') statement, reports the test failed because an error was indeed expected.
            // Since we did not get an error, test is considered as Failed.
            assert.fail('Expected error was not reproduced! Transaction should have failed because we sent a lower amount of eth than contract allows!');
        } catch (err) {
            assert(err);
        }
    });
    
    it('Only manager can call pick winner', async()=>{
        // Entering lottery, Since picking a winner requires atleast two players have entered the pool.
        await enterLotteryMultipleAccounts(2, defaultWeiAmount());
        try {
            // Lottery manager is account[0], since we deployed the contract with this account.
            await pickWinnerWithAccount(1);
            assert.fail('Expected error was not reproduced! Transaction should have failed because the account that sent the transaction is the manager!');
        } catch (err) {
            assert(err);
        }
    });

    it('Picking a winner is allowed only when atleast two players to have entered the pool.', async()=>{
        try {
            await enterLotteryWithAccount();
            await pickWinnerWithAccount();
            assert.fail('Expected error was not reproduced! Transaction should have failed because no players have entered the lottery!');
        } catch (err) {
            assert(err);
        }
    });

    it('Sends money to the winner and resets the players array', async ()=>{
        const firstPlayerInitialBalance = await web3.eth.getBalance(accounts[1]);
        const secondPlayerInitialBalance = await web3.eth.getBalance(accounts[2]);

        await enterLotteryMultipleAccounts(2, web3.utils.toWei('2', 'ether'));
        await pickWinnerWithAccount();

        const firstPlayerFinalBalance = await web3.eth.getBalance(accounts[1]);
        const secondPlayerFinalBalance = await web3.eth.getBalance(accounts[2]);

        assert( ((firstPlayerInitialBalance - firstPlayerFinalBalance) > 0)
        || ((secondPlayerInitialBalance - secondPlayerFinalBalance) > 0) );
    });

    it('Players list is emptied after winner is picked', async ()=>{
        await enterLotteryMultipleAccounts(2, web3.utils.toWei('2', 'ether'));
        await pickWinnerWithAccount(0);
        const players = await lottery.methods.getPlayers().call({from: accounts[1], gas: '1000000'});
        assert(players.length == 0);
    });

    it('Contract balance is emptied upon picking a winner', async ()=>{
        await enterLotteryMultipleAccounts(2, web3.utils.toWei('2', 'ether'));
        await pickWinnerWithAccount(0);
        const contractBalance = await web3.eth.getBalance(lottery.options.address);
        assert(contractBalance == 0);
    });
});

function defaultWeiAmount() {
    return web3.utils.toWei('1.1', 'finney');
}

async function pickWinnerWithAccount(accountIndex = 0) {
    await lottery.methods.pickWinner().send({ from: accounts[accountIndex], gas: '1000000' });
}

async function enterLotteryMultipleAccounts(amountOfAccounts, weiAmount) {
    const promises = [];
    for (let i = 1; i <= amountOfAccounts; i++) {
        promises.push(enterLotteryWithAccount(i, weiAmount));
    }
    await Promise.allSettled(promises);
}

async function enterLotteryWithAccount(accountIndex, weiAmount) {
    return await lottery.methods.enter().send({ from: accounts[accountIndex], gas: '1000000', value: weiAmount });
}

