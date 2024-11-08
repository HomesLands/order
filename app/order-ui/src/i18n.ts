import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {},
      vi: {},
    },
    lng: window.localStorage.getItem("i18nextLng") || "vi",
    fallbackLng: "vi", // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false, // React đã tự động bảo vệ trước XSS
    },
    //Setup type-safe translation
    ns: [], //Dùng để phân biệt các phần khác nhau của app
    defaultNS: "auth", //Ngôn ngữ mặc định
  });

export default i18n;
