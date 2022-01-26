const Tether=artifacts.require('Tether')
const Reward=artifacts.require('Reward')
const DecentralBank=artifacts.require('DecentralBank')

module.exports=async function(deployer,network, accounts){
    await deployer.deploy(Tether);
    const tether=await Tether.deployed();

    await deployer.deploy(Reward);
    const rwd=await Reward.deployed();

    await deployer.deploy(DecentralBank,rwd.address,tether.address);
    const decentralBank=await DecentralBank.deployed();

    await rwd.transfer(decentralBank.address,'1000000000000000000000000')

    await tether.transfer(accounts[1],'1000000000000000000')

};
