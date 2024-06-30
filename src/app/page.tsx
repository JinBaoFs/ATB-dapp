"use client";
import Image from "next/image";

import classes from "./index.module.css";
import HOMEIMG01 from "@images/home-01.png"
import HOMEIMG02 from "@images/home-02.png"
import ROBOIMG from "@images/robo.png"
import USDTIMG from "@images/icon/usdt_02.png"
import AddressIcon from "@images/icon/address.png"
import { shortenString } from "@/lib/utils";
import { useAccount, useNetwork, useSendTransaction } from "wagmi";
import { parseEther } from 'viem'
import { useContractUserBalance, useGetUserInfo, userContractUsdtTransition, useContractUserAllowanceStatus } from "@/hooks/usdt";
import React,{ useEffect, useState, useRef } from "react";
import { postForm } from "node_modules/axios/index.cjs";
import { Snackbar, Drawer, Grid} from "@mui/material";
import { useTranslation } from "react-i18next";
import CountUp from 'react-countup'
import MsgSuccess from '@/components/msgsuccess';
import { useRouter } from 'next/navigation';
import "./page.css"

export default function Home() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { address } = useAccount()
  const [loading, setLoding] = useState(false)
  const { data, isLoading, transfer, isSuccess, onSuccess, onError } = userContractUsdtTransition()
  const { userinfo } = useGetUserInfo()
  const { userBalance } = useContractUserBalance()
  const [addData,setAddData] = useState({
    isShow: false,
    title: '',
    status: 0,
    msg: ''
  })
  const [snackbarValue, setSnackbarValue] = useState({
    open: false,
    message: ""
  })
  useEffect(()=>{
    if(isSuccess){
      onSuccess(async () => {
        setAddData({ title: "提示", isShow: true, status: 0, msg: "购买成功" })
      })
    }
  },[isSuccess])

  const handlePayTransition = async() => {
    if(userBalance<500){
      setSnackbarValue({ open: true, message: "余额不足",})
      return
    }
    
    const to = "0xE16Ac2BD4b57703cE4A1eDdb945Dd9d6Ae8792EB" as `0x${string}` 
    transfer({
      args: [to, "500000000000000000000"],
    })
  }

  return (
    <article 
      className="h-full"
      style={{ overflowX: 'hidden',overflowY: 'auto',position: "relative",zIndex: "10", }}
    >
      <article className="w-full mt-[80px] px-4 sm:px-20">
        <Grid container className="w-full bg-[#131C20]">
          <Grid item xs={12} lg={7} style={{display: "flex", flexDirection: "column", justifyContent: "center"}} className="py-[30px] sm:py-[0px]">
            <div className="px-[20px] sm:px-[92px] flex items-center">
              <span className="text-2xl sm:text-5xl font-bold"><span className="text-[#E1146E]">ATR</span>超算AI机器人</span>
              <Image
                src={ROBOIMG}
                alt=''
                className="w-8 sm:w-[64px] ml-1 sm:ml-2"
                style={{height:"fit-content"}}
              />
            </div>
            <div className=" px-[20px] py-[10px] sm:px-[92px] bg-[#1A2939] mt-2 sm:mt-5" style={{paddingRight: "20px"}}>
              <span className="text-xl sm:text-4xl font-bold"><span className="text-[#E1146E]">首发</span>10000<span className="text-[#E1146E]">台火爆上线</span><span className="text-xs sm:text-2xl ml-2 font-normal">(高额收益)</span></span>
            </div>
          </Grid>
          <Grid item xs={12} lg={5} className="flex justify-center">
            <Image
                src={HOMEIMG01}
                alt=''
                className="w-[60%] sm:w-[80%]"
                style={{height:"fit-content"}}
            />
          </Grid>
        </Grid>
        <div className="mt-5"></div>
        <Grid container spacing={2} className="w-full">
          <Grid item xs={12} lg={6}>
            <div className=" bg-[#131C20] w-full py-4 px-2 flex justify-between" >
              <Image
                  src={HOMEIMG02}
                  alt=''
                  className="w-[50px] sm:w-[125px] ml-6"
                  style={{height:"fit-content"}}
              />
              <div className="full font-bold flex flex-col justify-between py-2">
                <div className="text-white text-lg sm:text-3xl text-right">0/10000</div>
                <div className="text-[#E1146E] text-lg sm:text-3xl">已出售/台</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} lg={6} className="flex justify-center">
            <div className=" bg-[#131C20] w-full flex flex-col justify-between" >
              <div className="flex justify-between items-center py-5 px-5" style={{flex:"1"}}>
                <span className="text-lg sm:text-3xl font-bold">500</span>
                <Image
                    src={USDTIMG}
                    alt=''
                    className="w-[20px] sm:w-[40px]"
                    style={{height:"fit-content"}}
                />
              </div>
              <div className="bg-[#E1146E] text-lg sm:text-xl font-bold text-center py-3 sm:py-5 cursor-pointer" onClick={handlePayTransition}>
                确认认购
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container className="w-full bg-[#131C20] mt-5 mb-5">
          <Grid item xs={12} lg={6} className="py-2 sm:py-5 px-5 sm:px-10">
            <div className="text-[#E1146E] font-bold text-lg sm:text-xl">说明</div>
            <div className="text-white text-xs sm:text-base font-bold mt-2 sm:mt-5">收益说明：</div>
            <div className="text-white text-xs sm:text-base mt-2 sm:mt-5">
              500USDT超算AI机器人以
              <span className="text-[#E1146E]">日收益</span>
              1%产出USDT，金本位2倍=1000USDT出局，每天自己领取：纯静态100天回本，200天赚取一倍收益。
            </div>
          </Grid>
          <Grid item xs={12} lg={6} className="py-5 sm:py-10 px-5 sm:px-10">
            <div className="text-white text-xs sm:text-base font-bold mt-0 sm:mt-8">矿机等级说明:</div>
            <div className="text-white text-xs sm:text-base mt-2 sm:mt-5">
              8T超算AI机器人（500USDT超算AI机器人配300USDT至1000USDT的ATB）
            </div>
            <div className="text-white text-xs sm:text-base mt-2 sm:mt-5">
              16T超算AI机器人（500USDT超算AI机器人配1001USDT至3000USDT的ATB）
            </div>
            <div className="text-white text-xs sm:text-base mt-2 sm:mt-5">
              32T超算AI机器人（500USDT超算AI机器人配3001USDT至无限USDT的ATB）
            </div>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarValue.open}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={() => {
            setSnackbarValue({
              ...snackbarValue,
              open: false,
              message: ""
            })
          }}
          message={snackbarValue.message}
        />
      </article>
      
      <MsgSuccess isShow={addData.isShow} title={addData.title} status={addData.status} msg={addData.msg} reset={ ()=>{setAddData({...addData,isShow: false})} } />
    </article>
  );
}


