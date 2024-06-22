"use client";
import Banner from '@/components/banner'
import React from 'react'
import TransIcon from "@images/icon/trans_01.png"
import StableIcon from "@images/icon/stable_01.png"
import Image from "next/image"
import SafeIcon from "@images/icon/safe_01.png"
import ProfIcon from "@images/icon/prof_01.png"
import LowIcon from "@images/icon/low_01.png"
import Fna from '@/components/fna'
import BnIcon from "@images/icon/bn.png"
import lbIcon from "@images/icon/lb.png"
import kcIcon from "@images/icon/kc.png"
import kkIcon from "@images/icon/kk.png"
import gateIcon from "@images/icon/gate.png"
import UpIcon from "@images/icon/up.png"
import OkIcon from "@images/icon/ok.png"
import BitIcon from "@images/icon/bit.png"
import WazIcon from "@images/icon/waz.png"
import HuobiIcon from "@images/icon/hb.png"
import CoinbaseIcon from "@images/icon/cb.png"
import CyIcon from "@images/icon/cp.png"
import { useTranslation } from "react-i18next"
import "./page.css"

export default function Service() {
    const { t } = useTranslation()
    const programList = [
        {
            icon: SafeIcon,
            title: t("service.p_t01"),
            desc: t("service.p_c01")
        },
        {
            icon: ProfIcon,
            title: t("service.p_t02"),
            desc: t("service.p_c02")
        },
        {
            icon: LowIcon,
            title: t("service.p_t03"),
            desc: t("service.p_c03")
        }
    ]
    const partnerList = [
        {
            icon: BnIcon,
            title: "Binance"
        },
        {
            icon: lbIcon,
            title: "LBank",
        },
        {
            icon: kcIcon,
            title: "kuCoin"
        },
        {
            icon: kkIcon,
            title: "KraKen"
        },
        {
            icon: gateIcon,
            title: "Gate.io"
        },
        {
            icon: UpIcon,
            title: "Upbit"
        },
        {
            icon: OkIcon,
            title: "OkEx"
        },
        {
            icon: BitIcon,
            title: "Bitfinex"
        },
        {
            icon: WazIcon,
            title: "Wazirx"
        },
        {
            icon: HuobiIcon,
            title: "HuobiGlobal"
        },
        {
            icon: CoinbaseIcon,
            title: "coinBase"
        },
        {
            icon: CyIcon,
            title: "Crypto.com"
        }
    ]
    return (
        <div className='px-[22px]'>
            <div className="title mt-5" style={{fontSize: "16px",color: "#fff"}}>{t("service.title")}</div>
            <div className="mt-10 flex usdt-row">
                <div className='bg-[rgba(255,255,255,0.2)] p-3 rounded-xl flex-col usdt-item'>
                    <Image
                        src={TransIcon}
                        width={72}
                        height={63}
                        className='my-auto'
                        alt=""
                    />
                    <p className='text-sm text-center'>
                        {t("service.no_transfer")}
                    </p>
                    <div className="sync-box rounded-xl">
                        <div className="sync-s-01"></div>
                        <div className="sync-s-02"></div>
                    </div>
                </div>
                <div className='bg-[rgba(255,255,255,0.2)] p-3 rounded-xl flex-col usdt-item'>
                    <Image
                        src={StableIcon}
                        width={70}
                        height={70}
                        className='my-auto'
                        alt=""
                    />
                    <p className='text-sm text-center'>
                        {t("service.stable_income")}
                    </p>
                    <div className="sync-box rounded-xl">
                        <div className="sync-s-03"></div>
                        <div className="sync-s-04"></div>
                    </div>
                </div>
            </div>
            <p className='mt-3 text-[rgba(255,255,255,0.8)] text-center'>
                {t("service.slogan")}
                <span>
                    {t("service.DEX")}
                </span>
                ,
                <span>
                    {t("service.IMO")}
                </span>
                {t("service.and")}
                <span>
                    {t("service.DAO")}
                </span>
            </p>
            <div className="title mt-5" style={{fontSize: "16px",color: "#fff"}}>{t("service.program_features")}</div>
            <div>
                <div className="w-full rounded-xl m-auto ser-row">
                    {
                        programList.map((item, index) => {
                            return (
                                <div 
                                    key={index} 
                                    className='flex flex-col w-full mt-5'
                                    style={{alignItems: "center"}}
                                >
                                    <Image
                                        width={185}
                                        height={114}
                                        src={item.icon}
                                        style={{height:"114px"}}
                                        alt=''
                                    />
                                    <div className='flex mt-3 flex-col'>
                                        <p className='text-sm text-center font-bold s-title' style={{color:index == 0 ? "#64B044" : (index == 1 ? "#B3FF0B" : "#54D3C9")}}>
                                            {item.title}
                                        </p>
                                        <p className='text-center text-[rgba(255,255,255,0.8)] text-xs mt-2'>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="title mt-5" style={{fontSize: "16px",color: "#fff"}}>{t("service.cooperation_platform")}</div>
            <div className="mt-3">
                <div className='grid grid-cols-3 gap-2'>
                    {
                        partnerList.map((item, index) => {
                            return <div key={index} className='flex justify-start p-2 rounded-[10px] bg-[rgba(255,255,255,0.1)] text-xs border border-[rgba(255,255,255,0.08)]'>
                                <Image
                                    width={24}
                                    height={24}
                                    src={item.icon}
                                    alt=''
                                    className='rounded-full'
                                />
                                <p className='my-auto ml-1'>
                                    {item.title}
                                </p>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="title mt-5">{t("index.fre_q")}</div> 
            <p className='my-5 text-[#e4e4e4] text-xs text-center'>
                {t("service.all_rights_reserved")}
            </p>
        </div>
    )
}
