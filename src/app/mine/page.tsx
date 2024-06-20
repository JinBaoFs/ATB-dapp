"use client";
import { useContractUserBalance, useGetUserInfo, userContractApprove, useContractUserAllowanceStatus } from '@/hooks/usdt'
import { Divider, Drawer, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAccount, useBalance , useEnsAvatar,useNetwork } from 'wagmi'

import { postUserWithoutExtract, getAddrHashDeposit } from '@/server/user';
import { useRouter, } from 'next/navigation';
import { useTranslation } from "react-i18next"
import { shortenString } from "@/lib/utils";
import Image from "next/image"
import NFTImg from "@images/icon/usdt_03.png"
import USTDImg from "@images/icon/ustd.png"
import PendingIcon from "@images/icon/pending.png"
import FailIcon from "@images/icon/fail.png"
import SuccessIcon from "@images/icon/success.png"
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
        <div className='p-[16px] overflow-y-scroll' style={{height: "calc(100vh - 100px)"}}>
            <div className="flex flex-col" style={{alignItems: "center"}}>
                <Image
                    src={NFTImg}
                    width={40}
                    height={40}
                    alt=''
                    className='rounded-full'
                />
                <p className="my-auto mt-2">
                    {!address ? "-" : shortenString(address)}
                </p>
                <div className="total-number text-center mt-2">{ Number(userinfo?.sumIncome*1 || 0).toFixed(2) || "-"} USDT</div>
                <p className='text-sm mt-1 text-[rgba(255,255,255,0.8)]'>{t("mine.total_revenue")}</p>
                <div className="line mt-2"></div>
            </div>
            <div className="rounded-xl">
                <div className="w-full rounded-xl m-auto text-[#fff]">
                    <div className="mt-3">
                        <div className="flex justify-between" style={{alignItems: "center"}}>
                            <div style={{fontSize: "14px",color: "rgba(255,255,255,0.8)"}}>{t("mine.locked_balance")}:</div>
                            <div className="text-lg font-bold">{ Number(userinfo?.freezeAmount*1 || 0).toFixed(2) || "-"} USDT</div>
                        </div>
                        <div className="flex justify-between mt-2" style={{alignItems: "center"}}>
                            <div style={{fontSize: "14px",color: "rgba(255,255,255,0.8)"}}>{t("mine.total_earnings")}:</div>
                            <div className="text-lg font-bold">{ Number(userinfo?.dayIncome*1 || 0).toFixed(2) || "-"} USDT</div>
                        </div>
                        <div className="flex justify-between mt-2" style={{alignItems: "center"}}>
                            <div style={{fontSize: "14px",color: "rgba(255,255,255,0.8)"}}>{t("mine.wallet_balance")}:</div>
                            <div className="text-lg font-bold"> {Number(result?.data?.formatted || 0).toFixed(2) || "-" } { chain?.id == 1 ? "ETH" : "BNB" }</div>
                        </div>
                        <div className="flex justify-between mt-2" style={{alignItems: "center"}}>
                            <div style={{fontSize: "14px",color: "rgba(255,255,255,0.8)"}}>{t("mine.wallet_balance")}:</div>
                            <div className="text-lg font-bold">{ Number(userBalance*1 || 0).toFixed(2) || "-"} USDT</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.1)] mt-3 px-[14px] py-[14px] rounded-[10px] cash-box">
                <p className='text-white font-bold' style={{fontSize: "14px"}}>
                    {t("mine.withdraw_wallet")}
                </p>
                <p className='mt-2 text-[rgba(255,255,255,0.8)]' style={{fontSize: "12px"}}>
                    {t("mine.withdraw_able")}: {Number(userinfo?.alreadyIncome*1 || 0).toFixed(2) || "-"} USDT
                </p>
                <div className='mt-2 bg-[rgba(255,255,255,0.1)] p-3 rounded-lg flex justify-between' style={{alignItems:"center"}}>
                    <input value={withoutValue} type="text" onChange={(e) => {
                        if (Number(e.target.value) > userinfo.alreadyIncome) {
                            setSnackBarValue({
                                ...snackbarValue,
                                open: true,
                                message: t("mine.withdraw_tips_01"),
                            })
                            return
                        }
                        setWithoutValue(e.target.value)
                    }} className='!bg-[rgba(255,255,255,0)] h-[28px] focus:!bg-[rgba(255,255,255,0)] text-white !ring-0 focus-visible:!ring-0 w-full mr-2' />
                    <div className="h-[20px]">
                        <Image
                            src={USTDImg}
                            width={20}
                            height={20}
                            alt=''
                            className='rounded-full'
                        />
                    </div>
                </div>
                <div className="flex justify-between mt-3">
                    <div onClick={() => { router.push(`/mine/record?c=${paramValue}`) }} className='record-btn'>
                        {t("mine.withdraw_record")}
                    </div>
                    <div className='cash-btn'
                        onClick={() => {
                            if (Number(withoutValue) <= userinfo.alreadyIncome) {
                                setOpenDrawer(true)
                                setWithDrawStatus(WithDrawTypes.UNDO)
                            }
                        }}
                    >
                        {t("mine.withdraw")}
                    </div>
                </div>
                <div className="sync-m-01"></div>
                <div className="sync-m-02"></div>
            </div>
            <Snackbar
                open={snackbarValue.open}
                autoHideDuration={6000}
                message={snackbarValue.message}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => {
                    setSnackBarValue({
                        ...snackbarValue,
                        open: false,
                        message: ""
                    })
                }}
            />
            <Drawer
                anchor="bottom"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{
                    style: {
                        backgroundColor: "#252525",
                        borderRadius: "10px 10px 0px 0px",
                    },
                }}
            >
                <section className='w-full p-5' style={{
                    background: "linear-gradient( 180deg, #2D5751 0%, #2F4D32 100%)",
                }}>
                    <p className='text-center text-base text-white'>
                        {t("mine.confirm_withdraw")}
                    </p>
                    <div className="line mt-2"></div>
                    {
                        withDrawStatus == WithDrawTypes.UNDO ?
                            <div className='mt-5 flex justify-between'>
                                <div className='record-btn cursor-pointe' onClick={() => setOpenDrawer(false)}>
                                    {t("mine.cancel")}
                                </div>
                                <div className='cash-btn' onClick={handleCash}>
                                    {t("mine.confirm")}
                                </div>
                            </div> : <div className='mt-5'>
                                <Image
                                    src={withDrawStatus == WithDrawTypes.PENDING ? PendingIcon : withDrawStatus == WithDrawTypes.SUCCESS ? SuccessIcon : FailIcon}
                                    width={45}
                                    height={45}
                                    alt=""
                                    className='m-auto mb-3'
                                />
                                <p className='text-center text-xs text-[#B588B4]'>{withDrawStatus == WithDrawTypes.PENDING ? t("mine.status_pedding") : withDrawStatus == WithDrawTypes.SUCCESS ? t("mine.status_success") : t("mine.status_fail") }</p>
                            </div>
                    }
                </section>
            </Drawer>
            
        </div>
    )
}
