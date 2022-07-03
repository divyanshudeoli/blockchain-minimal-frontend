import {ethers} from "./ethers-5.6.esm.min.js"
import {abi,address} from "./constants.js"

const connnectButton=document.getElementById("connectButton")
const fundButton=document.getElementById("fundButton")
const balanceButton=document.getElementById("balanceButton")
const withdrawButton=document.getElementById("withdrawButton")
connnectButton.onclick=connect
fundButton.onclick=fund
balanceButton.onclick=getbalance
withdrawButton.onclick=withdraw

async function connect(){
    console.log(ethers)
    if(typeof window.ethereum !== "undefined"){
        await window.ethereum.request({method:"eth_requestAccounts"})
        connnectButton.innerHTML="Connected"
    }
    else {
        connnectButton.innerHTML="Install Metamask"
    }
}    

async function fund(){
    const ethAmount=document.getElementById("ethamount").value
    const provider=new ethers.providers.Web3Provider(window.ethereum)
    const signer=provider.getSigner()
    const contract=new ethers.Contract(address,abi,signer)
    try{
        const transactionResponse=await contract.fund(
            {value:ethers.utils.parseEther(ethAmount),})
        await transactionmine(transactionResponse,provider)
        console.log("Done")
    }catch(error){
        console.log(error)
    }
}

function transactionmine(transactionResponse,provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve,reject)=>{
        provider.once(transactionResponse.hash,(transactionReceipt)=>{
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })            
    })
}

async function getbalance(){
    if(typeof window.ethereum!="undefined"){
        const provider=new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(address)
        console.log(ethers.utils.formatEther(balance))
    }
}


async function withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, abi, signer)
      try {
        const transactionResponse = await contract.withdraw()
        await transactionmine(transactionResponse, provider)
      } catch (error) {
        console.log(error)
      }
    } else {
      withdrawButton.innerHTML = "Please install MetaMask"
    }
  }