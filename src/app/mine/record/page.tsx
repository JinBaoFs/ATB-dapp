"use client";
import { shortenString, timestampToTime } from '@/lib/utils';
import { getDepositLog } from '@/server/user'
import React, { useEffect, useState } from 'react'
import { useAccount,useNetwork } from 'wagmi'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Image from "next/image"
import CopyIcon from "@images/icon/copy.png"
import { Snackbar } from '@mui/material';
import { useTranslation } from "react-i18next"
import { useRouter, } from 'next/navigation';


interface IDepositLog {
    created_at: string
    id: number
    status: number
    address: string
    balance: string
    chain_type: number
}

export default function Record() {
    const { t } = useTranslation()
    const { address } = useAccount()
    const router = useRouter()
    const params = new URLSearchParams(window.location.search)
    const paramValue = params.get('c')
    const { chain } = useNetwork()
    const [snackbarValue, setSnackbarValue] = useState({
        open: false,
        message: ""
    })
    const [userDepositLog, setUserDepositLog] = useState<IDepositLog[]>()
    const getRecordLog = async () => {
        const { data } = await getDepositLog({
            address,
            chain_type: chain?.id,
            page_no: 1,
            page_size: 50,
        })
        setUserDepositLog(data.data)
    }
    useEffect(() => {
        getRecordLog()
    }, [address])
    const handleCopy = () => {
        setSnackbarValue({
            open: true,
            message: t("index.copy_success")
        })
    }

    const filterStatus = (val:any) => {
        if(val == 2){
            return t("mine.status_fail")
        }else if(val == 0){
            return t("mine.status_pedding")
        }else if(val == 1){
            return t("mine.status_success")
        }
    }
    return (
        <div className='p-[16px]'>
            <div className='rounded-xl text-white w-full overflow-y-scroll' style={{height: "calc(100vh - 150px)"}}>
                <div className="flex">
                    <span className="text-xl cursor-pointer" onClick={()=>{{ router.push(`/mine?c=${paramValue}`) }}}>&lt;</span>
                    <p className='text-white text-center flex-1' style={{fontSize: '18px'}}>{t("mine.cash_withdraw_reecord")}</p>
                </div>
                <ul className='mt-3 overflow-y-scroll'>
                    {
                        userDepositLog?.map((item, index) => {
                            return <li className='mt-4 bg-[rgba(255,255,255,0.1)] p-[12px] rounded-[10px] border border-[rgba(255,255,255,0.08)]' key={index}>
                                <div className='flex justify-between'>
                                    <p className='text-xs  text-[rgba(255,255,255,0.6)]'>
                                        {t("mine.status")} : {filterStatus(item.status) || "-"}
                                    </p>
                                </div>
                                <div className='flex mt-2 justify-between'>
                                    <p className='text-xs  text-[rgba(255,255,255,0.6)]'>
                                        {t("mine.address")} : {shortenString(item.address) || "-"}
                                    </p>
                                    <p className='cursor-pointer' onClick={handleCopy}>
                                        <CopyToClipboard text={item.address}>
                                            <Image
                                                src={CopyIcon}
                                                className='my-auto'
                                                width={14}
                                                height={14}
                                                alt=''
                                            />
                                        </CopyToClipboard>
                                    </p>
                                </div>
                                {/* <div className='flex mt-2 justify-between'>
                                    <p className='text-xs  text-[#6368A3]'>
                                        {t("mine.hash")} : {shortenString(item.hash) || "-"}
                                    </p>
                                    <p className='cursor-pointer' onClick={handleCopy}>
                                        <CopyToClipboard text={item.hash}>
                                            <Image
                                                src={CopyIcon}
                                                className='my-auto'
                                                width={14}
                                                height={14}
                                                alt=''
                                            />
                                        </CopyToClipboard>
                                    </p>
                                </div> */}
                                <div className='text-sm mt-2 flex justify-between'>
                                    <p>
                                        {item.created_at || "-"}
                                    </p>
                                    <p className='text-[#22FFE0]'>
                                        {item.balance} USDT
                                    </p>
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>
            <Snackbar
                open={snackbarValue.open}
                autoHideDuration={2000}
                onClose={() =>
                    setSnackbarValue({
                        open: false,
                        message: ""
                    })
                }
                message={snackbarValue.message}
            />
        </div>
    )
}
