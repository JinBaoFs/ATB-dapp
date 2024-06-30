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
import { useContractUserATBBalance } from "@/hooks/usdt"
import { getSignData,getIncome } from '@/server/user';
import MsgSuccess from '@/components/msgsuccess';

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

    const { userBalance } = useContractUserATBBalance()
    const [addData,setAddData] = useState({ isShow: false, title: '',  status: 0, msg: '' })
    const [snackbarValue, setSnackbarValue] = useState({ open: false, message: ""})

    useEffect(()=>{
        if(pleIssuccess){
            setAmount(0)
            setAddData({ title: "", isShow: true, status: 0, msg: "质押成功" })
            handleGetIncomeInfo()
        }
        if(usdtIssuccess){
            setAddData({ title: "", isShow: true, status: 0, msg: "领取成功"})
            handleGetIncomeInfo()
        }
    },[pleIssuccess,usdtIssuccess])

    useEffect(()=>{
        if(address){
            handleGetIncomeInfo()
        }
    },[address])


    //质押
    const handlePledge = async () => {
        if(userBalance<amount){
            setSnackbarValue({ open: true, message: "余额不足",})
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
        if(!address) return
        let { data, code } = await getSignData({
            address: address,
            typeStatus: "USDT"
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
    }

    //领取ATB
    const handleReceiveATB = async() => {
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
        
    }
    
    //获取收益信息
    const handleGetIncomeInfo = async() => {
        let {data,code} = await getIncome({
            address
        })
        if(code == 200){
            setIncomeInfo(data)
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
                                <span className="text-white font-bold text-lg sm:text-2xl"><span className="text-[#E1146E]">ATB实时价格:</span>0.00$</span>
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
                                            <span className="text-xs sm:text-xl">ATB余额:</span>
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
                                            <span className="text-xs sm:text-xl">ATR超算机器人等级:</span>
                                        </div>
                                        <div className="text-base font-bold sm:text-2xl">{ incomeInfo?.atb_bot_level || 0 }</div>
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
                                质押
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
                                        <span className="text-xs sm:text-xl font-bold">已产出(USDT)：</span>
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
                                        <span className="text-xs sm:text-xl font-bold">已领取(USDT)：</span>
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
                        领取USDT
                    </div>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6} className="flex justify-center">
                        <div className="bg-[#131C20] py-5 sm:py-8 px-5 sm:px-10 w-full">
                            <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">我的ATB明细</div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">已质押ATB数量：</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo.atbInAmount || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">预计收益ATB：</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.estimatedAtbAmount || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">今日产出ATB：</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.dayIncomeAtb || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">累积领取ATB：</span>
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
                                    <span className="text-xs sm:text-lg">平均质押价格(USDT):</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.atbPrice || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">预计收益(USDT):</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.estimatedAtbUsdt || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">今日可领取收益(USDT):</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.dayIncomeAtbUsdt || 0.00}</div>
                            </div>
                            <div className="flex justify-between bg-[#1C282F] p-2 sm:p-3 w-full mt-2">
                                <div className="flex items-center">
                                    <span className="text-xs sm:text-lg">累积领取收益(USDT):</span>
                                </div>
                                <div className="text-base sm:text-xl">{incomeInfo?.sumAtbPrice || 0.00}</div>
                            </div>
                        </div> 
                    </Grid>
                </Grid>
                <div className="bg-[#131C20] mt-5 mb-5">
                    <div className="px-5 py-5 sm:px-10 text-base font-bold sm:text-lg flex flex-col justify-center items-center">
                        <span className="text-[#E1146D]">已领取总收益（枚）</span>
                        <span className="mt-2 sm:mt-5">{incomeInfo?.alreadyIncomeAtb || 0}≈80USDT</span>
                    </div>
                    <div 
                        className="text-white font-bold bg-[#E1146D] h-12 sm:h-[70px] flex justify-center 
                        items-center cursor-pointer sm:mt-2 text-base sm:text-2xl"
                        onClick={handleReceiveATB}
                    >
                        领取收益
                    </div>
                </div>
                <div className="mb-5 bg-[#131C20] px-5 py-5 sm:py-6 sm:px-10 text-xs sm:text-lg">说明: 金本位+币本位2倍出局，奖励随时领取每日按照持仓数量产出1%</div>
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
