import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../public/locales/en.json"
import cn from "../../public/locales/cn.json"
import fa from "../../public/locales/fa.json"
import ja from "../../public/locales/ja.json"
import de from "../../public/locales/de.json"
import kr from "../../public/locales/kr.json"
import sp from "../../public/locales/sp.json"
import po from "../../public/locales/po.json"
import la from "../../public/locales/la.json"


const resources = {
  en,
  cn,
  fa,
  ja,
  de,
  kr,
  sp,
  po,
  la
};
i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en', 
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

  export default i18n;