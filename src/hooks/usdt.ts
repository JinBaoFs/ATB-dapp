import { use, useEffect, useState } from "react"
import busdabi from "../contract/usdt.json"
import usdtabi from "../contract/usdtEth.json"
import USDTTokenAbi from "../contract/USDTToken.json"
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork } from "wagmi"
import { getIncome, postUseRregister, postUserAccessRecord, postUserIp, addAuthError } from "@/server/user"
import { setBalance } from "viem/actions"
import { atbConfig,usdtConfig,withdarwConfig, LPConfig } from "@/lib/contract"


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
    const { data, isLoading, isError, isSuccess, write: approve } = useContractWrite({
        ...usdtConfig,
        functionName: "approve",
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

export const userContractUsdtTransition = () => {
    const { data, isLoading, isError, isSuccess, write: transfer } = useContractWrite({
        ...usdtConfig,
        functionName: "transfer",
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
    return { data, isLoading, isSuccess, transfer, onSuccess, onError }
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

export const useContractUserLPAllowanceStatus = (spenderAddress:any) => {
    const { address } = useAccount()
    const [isAllowed, setIsAllowed] = useState(false);
    const { data: allowance, isLoading: loading, isError: error } = useContractRead({
        ...LPConfig,
        functionName: "allowance",
        args: [address,spenderAddress],
        watch: true,
    })
    useEffect(()=>{
        if(!address){
            setIsAllowed(false)
        }else{
            let divisor
            divisor = Math.pow(10, 18);
            const adjustedBalance = Number(allowance) / divisor;
            console.log(adjustedBalance,"LB授权额度")
            if(adjustedBalance > 0 ){
                setIsAllowed(true)
            }else{
                setIsAllowed(false)
            }
        }
    },[allowance,address])
    return { isAllowed }
}

export const useContractUserLPBalance = () => {
    const { address } = useAccount()
    const [userBalance, setUserBalance] = useState(0)
    const [balanceLoading, setBalanceLoading] = useState(true)
    const { data: balance, isLoading: loading, isError: error } = useContractRead({
        ...LPConfig,
        functionName: "balanceOf",
        args: [address],
        watch: true,
    })
    useEffect(() => {
        setBalanceLoading(true)
        if (!address) {
            setUserBalance(0)
        } else {
            // 将balance减小十的18次方
            let divisor
            divisor = Math.pow(10, 18);
            const adjustedBalance = Number(balance) / divisor;
            setUserBalance(adjustedBalance || 0)
        }
        setBalanceLoading(false)
    }, [balance, address])
    return { userBalance, balanceLoading }
}

export const useContractUserBalance = () => {
    const { address } = useAccount()
    const [userBalance, setUserBalance] = useState(0)
    const [balanceLoading, setBalanceLoading] = useState(true)
    const { data: balance, isLoading: loading, isError: error } = useContractRead({
        ...usdtConfig,
        functionName: "balanceOf",
        args: [address],
        watch: true,
    })
    useEffect(() => {
        setBalanceLoading(true)
        if (!address) {
            setUserBalance(0)
        } else {
            // 将balance减小十的18次方
            let divisor
            divisor = Math.pow(10, 18);
            const adjustedBalance = Number(balance) / divisor;
            setUserBalance(adjustedBalance || 0)
        }
        setBalanceLoading(false)
    }, [balance, address])
    return { userBalance, balanceLoading }
}

export const useContractUserATBBalance = () => {
    const { address } = useAccount()
    const [userBalance, setUserBalance] = useState(0)
    const [balanceLoading, setBalanceLoading] = useState(true)
    const { data: balance, isLoading: loading, isError: error } = useContractRead({
        ...atbConfig,
        functionName: "balanceOf",
        args: [address],
        watch: true,
    })
    useEffect(() => {
        setBalanceLoading(true)
        if (!address) {
            setUserBalance(0)
        } else {
            // 将balance减小十的18次方
            let divisor
            divisor = Math.pow(10, 18);
            const adjustedBalance = Number(balance) / divisor;
            setUserBalance(adjustedBalance || 0)
        }
        setBalanceLoading(false)
    }, [balance, address])
    return { userBalance, balanceLoading }
}

//获取池子USDT
export const useContractPollUSDT = () => {
    const { address } = useAccount()
    const [ userBalance, setUserBalance ] = useState(0)
    const [ balanceLoading, setBalanceLoading ] = useState(true)
    const { data: balance, isLoading: loading, isError: error } = useContractRead({
        ...usdtConfig,
        functionName: "balanceOf",
        args: [withdarwConfig.address],
        watch: true,
    })
    useEffect(() => {
        setBalanceLoading(true)
        if (!address) {
            setUserBalance(0)
        } else {
            // 将balance减小十的18次方
            let divisor
            divisor = Math.pow(10, 18);
            const adjustedBalance = Number(balance) / divisor;
            setUserBalance(adjustedBalance || 0)
        }
        setBalanceLoading(false)
    }, [balance, address])
    return { userBalance, balanceLoading }
}

//获取池子USDT
export const useContractPollATB = () => {
    const { address } = useAccount()
    const [ userBalance, setUserBalance ] = useState(0)
    const [ balanceLoading, setBalanceLoading ] = useState(true)
    const { data: balance, isLoading: loading, isError: error } = useContractRead({
        ...atbConfig,
        functionName: "balanceOf",
        args: [withdarwConfig.address],
        watch: true,
    })
    useEffect(() => {
        setBalanceLoading(true)
        if (!address) {
            setUserBalance(0)
        } else {
            // 将balance减小十的18次方
            let divisor
            divisor = Math.pow(10, 18);
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
    const [userinfo, setUserinfo] = useState<any>({
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
    const paramValue = params.get('address');
    const registerUser = async () => {
        if (balanceLoading || !address) return
        await postUseRregister({
            address,
            inviter: paramValue || "0xBB512ec2A600253222bD37D8FdfAB9b2Cb2866eB"
        })
    }
    const getUserInfo = async () => {
        const { data } = await getIncome({ address })
        let isRecord = false
        if(typeof sessionStorage !== 'undefined'){
            isRecord = Boolean(sessionStorage.getItem("isRecord"))
        }
        if (balanceLoading) return
        if (data !== undefined) {
            setUserinfo({
                ...data
            })
        }
        // if(isRecord) return
        // let res = await postUserIp({
        //     address,
        //     chain_type: chain?.id
        // })
        // if(res.data && typeof sessionStorage !== 'undefined'){
        //     sessionStorage.setItem("isRecord",String(true))
        // }
        

    }
    useEffect(() => {
        (async () => {
            await registerUser()
            // await getUserInfo()
        })()
    }, [address, balanceLoading, chain])
    return { userinfo, setUserinfo, getUserInfo }
}