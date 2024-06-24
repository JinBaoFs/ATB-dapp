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
            style={{width: "100vw",height: "100vh", zIndex: "9999",
                position: "fixed",top: "0",left: "0",display:"flex",
                flexDirection: "column",justifyContent:"center",alignItems: "center",
                background: "rgba(0,0,0,0.5)"
            }}
            onClick={(event)=>{event.stopPropagation();setMsgShow(false);reset()}}
        >
            <div className="flex-col rounded-[10px] w-[70%] sm:w-[800px] bg-[#131C20]">
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
                <div className="bg-[#017EFF]">确定</div>
            </div>
        </div>
    )
}