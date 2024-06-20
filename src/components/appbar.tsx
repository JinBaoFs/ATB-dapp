"use client";
import { usePathname } from 'next/navigation'
import React, { HTMLAttributes, useMemo } from 'react'
import Image from 'next/image'
import HomeImage from "@images/home_01.png"
import UnHomeImage from "@images/unhome_01.png"
import ServiceImage from "@images/service_01.png"
import UnServiceImage from "@images/unservice_01.png"
import MineImage from "@images/mine_01.png"
import UnMineImage from "@images/unmine_01.png"
import Link from 'next/link';
import { useTranslation } from "react-i18next"


interface IAppBarProps extends HTMLAttributes<HTMLDivElement> {

}

export default function AppBar({ }) {
    const { t, i18n } = useTranslation()
    const params = new URLSearchParams(window.location.search)
    const paramValue = params.get('c')
    const pathname = usePathname()
    const routerPath = useMemo(() => {
        console.log(pathname);
        
        if (pathname === '/mine' || pathname == '/mine/record') {
            return 'mine'
        } else if (pathname === '/service') {
            return 'service'
        } else {
            return "home"
        }
    }, [pathname])
    return (
        <div className='fixed bottom-0 left-0 w-full h-16 flex' 
            style={{background:"linear-gradient( 90deg, #303231 0%, #303F3B 100%)",borderRadius: "40px 40px 0px 0px"}}
        >
            <ul className='w-full m-auto flex justify-between px-5'>
                <Link href={`/?c=${paramValue}`} className='text-center'>
                    <Image
                        src={routerPath === 'home' ? HomeImage : UnHomeImage}
                        width={30}
                        height={30}
                        alt=''
                        className='m-auto'
                    />
                    <p className='mt-1 text-sm'>
                        {t("index.home")}
                    </p>
                </Link>
                <Link href={`/service?c=${paramValue}`} className='text-center'>
                    <Image
                        src={routerPath === 'service' ? ServiceImage : UnServiceImage}
                        width={30}
                        height={30}
                        alt=''
                        className='m-auto'
                    />
                    <p className='mt-1 text-sm'>
                        {t("index.service")}
                    </p>
                </Link>
                <Link href={`/mine?c=${paramValue}`} className='text-center'>
                    <Image
                        src={routerPath === 'mine' ? MineImage : UnMineImage}
                        width={30}
                        height={30}
                        alt=''
                        className='m-auto'
                    />
                    <p className='mt-1 text-sm'>
                        {t("index.mine")}
                    </p>
                </Link>
            </ul>
        </div>
    )
}
