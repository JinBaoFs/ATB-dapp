import { useEffect,useState } from "react";
import Image from "next/image"
import SuccessIcon from "@images/icon/success.png"
import FailIcon from "@images/icon/fail.png"
import { useTranslation } from "react-i18next";

export default function MsgSuccess({isShow,title,status,msg,reset}:any){
    const [msgShow,setMsgShow] = useState(false)
    const { t } = useTranslation()
    useEffect(()=>{
        setMsgShow(isShow)
    },[isShow])
    return (
        msgShow &&
        <div 
            className=""
            style={{
                background:"rgba(0,0,0,0.5)",width: "100vw",height: "100vh", zIndex: "9999",
                position: "fixed",top: "0",left: "0",display:"flex",
                flexDirection: "column",justifyContent:"center",alignItems: "center"
            }}
            onClick={(event)=>{event.stopPropagation();setMsgShow(false);reset()}}
        >
            <div className="select-lang flex-col rounded-[10px] w-[20rem]" 
                style={{background: "linear-gradient( 180deg, #2D5751 0%, #2F4D32 100%)"}}
                onClick={(event)=>{event.stopPropagation()}}
            >
                <div className="text-[#22FFE0] p-2 px-3 flex" style={{justifyContent:"space-between"}}>
                    <span className="truncate w-auto mr-2">{ t("index.tips") }</span>
                    <span className="cursor-pointer text-[#fff]" style={{fontSize: "20px"}} onClick={(event)=>{ setMsgShow(false);reset() }}>×</span>
                </div>
                <div className="line"></div>
                <div className="text-[#fff] p-6 flex flex-col">
                    <Image
                        src={
                          status == "0" ? SuccessIcon : FailIcon
                        }
                        width={45}
                        height={45}
                        alt=""
                        className='m-auto mb-3'
                    />
                    <div className="text-center mb-5">{ msg }</div>
                </div>
            </div>
        </div>
    )
}