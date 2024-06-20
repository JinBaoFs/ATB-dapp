import { useAccount } from "wagmi";
import { getAuthNotic } from "@/server/user";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./notic.css"

export default function Notic(){
    const { address } = useAccount()
    const [noticList,setNoticList] = useState<any>([])
    const [tabIndex,setTabIndex] = useState(0)
    const [noticShow,setNoticShow] = useState(false)
    const { t } = useTranslation()
    let timerRef = useRef<any>(null);
    useEffect(()=>{
        getNoticList(address)
    },[address])

    const getNoticList = async(addr:any) => {
        let { data } = await getAuthNotic({ address: addr || ''})
        // filterNoticList(data?.bulletin || [])
        if(data.length){
            setNoticList(data)
            setNoticShow(true)
        }
    }

    const filterNoticList = (arr:any) => {
        const _time = new Date().getTime() / 1000
        let _resList:any = []
        arr.map((item:any)=>{
            if(_time >= item.startTime && (item.endTime ? _time <= item.endTime : true)){
                _resList.push(item)
            }
        })
        setNoticList(_resList)
        setNoticShow(true) 
    }

    //关闭操作
    const handleClose = () => {
        let index = tabIndex + 1
        console.log(index, noticList.length,'')
        if(index > noticList.length){
            return;
        }
        setNoticShow(false)
        setTabIndex(index)
        setTimeout(()=>{
            setNoticShow(true)
        },100)
    }

    // useEffect(()=>{
    //     let time = setTimeout(()=>{
    //         handleClose()
    //     },5100)
    //     return ()=>{
    //         clearTimeout(time)
    //     }
    // },[tabIndex,noticList])
    return(
        <>
            {
                noticList.length && tabIndex < noticList.length ?
                <div className="notic-box">
                    {
                        noticShow ?
                        <div className="notic-item">
                            {/* <div className="title"></div> */}
                            <div className="title-2">{t("index.notice")}</div>
                            <div className="line"></div>
                            <div className="content" dangerouslySetInnerHTML={{__html: noticList[tabIndex].content}}></div>
                            <div className="close" onClick={handleClose}>×</div>
                        </div> : null
                    }
                </div> : null
            }
        </>
        
    )
}