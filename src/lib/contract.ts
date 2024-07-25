import USDTTokenAbi from "../contract/USDTToken.json"
import ATBWithdraw from "../contract/ATBWithdraw.json"
import ATBTokenAbi from "../contract/ATBToken.json"
import LPTokenAbi from "../contract/LPToken.json"
const chainId = 56

export const usdtConfig = {
    address: "0x55d398326f99059ff775485246999027b3197955" as `0x${string}`,
    abi: USDTTokenAbi as any,
    chainId: chainId,
}

export const atbConfig = {
    address: "0xB4d5841Cb352be4b743283dd58B61ecd86655510" as `0x${string}`,
    abi: ATBTokenAbi as any,
    chainId: chainId,
}

export const withdarwConfig = {
    address: "0x9D9c34D891731287492a29468786D6ED7b8aDd05" as `0x${string}`,
    abi: ATBWithdraw as any,
    chainId: chainId,
}

export const LPConfig = {
    address: "0x59c16dc9aeb12d89459979529722b63b88c6cb3c" as `0x${string}`,
    abi: LPTokenAbi as any,
    chainId: chainId,
}