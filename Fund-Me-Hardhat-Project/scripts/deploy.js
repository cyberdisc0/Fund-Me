//imports
const {ethers, run, network} = require("hardhat")

//async main

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    console.log("deployinggggg")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`deployed at ${simpleStorage.address}`)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for block confirmations...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`current value is ${currentValue}`)

    const txResponse = await simpleStorage.store(7)
    await txResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`new value is ${updatedValue}`)

    


}

async function verify(contractAddress, args) {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    } catch(e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified")
        } else {
            console.log(e)
        }
    }
}

// main

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })