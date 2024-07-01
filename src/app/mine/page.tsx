"use client";
import { useContractUserBalance, useGetUserInfo, userContractApprove, useContractUserAllowanceStatus } from '@/hooks/usdt'
import React, { useEffect, useState } from 'react'
import { useAccount, useBalance , useEnsAvatar,useNetwork } from 'wagmi'

import { getTeamInfo, getDirectPush } from '@/server/user';
import { useRouter, } from 'next/navigation';
import { useTranslation } from "react-i18next"
import ClipboardJS from 'clipboard';
import { shortenString } from "@/lib/utils";
import Image from "next/image"
import XIMG from "@images/xing.png"
import MIMG01 from "@images/m-01.png"
import MIMG02 from "@images/m-02.png"
import MIMG03 from "@images/m-03.png"
import MIMG04 from "@images/m-04.png"
import { Grid } from "@mui/material";
import MsgSuccess from '@/components/msgsuccess';
import "./page.css"


enum WithDrawTypes {
    UNDO,
    PENDING,
    SUCCESS,
    FAIL
}

export default function Mine() {
    const { t } = useTranslation()
    const { address } = useAccount()
    const [ teamInfo, setTeamInfo ] = useState<any>({})
    const [ shareLink, setShareLink ] = useState<any>("")
    const [ directData, setDirectData ] =useState<any>({})
    const params = new URLSearchParams(window.location.search)
    const paramValue = params.get('c')

    const [addData,setAddData] = useState({
        isShow: false,
        title: '',
        status: 0,
        msg: ''
    })

    
    useEffect(()=>{
        if(address){
            handleGetTeamInfo()
            handleGetDirectPush()
        }
    },[address])

    useEffect(()=>{
        const fullUrl = window.location.href.slice(0,-4);
        setShareLink(`${fullUrl}?address=${address}`)
    },[address])

    const handleCopyClick = () => {
        const clipboard = new ClipboardJS('.copy-btn');
        clipboard.on('success', function(e) {
            setAddData({
                title: "",
                isShow: true,
                status: 0,
                msg: "复制成功"
            })
        });
        clipboard.on('error', function(e) {
            console.error('Failed to copy text:', e.action);
            // 处理复制失败的情况
        });
    };

    const handleGetTeamInfo = async() => {
        let { data, code } = await getTeamInfo({
            address
        })
        setTeamInfo(data)
    }

    const handleGetDirectPush = async() =>{
        let {data,code} = await getDirectPush({
            address,
        })
        setDirectData(data)
    }

    const filterAddr = (val:any) => {
        if(!val || val.length<16){
            return val
        }else{
            let _str = val.slice(0, 4) + '***' + val.slice(-4)
            return _str
        }
    }
    return (
        <article 
            className="h-full"
            style={{ overflowX: 'hidden',overflowY: 'auto',position: "relative",zIndex: "10", }}
        >
            <article className="w-full mt-[80px] px-4 sm:px-20">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <div className="w-full bg-[#131C20] py-5 px-3 sm:px-8 sm:py-8">
                            <div className="flex flex-col py-2"> 
                                <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">我的上级</div>
                                <div className="w-full">
                                    <div className="bg-[#1C282F] text-xs sm:text-lg w-[100%] sm:w-[80%] p-3 sm:p-3">{teamInfo?.inviter}</div>
                                </div>
                            </div>
                            <div className="flex flex-col py-2"> 
                                <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">我的邀请链接</div>
                                <div className="w-full flex">
                                    <div className="bg-[#1C282F] text-xs sm:text-lg w-[70%] sm:w-[80%] p-3 sm:p-3 truncate">{ shareLink }</div>
                                    <div
                                        className="
                                        copy-btn flex-1 ml-2 sm:ml-5 
                                        text-white font-bold bg-[#017EFF] 
                                        flex justify-center items-center 
                                        cursor-pointer text-xs sm:text-xl"
                                        data-clipboard-text={shareLink}
                                        onClick={handleCopyClick}
                                    >复制</div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={6} className="flex">
                        <div className="w-full bg-[#131C20] flex flex-col">
                            <div className="#283C43 flex justify-between items-center bg-[#283C43] py-3 sm:py-5 px-5 sm:px-8">
                                <div className="text-[#E1146E] text-base sm:text-xl font-bold">当前节点等级(星):</div>
                                <div className="flex items-center">
                                    { Array(teamInfo?.vipLevel || 0).fill("").map((item,idx)=>{
                                        return (
                                            <Image
                                                src={XIMG}
                                                alt=''
                                                className="w-[16px] sm:w-[18px] ml-2"
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
                                    <span className="text-white text-xs sm:text-lg font-bold ml-2 sm:ml-5">未达成</span>
                                </div>
                                <div className="flex justify-center items-center" style={{width: "50%"}}>
                                    <div className="bg-[#000] p-2 sm:p-3" style={{borderRadius: "10px"}}>
                                        <div className="bg-[#00FF30] w-3 h-3 sm:w-6 sm:h-6" style={{borderRadius: "50%",background: "#000"}}></div>
                                    </div>
                                    <span className="text-white text-xs sm:text-lg font-bold ml-2 sm:ml-5">达成</span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <div className="bg-[#131C20] mt-5 mb-5">
                    <div className="px-5 py-5 sm:px-10">
                        <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">收益</div>
                        <Grid container spacing={2}>
                            <Grid item xs={3} lg={3} className="flex justify-center">
                                <div className="flex justify-between bg-[#1C282F] p-2 sm:p-4 w-full items-center">
                                    <Image
                                        src={MIMG01}
                                        alt=''
                                        className="w-[16px] sm:w-[20px] mr-1 sm:mr-6"
                                        style={{height:"fit-content"}}
                                    />
                                    <div className="text-xs sm:text-xl font-bold flex-1 text-center sm:mr-[20px]">钱包</div>
                                </div>
                            </Grid>
                            <Grid item xs={3} lg={3} className="flex justify-center">
                                <div className="flex justify-between bg-[#1C282F] p-2 sm:p-4 w-full items-center">
                                    <Image
                                        src={MIMG02}
                                        alt=''
                                        className="w-[16px] sm:w-[20px] mr-1 sm:mr-6"
                                        style={{height:"fit-content"}}
                                    />
                                    <div className="text-xs sm:text-xl font-bold flex-1 text-center sm:mr-[20px]">节点等级</div>
                                </div>
                            </Grid>
                            <Grid item xs={3} lg={3} className="flex justify-center">
                                <div className="flex justify-between bg-[#1C282F] p-2 sm:p-4 w-full items-center">
                                    <Image
                                        src={MIMG03}
                                        alt=''
                                        className="w-[16px] sm:w-[20px] mr-1 sm:mr-6"
                                        style={{height:"fit-content"}}
                                    />
                                    <div className="text-xs sm:text-xl font-bold flex-1 text-center sm:mr-[30px]">总业绩</div>
                                </div>
                            </Grid>
                            <Grid item xs={3} lg={3} className="flex justify-center">
                                <div className="flex justify-between bg-[#1C282F] p-2 sm:p-4 w-full items-center">
                                    <Image
                                        src={MIMG04}
                                        alt=''
                                        className="w-[16px] sm:w-[20px] mr-1 sm:mr-6"
                                        style={{height:"fit-content"}}
                                    />
                                    <div className="text-xs sm:text-xl font-bold flex-1 text-center sm:mr-[20px]">直推矿机数量</div>
                                </div>
                            </Grid>
                        </Grid>
                        <div className="h-[200px] sm:h-[320px] py-2 sm:py-5" style={{overflowY: "auto"}}>
                            <div className="flex w-full mb-2 text-xs sm:text-base">
                                <div className="w-[25%] flex items-center justify-center">
                                    {filterAddr(address)}
                                </div>
                                <div className="w-[25%] flex items-center justify-center">
                                    lv{teamInfo?.vipLevel || 0}
                                </div>
                                <div className="w-[25%] flex items-center justify-center">
                                    {teamInfo?.sumTotalPerformance || 0}
                                </div>
                                <div className="w-[25%] flex items-center justify-center">
                                    {teamInfo?.mineNumber || 0}
                                </div>
                            </div>
                            {
                                directData?.performances?.map((item:any,idx:any)=>{
                                    return (
                                        <div className="flex w-full mb-2 text-xs sm:text-base">
                                            <div className="w-[25%] flex items-center justify-center">
                                                {filterAddr(item.address)}
                                            </div>
                                            <div className="w-[25%] flex items-center justify-center">
                                                lv{item.vipLevel || 0}
                                            </div>
                                            <div className="w-[25%] flex items-center justify-center">
                                                {item.sumTotalPerformance || 0}
                                            </div>
                                            <div className="w-[25%] flex items-center justify-center">
                                                {item.mineNumber || 0}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            
                        </div>
                        <div className="flex py-2 sm:py-5 justify-between">
                            <div className="flex w-[45%] bg-[#1C282F] p-2 sm:p-4 text-xs sm:text-base justify-between">
                                <span>大区业绩:</span>
                                <span>{directData?.maxPerformanceValue || 0.00}</span>
                            </div>
                            <div className="flex w-[45%] bg-[#1C282F] p-2 sm:p-4 text-xs sm:text-base justify-between">
                                <span>小区业绩:</span>
                                <span>{directData?.minPerformanceValue || 0.00}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#131C20] mb-2 px-3 py-5 sm:px-10">
                    <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">说明</div>
                    <div className="flex items-center text-xs sm:text-xl font-bold">
                        <div className="">直推增加算力释放<span className="text-[#E1146E] mr-1 sm:mr-2">20%</span>(ATB)</div>
                        <div className="ml-2 sm:ml-5">间推增加算力释放<span className="text-[#E1146E] mr-1 sm:mr-2">10%</span>(ATB)</div>
                    </div> 
                    <div className="flex mt-2 sm:mt-5">
                        <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px]" style={{height:"fit-content"}}/>
                        </div>
                        <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">
                            1星节点要求，直推
                            <span className="text-[#E1146E]">5台</span>
                            ATR超算AI机器人，伞下业绩去除一个最大区业绩，其他业绩达到
                            <span className="text-[#E1146E]">5万U</span>
                            ，成为1星节点，除去直推间推外，拿三代以下的
                            <span className="text-[#E1146E]">5%</span>
                            加速释放。
                        </div>
                    </div>
                    <div className="flex mt-2 sm:mt-5">
                        <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                        </div>
                        <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">
                            2星节点要求，直推
                            <span className="text-[#E1146E]">5台</span>
                            ATR超算AI机器人，伞下业绩去除一个最大区业绩，其他业绩达到
                            <span className="text-[#E1146E]">15万U</span>
                            ，成为1星节点，除去直推间推外，拿三代以下的
                            <span className="text-[#E1146E]">8%</span>
                            加速释放。
                        </div>
                    </div>
                    <div className="flex mt-2 sm:mt-5">
                        <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                        </div>
                        <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">
                            3星节点要求，直推
                            <span className="text-[#E1146E]">5台</span>
                            ATR超算AI机器人，伞下业绩去除一个最大区业绩，其他业绩达到
                            <span className="text-[#E1146E]">30万U</span>
                            ，成为1星节点，除去直推间推外，拿三代以下的
                            <span className="text-[#E1146E]">11%</span>
                            加速释放。
                        </div>
                    </div>
                    <div className="flex mt-2 sm:mt-5">
                        <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                        </div>
                        <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">
                            4星节点要求，直推
                            <span className="text-[#E1146E]">5台</span>
                            ATR超算AI机器人，伞下业绩去除一个最大区业绩，其他业绩达到
                            <span className="text-[#E1146E]">60万U</span>
                            ，成为1星节点，除去直推间推外，拿三代以下的
                            <span className="text-[#E1146E]">14%</span>
                            加速释放。
                        </div>
                    </div>
                    <div className="flex mt-2 sm:mt-5">
                        <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                            <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-3" style={{height:"fit-content"}}/>
                        </div>
                        <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">
                            5星节点要求，直推
                            <span className="text-[#E1146E]">5台</span>
                            ATR超算AI机器人，伞下业绩去除一个最大区业绩，其他业绩达到
                            <span className="text-[#E1146E]">100万U</span>
                            ，成为1星节点，除去直推间推外，拿三代以下的
                            <span className="text-[#E1146E]">17%</span>
                            加速释放。
                        </div>
                    </div>
                </div>
                <div className="bg-[#131C20] mb-5 px-3 py-5 sm:px-10">
                    同级别，拿管理奖50%,达到星级节点的团队长，每月需要新增业绩，没有新增业绩，除了直推间推的加速释放，不享受其他加速挖矿。
                </div>
                <div className="bg-[#131C20] mb-5 px-3 py-5 sm:px-10">
                    <div className="text-[#E1146E] mb-2 sm:mb-5 text-base sm:text-xl font-bold">要求</div>
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={4}>
                            <div className="w-full flex">
                                <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px]" style={{height:"fit-content"}}/>
                                </div>
                                <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">1星每月新增 1000 <span className="text-[#0E7815]">USDT</span></div>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <div className="w-full flex">
                                <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                </div>
                                <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">2星每月新增 3000 <span className="text-[#0E7815]">USDT</span></div>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <div className="w-full flex">
                                <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                </div>
                                <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">3星每月新增 10000 <span className="text-[#0E7815]">USDT</span></div>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <div className="w-full flex">
                                <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                </div>
                                <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">4星每月新增 15000 <span className="text-[#0E7815]">USDT</span></div>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <div className="w-full flex">
                                <div className="flex justify-center items-center mr-2 sm:mr-5 bg-[#1C282F] w-[100px] sm:w-[165px]">
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                    <Image src={XIMG} alt='' className="w-[12px] sm:w-[16px] mr-1 sm:mr-2" style={{height:"fit-content"}}/>
                                </div>
                                <div className="flex-1 bg-[#1C282F] py-3 px-2 sm:px-5 text-xs sm:text-base">5星每月新增 20000 <span className="text-[#0E7815]">USDT</span></div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                
            </article>
            <MsgSuccess isShow={addData.isShow} title={addData.title} status={addData.status} msg={addData.msg} reset={ ()=>{setAddData({...addData,isShow: false})} } />
        </article>
    )
}
