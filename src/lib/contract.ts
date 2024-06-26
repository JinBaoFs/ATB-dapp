import USDTTokenAbi from "../contract/USDTToken.json"
import ATBWithdraw from "../contract/ATBWithdraw.json"
import ATBTokenAbi from "../contract/ATBToken.json"
const chainId = 97

export const usdtConfig = {
    address: "0x28889F5f56DDE7fb545767ae58C6ce7e4a0E587D" as `0x${string}`,
    abi: USDTTokenAbi as any,
    chainId: chainId,
}

export const atbConfig = {
    address: "0x5ec2f367AFDE60E6EB958870e734C98cDb189fFF" as `0x${string}`,
    abi: ATBTokenAbi as any,
    chainId: chainId,
}

export const withdarwConfig = {
    address: "0x75CD3ed97735FC55C3A24301f61a810aB0cBaf77" as `0x${string}`,
    abi: ATBWithdraw as any,
    chainId: chainId,
}