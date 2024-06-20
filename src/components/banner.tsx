import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from "next/image"
import Banner1 from "@images/banner/banner1.png"
import Banner2 from "@images/banner/banner2.png"
import Banner3 from "@images/banner/banner3.png"
import 'swiper/css';
import 'swiper/css/pagination';

export default function Banner() {
    return (
        <div className="">
            <Swiper
                slidesPerView={'auto'}
                centeredSlides={true}
                spaceBetween={30}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                className="mySwiper mt-4"
            >
                {/* <SwiperSlide className="!w-[300px] !h-[140px]">
                    <div className="rounded-xl w-[300px] h-[140px]" style={{borderRadius: "10px"}}>
                        <Image
                            src={Banner4}
                            width={300}
                            height={140}
                            alt=""
                            // className='rounded-xl'
                        />
                    </div>
                </SwiperSlide> */}
                <SwiperSlide className="!w-[308px] !h-[150px]">
                    <div className="rounded-xl w-[308px] h-[150px]" style={{borderRadius: "10px"}}>
                        <Image
                            src={Banner1}
                            width={308}
                            height={150}
                            alt=""
                            className='rounded-[10px]'
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide className="!w-[308px] !h-[150px]">
                    <div className="rounded-xl w-[308px] h-[150px]" style={{borderRadius: "10px"}}>
                        <Image
                            src={Banner2}
                            width={308}
                            height={150}
                            alt=""
                            className='rounded-[10px]'
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide className="!w-[308px] !h-[150px]">
                    <div className="rounded-xl w-[308px] h-[150px]" style={{borderRadius: "10px"}}>
                        <Image
                            src={Banner3}
                            width={308}
                            height={150}
                            alt=""
                            className='rounded-[10px]'
                        />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}
