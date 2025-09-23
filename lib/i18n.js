import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻译资源
const resources = {
  en: {
    translation: {
      "common": {
        "loading": "Loading...",
        "error": "Error",
        "success": "Success",
        "cancel": "Cancel",
        "confirm": "Confirm",
        "save": "Save",
        "edit": "Edit",
        "delete": "Delete",
        "search": "Search",
        "filter": "Filter",
        "view": "View",
        "back": "Back",
        "next": "Next",
        "previous": "Previous",
        "submit": "Submit",
        "reset": "Reset",
        "close": "Close",
        "yes": "Yes",
        "no": "No",
        "retry": "Retry",
        "page": "Page",
        "of": "of"
      },
      "navigation": {
        "home": "Home",
        "tours": "Tours",
        "attractions": "Attractions",
        "about": "About Us",
        "login": "Login",
        "register": "Register",
        "profile": "Profile",
        "admin": "Admin",
        "logout": "Logout",
        "myOrders": "My Orders",
        "adminDashboard": "Admin Dashboard",
        "manageUsers": "Manage Users",
        "manageTours": "Manage Tours",
        "manageAttractions": "Manage Attractions",
        "manageBookings": "Manage Bookings",
        "manageImages": "Manage Images",
        "reports": "Reports",
        "viewReports": "View Reports"
      },
      "home": {
        "title": "Welcome to Clever Tour",
        "subtitle": "Discover amazing destinations and create unforgettable memories",
        "exploreTours": "Explore Tours",
        "viewAttractions": "View Attractions",
        "popularDestinations": "Popular Destinations",
        "viewAllTours": "View All Tours",
        "loading": "Loading...",
        "noToursFound": "No tours found",
        "errorLoadingTours": "Error loading tours",
        "whyChooseUs": "Why Choose Us",
        "experienceDifference": "Experience the Difference",
        "bestTravelExperience": "We are committed to providing you with the best travel experience"
      },
      "features": {
        "expertGuides": "Expert Guides",
        "expertGuidesDesc": "Professional local guides with deep knowledge",
        "bestPrices": "Best Prices",
        "bestPricesDesc": "Competitive prices with no hidden fees",
        "quickBooking": "Quick Booking",
        "quickBookingDesc": "Easy and fast booking process",
        "securePayment": "Secure Payment",
        "securePaymentDesc": "Safe and reliable payment system",
        "customerSupport": "24/7 Support",
        "customerSupportDesc": "Round-the-clock customer service support"
      },
      "footer": {
        "copyright": "© 2025 Clever Tour. All rights reserved",
        "aboutUs": "About Us",
        "contactUs": "Contact Us",
        "termsOfService": "Terms of Service",
        "privacyPolicy": "Privacy Policy"
      },
      "auth": {
        "login": "Login",
        "register": "Register",
        "email": "Email",
        "password": "Password",
        "username": "Username",
        "confirmPassword": "Confirm Password",
        "emailPlaceholder": "Enter your email",
        "passwordPlaceholder": "Enter your password",
        "usernamePlaceholder": "Enter your username",
        "confirmPasswordPlaceholder": "Confirm your password",
        "emailRequired": "Email is required",
        "passwordRequired": "Password is required",
        "emailInvalid": "Please enter a valid email address",
        "loginFailed": "Login Failed",
        "noAccount": "Don't have an account?",
        "registerNow": "Register now",
        "haveAccount": "Already have an account?",
        "loginNow": "Login now",
        "passwordMismatch": "Password Mismatch",
        "passwordMismatchDesc": "Please make sure both passwords match"
      },
      "tours": {
        "title": "Tours",
        "metaDescription": "Discover amazing tours and travel experiences",
        "exploreTours": "Explore Tours",
        "discoverExperiences": "Discover amazing travel experiences",
        "searchPlaceholder": "Search tours...",
        "selectCategory": "Select Category",
        "selectDuration": "Select Duration",
        "all": "All",
        "citySightseeing": "City Sightseeing",
        "naturalLandscape": "Natural Landscape",
        "historicalCulture": "Historical Culture",
        "themePark": "Theme Park",
        "foodTour": "Food Tour",
        "shoppingTour": "Shopping Tour",
        "duration1to3": "1-3 Days",
        "duration4to7": "4-7 Days",
        "duration8plus": "8+ Days",
        "price": "Price",
        "rating": "Rating",
        "noToursFound": "No tours found"
      },
      "attractions": {
        "title": "Attractions",
        "metaDescription": "Explore amazing attractions and destinations",
        "exploreAttractions": "Explore Attractions",
        "discoverDestinations": "Discover amazing destinations",
        "searchPlaceholder": "Search attractions...",
        "selectCategory": "Select Category",
        "all": "All",
        "historical": "Historical",
        "natural": "Natural",
        "cultural": "Cultural",
        "entertainment": "Entertainment",
        "shopping": "Shopping",
        "dining": "Dining",
        "price": "Price",
        "rating": "Rating",
        "noAttractionsFound": "No attractions found"
      }
    }
  },
  zh: {
    translation: {
      "common": {
        "loading": "加载中...",
        "error": "错误",
        "success": "成功",
        "cancel": "取消",
        "confirm": "确认",
        "save": "保存",
        "edit": "编辑",
        "delete": "删除",
        "search": "搜索",
        "filter": "筛选",
        "view": "查看",
        "back": "返回",
        "next": "下一步",
        "previous": "上一步",
        "submit": "提交",
        "reset": "重置",
        "close": "关闭",
        "yes": "是",
        "no": "否",
        "retry": "重试",
        "page": "第",
        "of": "页，共"
      },
      "navigation": {
        "home": "首页",
        "tours": "旅游路线",
        "attractions": "景点",
        "about": "关于我们",
        "login": "登录",
        "register": "注册",
        "profile": "个人资料",
        "admin": "管理后台",
        "logout": "退出登录",
        "myOrders": "我的订单",
        "adminDashboard": "管理后台",
        "manageUsers": "用户管理",
        "manageTours": "旅游路线管理",
        "manageAttractions": "景点管理",
        "manageBookings": "预订管理",
        "manageImages": "图片管理",
        "reports": "报表",
        "viewReports": "查看报表"
      },
      "home": {
        "title": "欢迎来到智旅",
        "subtitle": "发现精彩目的地，创造难忘回忆",
        "exploreTours": "探索旅游路线",
        "viewAttractions": "查看景点",
        "popularDestinations": "热门目的地",
        "viewAllTours": "查看所有旅游路线",
        "loading": "加载中...",
        "noToursFound": "未找到旅游路线",
        "errorLoadingTours": "加载旅游路线时出错",
        "whyChooseUs": "为什么选择我们",
        "experienceDifference": "体验不同",
        "bestTravelExperience": "我们致力于为您提供最佳的旅游体验"
      },
      "features": {
        "expertGuides": "专业导游",
        "expertGuidesDesc": "经验丰富的当地导游",
        "bestPrices": "最优价格",
        "bestPricesDesc": "具有竞争力的价格，无隐藏费用",
        "quickBooking": "快速预订",
        "quickBookingDesc": "简单快速的预订流程",
        "securePayment": "安全支付",
        "securePaymentDesc": "安全可靠的支付系统",
        "customerSupport": "24/7客服",
        "customerSupportDesc": "全天候客户服务支持"
      },
      "footer": {
        "copyright": "© 2025 智旅. 保留所有权利",
        "aboutUs": "关于我们",
        "contactUs": "联系我们",
        "termsOfService": "服务条款",
        "privacyPolicy": "隐私政策"
      },
      "auth": {
        "login": "登录",
        "register": "注册",
        "email": "邮箱",
        "password": "密码",
        "username": "用户名",
        "confirmPassword": "确认密码",
        "emailPlaceholder": "请输入您的邮箱",
        "passwordPlaceholder": "请输入您的密码",
        "usernamePlaceholder": "请输入您的用户名",
        "confirmPasswordPlaceholder": "请再次输入密码",
        "emailRequired": "邮箱是必填项",
        "passwordRequired": "密码是必填项",
        "emailInvalid": "请输入有效的邮箱地址",
        "loginFailed": "登录失败",
        "noAccount": "还没有账户？",
        "registerNow": "立即注册",
        "haveAccount": "已有账户？",
        "loginNow": "立即登录",
        "passwordMismatch": "密码不匹配",
        "passwordMismatchDesc": "请确保两次输入的密码一致"
      },
      "tours": {
        "title": "旅游路线",
        "metaDescription": "发现精彩的旅游路线和旅行体验",
        "exploreTours": "探索旅游路线",
        "discoverExperiences": "发现精彩的旅行体验",
        "searchPlaceholder": "搜索旅游路线...",
        "selectCategory": "选择分类",
        "selectDuration": "选择时长",
        "all": "全部",
        "citySightseeing": "城市观光",
        "naturalLandscape": "自然风光",
        "historicalCulture": "历史文化",
        "themePark": "主题公园",
        "foodTour": "美食之旅",
        "shoppingTour": "购物之旅",
        "duration1to3": "1-3天",
        "duration4to7": "4-7天",
        "duration8plus": "8天以上",
        "price": "价格",
        "rating": "评分",
        "noToursFound": "未找到旅游路线"
      },
      "attractions": {
        "title": "景点",
        "metaDescription": "探索精彩的景点和目的地",
        "exploreAttractions": "探索景点",
        "discoverDestinations": "发现精彩目的地",
        "searchPlaceholder": "搜索景点...",
        "selectCategory": "选择分类",
        "all": "全部",
        "historical": "历史古迹",
        "natural": "自然风光",
        "cultural": "文化景点",
        "entertainment": "娱乐场所",
        "shopping": "购物中心",
        "dining": "美食餐厅",
        "price": "价格",
        "rating": "评分",
        "noAttractionsFound": "未找到景点"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
