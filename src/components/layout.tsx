"use client";
import React, { HTMLAttributes } from 'react'
import Header from './header';
import AppBar from './appbar';
import { usePathname } from 'next/navigation'
import Image from "next/image"
import BGIMG from "@images/bg.png"

interface ILayoutProps extends HTMLAttributes<HTMLDivElement> {
}

export default function Layout({ children }: ILayoutProps) {
    let pathName = usePathname()
    return (
        <div className='text-white bg-[#192832] max-h-screen max-screen-sm w-screen flex bg-cover bg-center h-screen' style={{ backgroundImage: `url(${BGIMG})`,height: "100vh" }}>
            <div className='w-full max-w-screen '>
                <Image
                    src={BGIMG}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                />
                {pathName != "/404" && <Header />}
                {children}
            </div>
        </div>
    )
}
