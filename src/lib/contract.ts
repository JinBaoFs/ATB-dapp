import USDTTokenAbi from "../contract/USDTToken.json"
import ATBWithdraw from "../contract/ATBWithdraw.json"
import ATBTokenAbi from "../contract/ATBToken.json"
const chainId = 56

export const usdtConfig = {
    address: "0x55d398326f99059ff775485246999027b3197955" as `0x${string}`,
    abi: USDTTokenAbi as any,
    chainId: chainId,
}

export const atbConfig = {
    address: "0x87b3820b3B75Da62Bdd904A5Fb9060F4D802d7E9" as `0x${string}`,
    abi: ATBTokenAbi as any,
    chainId: chainId,
}

export const withdarwConfig = {
    address: "0xFd297994631b2A15c602696bD127b92AA871453D" as `0x${string}`,
    abi: ATBWithdraw as any,
    chainId: chainId,
}