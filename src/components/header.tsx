import React, { HTMLAttributes, useEffect, useState, useMemo } from 'react'
import { useAccount } from 'wagmi'
import WallectButton from './wallet/connect'
import Image from "next/image";
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import LOCALEImg from "@images/locale/locale.png"
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
import LOGOIMG from "@images/logo.png"
import MENUIMG from "@images/menu.png"
import HOMEIMG from "@images/home.png"
import INCOMEIMG from "@images/income.png"
import MINEIMG from "@images/mine.png"
import "./header.css"

import { NextRouter } from 'next/router';
import { usePathname, useRouter, } from 'next/navigation';
import { shortenString } from '@/lib/utils';
import { useTranslation } from "react-i18next"
import { InvalidAbiItemError } from 'viem';

import { Box, Tabs, Tab, Drawer } from "@mui/material"
import { styled } from '@mui/material/styles';

interface IHeaderProps extends HTMLAttributes<HTMLDivElement> {
}

export default function Header({ }: IHeaderProps) {
    const pathname = usePathname()
    const { address } = useAccount()
    const { i18n,t } = useTranslation()
    const [ menuShow,setMenuShow ] = useState(false)
    const [ imgIndex, setImgIndex ] = useState(0)
    const [ open, setOpen ] = React.useState(false);
    const router = useRouter()

    useEffect(()=>{
        console.log(pathname)
        if (pathname === '/mine') {
            setValue(2)
        } else if (pathname === '/service') {
            setValue(1)
        } else {
            setValue(0)
        }
    },[pathname])

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
    
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
    ]

    useEffect(()=>{
        if (typeof localStorage !== 'undefined') {
            let lang = localStorage.getItem("lang") || 'cn'
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
        toPage(newValue)
    };

    const toPage = (newValue:number) => {
        setOpen(false)
        setValue(newValue)
        if(newValue == 0){
            router.push(`/`)
        }else if(newValue == 1){
            router.push(`/service`)
        }else if(newValue == 2){
            router.push(`/mine`)
        }
    }

    interface StyledTabsProps {
        children?: React.ReactNode;
        value: number;
        onChange: (event: React.SyntheticEvent, newValue: number) => void;
    }

    const StyledTabs = styled((props: StyledTabsProps) => (
        <Tabs
            {...props}
            TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        />
        ))({
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
        },
        '& .MuiTabs-indicatorSpan': {
            maxWidth: 40,
            width: '100%',
            backgroundColor: '#C52383',
        },
    });

    interface StyledTabProps { label: string }
      
    const StyledTab = styled((props: StyledTabProps) => (
        <Tab disableRipple {...props} />
    ))(({ theme }) => ({
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: '#fff',
        },
        '&.Mui-focusVisible': {
            backgroundColor: 'rgba(100, 95, 228, 0.32)',
        },
    }));

    return (
        <div className='bg-[#131C20] h-16 flex fixed top-0 left-0 justify-between w-full px-5' style={{zIndex: "100"}}>
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
                        onClick={toggleDrawer(true)}
                    />
                    <div className="hidden sm:flex">
                        <StyledTabs
                            value={value}
                            onChange={handleChange}
                            aria-label="styled tabs example"
                        >
                            <StyledTab label={t("index.home")} />
                            <StyledTab label={t("index.income")} />
                            <StyledTab label={t("index.mine")} />
                        </StyledTabs>
                    </div>
                </div>
                <div className='navbar-end flex justify-end gap-3'>
                <div className="dropdown dropdown-end flex justify-end">
                        <div tabIndex={0} className="rounded-[6px] flex p-[10px] justify-center text-right bg-[#E1146E]" style={{width: "40px",height: "40px"}} 
                        onClick={ (event)=>{ event.stopPropagation();setMenuShow(!menuShow) } }
                        >
                            <Image
                                src={LOCALEImg}
                                width={20}
                                height={20}
                                alt=''
                                className='rounded-full'
                            />
                        </div>
                        {
                            menuShow &&
                            <div style={{background:"rgba(0,0,0,0.5)",width: "100vw",height: "100vh",position: "fixed",top: "0",left: "0",display:"flex",flexDirection: "column",justifyContent:"center",alignItems: "center"}} onClick={ (event)=>{ event.stopPropagation();setMenuShow(!menuShow) } }>
                                <div className="select-lang flex-col w-[80%] sm:w-[50%] bg-[#131C20]" onClick={(event)=>{ event.stopPropagation() }}>
                                    <div className="text-[#fff] p-3 sm:p-5 flex" style={{justifyContent:"space-between"}}>
                                        <span>切换语言</span>
                                        <span className="text-white cursor-pointer" style={{fontSize: "20px"}} onClick={()=>{ setMenuShow(false) }}>×</span>
                                    </div>
                                    <div className="menu-list px-3 py-5 menu rounded shadow-lg shadow-black sm:w-auto flex flex-col"> 
                                        {
                                            localList.map((locale,index)=>{
                                                return (
                                                    <div key={locale.path} style={{background:imgIndex == index ? "#1D3D30" : "#1D3D30",border: "1px solid rgba(34,255,224,0.2)"}} className='p-2 py-3 my-2 rounded-[10px] cursor-pointer flex justify-between' onClick={()=>{ changeLanguage(locale) }}>
                                                        <div className="flex items-center">
                                                            <Image
                                                                src={locale.img}
                                                                width={20}
                                                                height={20}
                                                                alt=''
                                                                className='mr-2 my-auto'
                                                            />
                                                            <p className='w-24'>{locale.text}</p>
                                                        </div>
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
            <Drawer open={open} onClose={toggleDrawer(false)} className="z-0">
                <div className="w-[290px] bg-[rgb(22,30,33)] h-full">
                    <div className="nav-list">
                        <div className="nav-item" onClick={()=>{toPage(0)}}>
                            <Image
                                src={HOMEIMG}
                                width={20}
                                alt=''
                            />
                            <span className="text-xm">{t("index.home")}</span>
                        </div>
                        <div className="nav-item" onClick={()=>{toPage(1)}}>
                            <Image
                                src={INCOMEIMG}
                                width={20}
                                alt=''
                            />
                            <span className="text-xm">{t("index.income")}</span>
                        </div>
                        <div className="nav-item" onClick={()=>{toPage(2)}}>
                            <Image
                                src={MINEIMG}
                                width={20}
                                alt=''
                            />
                            <span className="text-xm">{t("index.mine_02")}</span>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}
