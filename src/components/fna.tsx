import React from 'react'
import ArrowIcon from "@images/icon/arrow-right.png"
import Image from 'next/image'
import { useTranslation } from "react-i18next"

export default function Fna() {
    const [openQIndex, setOpenQIndex] = React.useState<number | null>(null)
    const { t, i18n } = useTranslation()
    const qnaArr = [
        {
            q: t("index.fre_q_title01"),
            a: t("index.fre_q_con01")
        },
        {
            q: t("index.fre_q_title02"),
            a: t("index.fre_q_con02")
        },
        {
            q: t("index.fre_q_title03"),
            a: t("index.fre_q_con03")
        }

    ]
    return (
        <div className='rounded-xl mt-5 mb-5 cursor-pointer'>
            {/* <ul>
                {
                    qnaArr.map((item, index) => {
                        return (
                            <li key={index} className='mt-4 bg-[#24285B] rounded-xl p-2.5'
                                onClick={() => {
                                    if (openQIndex === index) {
                                        setOpenQIndex(null)
                                    } else {
                                        setOpenQIndex(index)
                                    }

                                }}
                            >
                                <div className='flex justify-between'>
                                    <p className='text-white w-[80%] flex-wrap'>{item.q}</p>
                                    <div>
                                        <Image
                                            src={ArrowIcon}
                                            width={18}
                                            height={18}
                                            alt=''
                                            className={`transform ${openQIndex ? 'rotate-90' : ''} ml-2`}
                                        />
                                    </div>
                                </div>
                                {
                                    openQIndex==index && <p className='text-[#fff] text-sm mt-2'>{item.a}</p>
                                }
                            </li>
                        )
                    })
                }
            </ul> */}
            <div className="list-box">
                {
                    qnaArr.map((item, index) => {
                        return (
                            <div className="list-row">
                                <div className="title-info">
                                    <div className="f-title">{item.q}</div>
                                    <Image
                                        src={ArrowIcon}
                                        width={20}
                                        height={20}
                                        alt=''
                                        className={`ml-2`}
                                    />
                                </div>
                                <div className="line mt-2 mb-2"></div>
                                <div className="info-content text-[rgba(255,255,255,0.6)]">
                                    {item.a}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
