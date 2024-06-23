"use client";
import { useContractUserBalance, useGetUserInfo, userContractApprove, useContractUserAllowanceStatus } from '@/hooks/usdt'
import React, { useEffect, useState } from 'react'
import { useAccount, useBalance , useEnsAvatar,useNetwork } from 'wagmi'

import { postUserWithoutExtract, getAddrHashDeposit } from '@/server/user';
import { useRouter, } from 'next/navigation';
import { useTranslation } from "react-i18next"
import { shortenString } from "@/lib/utils";
import Image from "next/image"
import XIMG from "@images/xing.png"
import ATBIMG from "@images/ATB.png"
import HOMEIMG02 from "@images/home-02.png"
import ROBOIMG from "@images/robo.png"
import WALLETIMG from "@images/wallet.png"
import TIMG01 from "@images/t-01.png"
import TIMG02 from "@images/t-02.png"
import TIMG03 from "@images/t-03.png"
import { Snackbar, Drawer, Grid, Paper, InputBase } from "@mui/material";
import "./page.css"


enum WithDrawTypes {
    UNDO,
    PENDING,
    SUCCESS,
    FAIL
}

export default function Mine() {
    const { t } = useTranslation()
    const { userinfo, getUserInfo } = useGetUserInfo()
    const { address } = useAccount()
    const router = useRouter()
    const { userBalance } = useContractUserBalance()
    const result = useBalance({ address })
    const [withoutValue, setWithoutValue] = useState("0")
    const { chain } = useNetwork()
    const [snackbarValue, setSnackBarValue] = useState({
        open: false,
        message: "",
        type: "success"
    })
    const [openDrawer, setOpenDrawer] = useState(false)
    const [contractAddress, setContractAddress] = useState<any>("")
    const [withDrawStatus, setWithDrawStatus] = useState<WithDrawTypes>(WithDrawTypes.UNDO)
    const params = new URLSearchParams(window.location.search)
    const paramValue = params.get('c')
    
    useEffect(()=>{
        if(userinfo.alreadyIncome){
            setWithoutValue(String(userinfo.alreadyIncome))
        }
    },[userinfo])

    const handleCash = async () => {
        if(!withoutValue){
            setSnackBarValue({
                ...snackbarValue,
                open: true,
                message: t("mine.money_tips01"),
            })
            setOpenDrawer(false)
            return;
        }else if(Number(withoutValue) == 0){
            setSnackBarValue({
                ...snackbarValue,
                open: true,
                message: t("mine.money_tips02"),
            })
            setOpenDrawer(false)
            return;
        }
        setWithDrawStatus(WithDrawTypes.PENDING)
        const { data } = await postUserWithoutExtract({
            address,
            balance: withoutValue,
            chain_type: chain?.id,
        })
        if (data == true) {
            setWithDrawStatus(WithDrawTypes.SUCCESS)
            getUserInfo()
        } else {
            setWithDrawStatus(WithDrawTypes.FAIL)
        }
        setTimeout(() => {
            setOpenDrawer(false)
            setWithDrawStatus(WithDrawTypes.UNDO)
        }, 2000)
    }
    return (
        <article 
            className="h-full"
            style={{ overflowX: 'hidden',overflowY: 'auto',position: "relative",zIndex: "10", }}
        >
            <article className="w-full mt-[80px] px-4 sm:px-20">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <div className="w-full bg-[#131C20] py-5 px-5 sm:px-8 sm:py-8">
                            <div className="flex flex-col py-2"> 
                                <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">我的上级</div>
                                <div className="w-full">
                                    <div className="bg-[#1C282F] text-base sm:text-lg w-[70%] sm:w-[80%] p-3 sm:p-5">0x00000000</div>
                                </div>
                            </div>
                            <div className="flex flex-col py-2"> 
                                <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">我的邀请链接</div>
                                <div className="w-full flex">
                                    <div className="bg-[#1C282F] text-base sm:text-lg w-[70%] sm:w-[80%] p-3 sm:p-5">0x00000000</div>
                                    <div className="flex-1 ml-2 sm:ml-5 text-white font-bold bg-[#017EFF] flex justify-center items-center cursor-pointer text-base sm:text-xl">复制</div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={6} className="flex">
                        <div className="w-full bg-[#131C20] flex flex-col">
                            <div className="#283C43 flex justify-between items-center bg-[#283C43] py-3 sm:py-5 px-5 sm:px-8">
                                <div className="text-[#E1146E] text-base sm:text-xl font-bold">当前节点等级(星):</div>
                                <div className="flex items-center">
                                    { [1,2].map((item,idx)=>{
                                        return (
                                            <Image
                                                src={XIMG}
                                                alt=''
                                                className="w-[20px] sm:w-[26px] ml-2"
                                                style={{height:"fit-content"}}
                                            />
                                        )
                                    }) }
                                </div>
                            </div>
                            <div className="#283C43 flex justify-between items-center py-8 sm:py-12 px-5 sm:px-8 text-white text-xs sm:text-lg font-bold">
                                <div >每月新增(USDT):</div>
                                <div>1000</div>
                            </div>
                            <div className="flex justify-between w-full mb-8">
                                <div className="flex justify-center items-center" style={{width: "50%"}}>
                                    <div className="bg-[#000] p-2 sm:p-3" style={{borderRadius: "10px"}}>
                                        <div className="bg-[#00FF30] w-3 h-3 sm:w-6 sm:h-6" style={{borderRadius: "50%"}}></div>
                                    </div>
                                    <span className="text-white text-xs sm:text-lg font-bold ml-2 sm:ml-5">达成</span>
                                </div>
                                <div className="flex justify-center items-center" style={{width: "50%"}}>
                                    <div className="bg-[#000] p-2 sm:p-3" style={{borderRadius: "10px"}}>
                                        <div className="bg-[#00FF30] w-3 h-3 sm:w-6 sm:h-6" style={{borderRadius: "50%",background: "#000"}}></div>
                                    </div>
                                    <span className="text-white text-xs sm:text-lg font-bold ml-2 sm:ml-5">未达成</span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <div className="bg-[#131C20] mt-5 mb-5">
                    <div className="px-5 py-5 sm:px-10">
                        <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">收益</div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={4} className="flex justify-center">
                                <div className="flex justify-between bg-[#1C282F] p-2 sm:p-5 w-full">
                                    <div className="flex items-center">
                                        <Image
                                            src={TIMG01}
                                            alt=''
                                            className="w-[20px] sm:w-[25px] mr-2 sm:mr-6"
                                            style={{height:"fit-content"}}
                                        />
                                        <span className="text-xs sm:text-xl font-bold">总收益(USDT)：</span>
                                    </div>
                                    <div className="text-base font-bold sm:text-2xl">0.00</div>
                                </div>
                            </Grid>
                            <Grid item xs={12} lg={4} className="flex justify-center">
                                <div className="flex justify-between bg-[#1C282F] p-2 sm:p-5 w-full">
                                    <div className="flex items-center">
                                        <Image
                                            src={TIMG02}
                                            alt=''
                                            className="w-[20px] sm:w-[25px] mr-2 sm:mr-6"
                                            style={{height:"fit-content"}}
                                        />
                                        <span className="text-xs sm:text-xl font-bold">已产出(USDT)：</span>
                                    </div>
                                    <div className="text-base font-bold sm:text-2xl">0.00</div>
                                </div>
                            </Grid>
                            <Grid item xs={12} lg={4} className="flex justify-center">
                                <div className="flex justify-between bg-[#1C282F] p-2 sm:p-5 w-full">
                                    <div className="flex items-center">
                                        <Image
                                            src={TIMG03}
                                            alt=''
                                            className="w-[20px] sm:w-[25px] mr-2 sm:mr-6"
                                            style={{height:"fit-content"}}
                                        />
                                        <span className="text-xs sm:text-xl font-bold">已领取(USDT)：</span>
                                    </div>
                                    <div className="text-base font-bold sm:text-2xl">0.00</div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="text-white font-bold bg-[#026451] h-12 sm:h-[70px] flex justify-center items-center cursor-pointer sm:mt-12 text-base sm:text-2xl">领取USDT</div>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6} className="flex justify-center">
                        <div className="bg-[#131C20] py-5 sm:py-8 px-5 sm:px-10 w-full">
                            <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">我的ATB明细</div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">已质押ATB数量：</span>
                                </div>
                                <div className="text-base sm:text-xl">0.00</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">预计收益ATB：</span>
                                </div>
                                <div className="text-base sm:text-xl">0.00</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">今日产出ATB：</span>
                                </div>
                                <div className="text-base sm:text-xl">0.00</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">累积领取ATB：</span>
                                </div>
                                <div className="text-base sm:text-xl">0.00</div>
                            </div>
                        </div>            
                    </Grid>
                    <Grid item xs={12} lg={6} className="flex justify-center">
                        <div className="bg-[#131C20] py-5 sm:py-8 px-5 sm:px-10 w-full">
                            <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold hidden sm:opacity-0 sm:block">我的ATB明细</div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">平均质押价格(USDT):</span>
                                </div>
                                <div className="text-base sm:text-xl">0.00</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">预计收益(USDT):</span>
                                </div>
                                <div className="text-base sm:text-xl">0.00</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">今日可领取收益(USDT):</span>
                                </div>
                                <div className="text-base sm:text-xl">0.00</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">累积领取收益(USDT):</span>
                                </div>
                                <div className="text-base sm:text-xl">0.00</div>
                            </div>
                        </div> 
                    </Grid>
                </Grid>
                <div className="bg-[#131C20] mt-5 mb-5">
                    <div className="px-5 py-5 sm:px-10 text-base font-bold sm:text-lg flex flex-col justify-center items-center">
                        <span className="text-[#E1146D]">已领取总收益（枚）</span>
                        <span className="mt-2 sm:mt-5">20≈80USDT</span>
                    </div>
                    <div className="text-white font-bold bg-[#E1146D] h-12 sm:h-[70px] flex justify-center items-center cursor-pointer sm:mt-2 text-base sm:text-2xl">领取收益</div>
                </div>
                <div className="mb-5 bg-[#131C20] px-5 py-5 sm:py-6 sm:px-10 text-xs sm:text-lg">说明: 金本位+币本位2倍出局，奖励随时领取每日按照持仓数量产出1%</div>
            </article>
        </article>
    )
}
