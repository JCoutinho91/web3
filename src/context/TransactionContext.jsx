import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;


const getEthereum = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)
    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"))

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
    }


    const getAllTransactions = async () => {
        try {
            if (!ethereum) return alert("Please Install MetaMask")
            const transactionContract = getEthereum();
            const availableTransactions = await transactionContract.getAllTransactions();

            const structuredTransaction = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)

            }))
            console.log(structuredTransaction)
            setTransactions(structuredTransaction)
        } catch (error) {
            console.log(error)
        }
    }



    const checkWalletConnect = async () => {
        try {
            if (!ethereum)
                return alert("Please Install MetaMask")

            const accounts = await ethereum.request({ method: "eth_accounts" })

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            }
            else {
                console.log("No accounts found.")
            }
            console.log(accounts)

        } catch (error) {
            console.log(error)
            throw new Error("No etherum object")
        }
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereum();
            const transactionCount = await transactionContract.getTransactionCount()

            window.localStorage.setItem("transactionCount", transactionCount)

        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum)
                return alert("Please Install MetaMask")
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            setCurrentAccount([0])
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }


    const sendTransaction = async () => {
        try {
            if (!ethereum)
                return alert("Please Install MetaMask")
            const { addressTo, amount, keyword, message } = formData
            const transactionContract = getEthereum();
            const parsedAmount = ethers.utils.parseEther(amount)

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [
                    {
                        from: currentAccount,
                        to: addressTo,
                        gas: "0x5208",
                        value: parsedAmount._hex,
                    }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
            setIsLoading(true)
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Sucess - ${transactionHash.hash}`)
            const transactionCount = await transactionContract.getTransactionCount()
            setTransactionCount(transactionCount.toNumber())

            window.reload();
        } catch (error) {
            console.log(error)
            throw new Error("No etherum object")

        }
    }

    useEffect(() => {
        checkWalletConnect()
        checkIfTransactionsExist()
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, transactions, formData, setFormData, handleChange, sendTransaction, isLoading }}>
            {children}
        </TransactionContext.Provider>
    )
}