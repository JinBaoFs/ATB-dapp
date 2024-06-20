"use client";
import React, { HTMLAttributes } from 'react'
import Header from './header';
import AppBar from './appbar';
import { usePathname } from 'next/navigation'


interface ILayoutProps extends HTMLAttributes<HTMLDivElement> {
}

export default function Layout({ children }: ILayoutProps) {
    let pathName = usePathname()
    return (
        <div className='py-16 text-white bg-[#191B1A] max-screen-sm w-screen flex'>
            <div className='w-full max-w-screen '>
                {pathName != "/404" && <Header />}
                {children}
                {pathName != "/404" && <AppBar />}
            </div>
        </div>
    )
}
