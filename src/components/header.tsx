import React, { HTMLAttributes, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import WallectButton from './wallet/connect'
import Image from "next/image";
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import CNImg from "@images/locale/cn.png"
import ENImg from "@images/locale/en.png"
import JPImg from "@images/locale/jp.png"
import KRImg from "@images/locale/kr.png"
import FAImg from "@images/locale/fa.png"
import DEImg from "@images/locale/ge.png"
import SPImg from "@images/locale/sp.png"
import POImg from "@images/locale/po.png"
import LAImg from "@images/locale/la.png"
import SELECTImg from "@images/select.png"
import CLOSEImg from "@images/close.png"
import LOGOIMG from "@images/logo.png"
import MENUIMG from "@images/menu.png"
import "./header.css"

import { NextRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { shortenString } from '@/lib/utils';
import { useTranslation } from "react-i18next"
import { InvalidAbiItemError } from 'viem';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface IHeaderProps extends HTMLAttributes<HTMLDivElement> {
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function Header({ }: IHeaderProps) {
    const pathname = usePathname()
    const { address } = useAccount()
    const { i18n } = useTranslation()
    const [ menuShow,setMenuShow ] = useState(false)
    const [ imgIndex, setImgIndex ] = useState(0)
    
    const localList = [
        {
            path: "en",
            img: ENImg,
            text: "English"
        },
        {
            path: "cn",
            img: CNImg,
            text: "中文"
        },
        {
            path: "ja",
            img: JPImg,
            text: "日本語"
        },
        {
            path: "fa",
            img: FAImg,
            text: "Français"
        },
        {
            path: "de",
            img: DEImg,
            text: "Deutsch"
        },
        {
             path: "kr",
             img: KRImg,
             text: "한국인"
        },
        {
            path: "sp",
            img: SPImg,
            text: "Español"
       },
       {
            path: "po",
            img: POImg,
            text: "Português"
        },
        {
            path: "la",
            img: LAImg,
            text: "عربي"
        },
    ]

    useEffect(()=>{
        if (typeof localStorage !== 'undefined') {
            let lang = localStorage.getItem("lang") || 'en'
            i18n.changeLanguage(lang)
        }
    },[])
    useEffect(() => {
        localList.map((item,index)=>{
            if(item.path == i18n.language){
                setImgIndex(index)
            }
        })
    }, [i18n.language])

    const changeLanguage = (locale:any) => {
        i18n.changeLanguage(locale.path)
        if(typeof localStorage !== 'undefined'){
            localStorage.setItem("lang",locale.path)
        }
        setMenuShow(false)
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className='bg-[rgba(25,41,46)] sm:bg-transparent h-16 flex fixed top-0 left-0 justify-between w-full px-5 z-50'>
            <div className='m-auto navbar flex justify-between'>
                <div 
                    className='p-1 navbar-start w-fit rounded flex px-2'
                    style={{color: "#fff", height: "35px",lineHeight: "35px"}}
                >
                    <Image
                        src={LOGOIMG}
                        width={24}
                        height={30}
                        alt=''
                        className="mr-[6px]"
                    />
                    <Image
                        src={MENUIMG}
                        width={18}
                        height={18}
                        alt=''
                        className="sm:hidden"
                    />
                    <div className="hidden sm:flex">
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{
                            '& .MuiTab-root': {
                                color: '#fff',  // 设置选项卡文字颜色
                            },
                            '& .Mui-selected': {
                                color: '#fff',  // 设置选中选项卡文字颜色
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#C52383',  // 设置选中指示器的颜色
                            },
                            '& .MuiTabs-indicatorSpan': {
                                maxWidth: 40,
                                width: '100%',
                                backgroundColor: '#635ee7',
                            },
                        }}>
                            <Tab label="首页" {...a11yProps(0)} />
                            <Tab label="收益" {...a11yProps(1)} />
                            <Tab label="我的ATB" {...a11yProps(2)} />
                        </Tabs>
                    </div>
                </div>
                <div className='navbar-end flex justify-end gap-3'>
                <div className="dropdown dropdown-end flex justify-end">
                        <div tabIndex={0} className="rounded-[6px] flex p-[10px] justify-center text-right bg-[#FFFFFF26]" style={{width: "40px",height: "40px"}} onClick={ (event)=>{ event.stopPropagation();setMenuShow(!menuShow) } }>
                            <Image
                                src={localList[imgIndex].img}
                                width={20}
                                height={20}
                                alt=''
                                className='rounded-full'
                            />
                        </div>
                        {
                            menuShow &&
                            <div style={{background:"rgba(0,0,0,0.5)",width: "100vw",height: "100vh",position: "fixed",top: "0",left: "0",display:"flex",flexDirection: "column",justifyContent:"center",alignItems: "center"}} onClick={ (event)=>{ event.stopPropagation();setMenuShow(!menuShow) } }>
                                <div className="select-lang flex-col w-[20rem]" onClick={(event)=>{ event.stopPropagation() }}>
                                    <div className="text-[#22FFE0] p-2 px-3 flex" style={{justifyContent:"space-between"}}>
                                        <span>Select Language</span>
                                        <span className="text-white" style={{fontSize: "20px"}} onClick={()=>{ setMenuShow(false) }}>×</span>
                                    </div>
                                    <div className="line"></div>
                                    <div className="menu-list px-3 py-5 menu rounded shadow-lg shadow-black sm:w-auto" style={{display: "flex",flexWrap: "wrap",justifyContent: "space-between",flexDirection: "row",}}> 
                                        {
                                            localList.map((locale,index)=>{
                                                return (
                                                    <div key={locale.path} style={{background:imgIndex == index ? "#1D3D30" : "#1D3D30",border: "1px solid rgba(34,255,224,0.2)"}} className='p-2 py-3 my-2 rounded-[10px] cursor-pointer flex justify-start w-[130px]' onClick={()=>{ changeLanguage(locale) }}>
                                                        <Image
                                                            src={locale.img}
                                                            width={20}
                                                            height={20}
                                                            alt=''
                                                            className='mr-2 my-auto'
                                                        />
                                                        <p className='w-24'>
                                                            {locale.text}
                                                        </p>
                                                        {
                                                            imgIndex == index && 
                                                            <Image
                                                                src={SELECTImg}
                                                                width={16}
                                                                height={16}
                                                                alt=''
                                                                className='mr-2 my-auto'
                                                            />
                                                        }
                                                        
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    {
                        !address ? <WallectButton /> : <ConnectButton accountStatus={{
                            smallScreen: 'avatar',
                            largeScreen: 'full',
                          }} showBalance={false} />
                    }
                    
                </div>
            </div>
        </div>
    )
}
