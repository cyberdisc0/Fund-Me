import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connect-btn")
const fundButton = document.getElementById("fund")
const balanceButton = document.getElementById("balance-btn")
const withdrawButton = document.getElementById("withdraw-btn")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)


async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({method: "eth_requestAccounts"})
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Please install metamask"
    }
}

async function getBalance() {
    if(typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            await listenForTxMine(txResponse, provider)
            console.log("Done")
        } catch(error) {
            console.log(error)
        }               
    } 
}

function listenForTxMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`)
    return new Promise( (resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(`Completed after ${txReceipt.confirmations} confirmations`)
            resolve()
        })
        
    })
}

async function withdraw() {
    if(typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.withdraw()
            await listenForTxMine(txResponse, provider)

        } catch(error) {
            console.log(error)
        }
    }

}

