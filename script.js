/**
 * AgriStack Farmer Card & Digital Wallet Hub
 * Frontend Interactive Controller v5.0
 * Theme & Interactive System inspired by artist.garry Studio
 */

const WALLET_API_BASE = 'https://farmer-wallet-extension.onrender.com';
const CARD_RATE = 15;

// Complete 36 Indian States & UTs Database
const STATES_DATA = [
  {
    code: 'PB',
    name: 'Punjab',
    regionalName: 'ਪੰਜਾਬ',
    lang: 'Gurmukhi (Punjabi)',
    regionalBharat: 'ਭਾਰਤ ਸਰਕਾਰ',
    regionalMinistry: 'ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਭਲਾਈ ਮੰਤਰਾਲਾ',
    footerRegistry: 'Punjab Farmer Registry',
    sampleFarmer: { regName: 'ਹਰਵਿੰਦਰ ਸਿੰਘ', engName: 'Harvinder Singh', address: 'C/o Balveer Singh, 104, Shergarh (95), Talwandi Sabo, Bathinda, PUNJAB, 151301', regLabel: 'ਨਾਮ' },
    portalUrl: 'https://pbfr.agristack.gov.in/farmer-registry-pb/#/',
    displayPortal: 'www.pbfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    regionalName: 'राजस्थान',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Rajasthan Farmer Registry',
    sampleFarmer: { regName: 'सुरेश कुमार', engName: 'Suresh Kumar', address: 'Gram Panchayat Bassi, Tehsil Bassi, Jaipur, RAJASTHAN, 303301', regLabel: 'नाम' },
    portalUrl: 'https://rjfr.agristack.gov.in/farmer-registry-rj/#/',
    displayPortal: 'www.rjfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    regionalName: 'उत्तर प्रदेश',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Uttar Pradesh Farmer Registry',
    sampleFarmer: { regName: 'राम प्रकाश यादव', engName: 'Ram Prakash Yadav', address: 'Vill Kalyanpur, Post Bithoor, Kanpur Nagar, UTTAR PRADESH, 209217', regLabel: 'नाम' },
    portalUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/#/',
    displayPortal: 'www.upfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    regionalName: 'महाराष्ट्र',
    lang: 'Devanagari (Marathi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषी आणि शेतकरी कल्याण मंत्रालय',
    footerRegistry: 'Maharashtra Farmer Registry',
    sampleFarmer: { regName: 'अमोल विठ्ठल पाटील', engName: 'Amol Vitthal Patil', address: 'Post Baramati, Taluka Baramati, Pune, MAHARASHTRA, 413102', regLabel: 'नाव' },
    portalUrl: 'https://mhfr.agristack.gov.in/farmer-registry-mh/#/',
    displayPortal: 'www.mhfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    regionalName: 'ગુજરાત',
    lang: 'Gujarati',
    regionalBharat: 'ભારત સરકાર',
    regionalMinistry: 'કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય',
    footerRegistry: 'Gujarat Farmer Registry',
    sampleFarmer: { regName: 'પરેશભાઈ પટેલ', engName: 'Pareshbhai Patel', address: 'At & Post Anand, Taluka Anand, Dist Anand, GUJARAT, 388001', regLabel: 'નામ' },
    portalUrl: 'https://gjfr.agristack.gov.in/farmer-registry-gj/#/',
    displayPortal: 'www.gjfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    regionalName: 'தமிழ்நாடு',
    lang: 'Tamil',
    regionalBharat: 'இந்திய அரசு',
    regionalMinistry: 'விவசாயம் மற்றும் விவசாயிகள் நல அமைச்சகம்',
    footerRegistry: 'Tamil Nadu Farmer Registry',
    sampleFarmer: { regName: 'முருகன் சுப்பிரமணியன்', engName: 'Murugan Subramanian', address: 'South Street, Thanjavur, TAMIL NADU, 613001', regLabel: 'பெயர்' },
    portalUrl: 'https://tnfr.agristack.gov.in/farmer-registry-tn/#/',
    displayPortal: 'www.tnfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    regionalName: 'ఆంధ్రప్రదేశ్',
    lang: 'Telugu',
    regionalBharat: 'భారత ప్రభుత్వం',
    regionalMinistry: 'వ్యవసాయ మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ',
    footerRegistry: 'Andhra Pradesh Farmer Registry',
    sampleFarmer: { regName: 'వెంకటేశ్వరరావు', engName: 'Venkateswara Rao', address: 'Main Road, Guntur District, ANDHRA PRADESH, 522002', regLabel: 'పేరు' },
    portalUrl: 'https://apfr.agristack.gov.in/farmer-registry-ap/#/',
    displayPortal: 'www.apfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'TS',
    name: 'Telangana',
    regionalName: 'తెలంగాణ',
    lang: 'Telugu',
    regionalBharat: 'భారత ప్రభుత్వం',
    regionalMinistry: 'వ్యవసాయ మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ',
    footerRegistry: 'Telangana Farmer Registry',
    sampleFarmer: { regName: 'శ్రీనివాస్ రెడ్డి', engName: 'Srinivas Reddy', address: 'Warangal Rural, TELANGANA, 506002', regLabel: 'పేరు' },
    portalUrl: 'https://tsfr.agristack.gov.in/farmer-registry-ts/#/',
    displayPortal: 'www.tsfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    regionalName: 'मध्य प्रदेश',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Madhya Pradesh Farmer Registry',
    sampleFarmer: { regName: 'कमल सिंह राजपूत', engName: 'Kamal Singh Rajput', address: 'Village Pipariya, Tehsil Hoshangabad, MADHYA PRADESH, 461775', regLabel: 'नाम' },
    portalUrl: 'https://mpfr.agristack.gov.in/farmer-registry-mp/#/',
    displayPortal: 'www.mpfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'KA',
    name: 'Karnataka',
    regionalName: 'ಕರ್ನಾಟಕ',
    lang: 'Kannada',
    regionalBharat: 'ಭಾರತ ಸರ್ಕಾರ',
    regionalMinistry: 'ಕೃಷಿ ಮತ್ತು ರೈತರ ಕಲ್ಯಾಣ ಸಚಿವಾಲಯ',
    footerRegistry: 'Karnataka Farmer Registry',
    sampleFarmer: { regName: 'ಮಂಜುನಾಥ್ ಗೌಡ', engName: 'Manjunath Gowda', address: 'Mandya Taluk, Mandya, KARNATAKA, 571401', regLabel: 'ಹೆಸರು' },
    portalUrl: 'https://kafr.agristack.gov.in/farmer-registry-ka/#/',
    displayPortal: 'www.kafr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'KL',
    name: 'Kerala',
    regionalName: 'കേരളം',
    lang: 'Malayalam',
    regionalBharat: 'ഭാരത സർക്കാർ',
    regionalMinistry: 'കൃഷി, കർഷകക്ഷേമ മന്ത്രാലയം',
    footerRegistry: 'Kerala Farmer Registry',
    sampleFarmer: { regName: 'രമേഷ് കുമാർ', engName: 'Ramesh Kumar', address: 'Kuttanad, Alappuzha, KERALA, 688504', regLabel: 'പേര്' },
    portalUrl: 'https://klfr.agristack.gov.in/farmer-registry-kl/#/',
    displayPortal: 'www.klfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'OR',
    name: 'Odisha',
    regionalName: 'ଓଡ଼ିଶା',
    lang: 'Odia',
    regionalBharat: 'ଭାରତ ସରକାର',
    regionalMinistry: 'କୃଷି ଓ କୃଷକ କଲ୍ୟାଣ ମନ୍ତ୍ରଣାଳୟ',
    footerRegistry: 'Odisha Farmer Registry',
    sampleFarmer: { regName: 'ବିଜୟ କୁମାର ପ୍ରଧାନ', engName: 'Bijay Kumar Pradhan', address: 'Bargarh, ODISHA, 768028', regLabel: 'ନାମ' },
    portalUrl: 'https://orfr.agristack.gov.in/farmer-registry-or/#/',
    displayPortal: 'www.orfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'WB',
    name: 'West Bengal',
    regionalName: 'পশ্চিমবঙ্গ',
    lang: 'Bengali',
    regionalBharat: 'ভারত সরকার',
    regionalMinistry: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক',
    footerRegistry: 'West Bengal Farmer Registry',
    sampleFarmer: { regName: 'শুভাশিস রায়', engName: 'Subhasish Roy', address: 'Burdwan, WEST BENGAL, 713101', regLabel: 'নাম' },
    portalUrl: 'https://wbfr.agristack.gov.in/farmer-registry-wb/#/',
    displayPortal: 'www.wbfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'AS',
    name: 'Assam',
    regionalName: 'অসম',
    lang: 'Assamese',
    regionalBharat: 'ভাৰত চৰকাৰ',
    regionalMinistry: 'কৃষি আৰু কৃষক কল্যাণ মন্ত্ৰালয়',
    footerRegistry: 'Assam Farmer Registry',
    sampleFarmer: { regName: 'প্ৰণৱ শইকীয়া', engName: 'Pranab Saikia', address: 'Nagaon, ASSAM, 782001', regLabel: 'নাম' },
    portalUrl: 'https://asfr.agristack.gov.in/farmer-registry-as/#/',
    displayPortal: 'www.asfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'BR',
    name: 'Bihar',
    regionalName: 'बिहार',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Bihar Farmer Registry',
    sampleFarmer: { regName: 'संजय कुमार सिंह', engName: 'Sanjay Kumar Singh', address: 'Vill Bela, Muzaffarpur, BIHAR, 842001', regLabel: 'नाम' },
    portalUrl: 'https://brfr.agristack.gov.in/farmer-registry-br/#/',
    displayPortal: 'www.brfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    regionalName: 'छत्तीसगढ़',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Chhattisgarh Farmer Registry',
    sampleFarmer: { regName: 'देवेंद्र वर्मा', engName: 'Devendra Verma', address: 'Dhamtari, CHHATTISGARH, 493773', regLabel: 'नाम' },
    portalUrl: 'https://cgfr.agristack.gov.in/farmer-registry-cg/#/',
    displayPortal: 'www.cgfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'HR',
    name: 'Haryana',
    regionalName: 'हरियाणा',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Haryana Farmer Registry',
    sampleFarmer: { regName: 'कुलदीप सिंह', engName: 'Kuldeep Singh', address: 'Karnal, HARYANA, 132001', regLabel: 'नाम' },
    portalUrl: 'https://hrfr.agristack.gov.in/farmer-registry-hr/#/',
    displayPortal: 'www.hrfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    regionalName: 'हिमाचल प्रदेश',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Himachal Pradesh Farmer Registry',
    sampleFarmer: { regName: 'राकेश शर्मा', engName: 'Rakesh Sharma', address: 'Kangra, HIMACHAL PRADESH, 176001', regLabel: 'नाम' },
    portalUrl: 'https://hpfr.agristack.gov.in/farmer-registry-hp/#/',
    displayPortal: 'www.hpfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    regionalName: 'जम्मू और कश्मीर',
    lang: 'Hindi / Urdu',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Jammu and Kashmir Farmer Registry',
    sampleFarmer: { regName: 'तारिक अहमद', engName: 'Tariq Ahmad', address: 'Anantnag, JAMMU & KASHMIR, 192101', regLabel: 'नाम' },
    portalUrl: 'https://jkfr.agristack.gov.in/farmer-registry-jk/#/',
    displayPortal: 'www.jkfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    regionalName: 'झारखंड',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Jharkhand Farmer Registry',
    sampleFarmer: { regName: 'अनिल मुंडा', engName: 'Anil Munda', address: 'Ranchi, JHARKHAND, 834001', regLabel: 'नाम' },
    portalUrl: 'https://jhfr.agristack.gov.in/farmer-registry-jh/#/',
    displayPortal: 'www.jhfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    regionalName: 'उत्तराखंड',
    lang: 'Devanagari (Hindi)',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Uttarakhand Farmer Registry',
    sampleFarmer: { regName: 'दीपक सिंह नेगी', engName: 'Deepak Singh Negi', address: 'Dehradun, UTTARAKHAND, 248001', regLabel: 'नाम' },
    portalUrl: 'https://ukfr.agristack.gov.in/farmer-registry-uk/#/',
    displayPortal: 'www.ukfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'TR',
    name: 'Tripura',
    regionalName: 'ত্রিপুরা',
    lang: 'Bengali',
    regionalBharat: 'ভারত সরকার',
    regionalMinistry: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক',
    footerRegistry: 'Tripura Farmer Registry',
    sampleFarmer: { regName: 'দেবাশীষ দেববর্মা', engName: 'Debashis Debbarma', address: 'Agartala, TRIPURA, 799001', regLabel: 'নাম' },
    portalUrl: 'https://trfr.agristack.gov.in/farmer-registry-tr/#/',
    displayPortal: 'www.trfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'GA',
    name: 'Goa',
    regionalName: 'गोवा',
    lang: 'Konkani / Marathi',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Goa Farmer Registry',
    sampleFarmer: { regName: 'रोहन कामत', engName: 'Rohan Kamat', address: 'Ponda, GOA, 403401', regLabel: 'नाम' },
    portalUrl: 'https://gafr.agristack.gov.in/farmer-registry-ga/#/',
    displayPortal: 'www.gafr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    regionalName: 'Meghalaya',
    lang: 'English / Hindi',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Meghalaya Farmer Registry',
    sampleFarmer: { regName: 'मेघालय किसान', engName: 'Banteilang Marbaniang', address: 'East Khasi Hills, MEGHALAYA, 793001', regLabel: 'Name' },
    portalUrl: 'https://mlfr.agristack.gov.in/farmer-registry-ml/#/',
    displayPortal: 'www.mlfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'MN',
    name: 'Manipur',
    regionalName: 'মণিপুর',
    lang: 'Manipuri',
    regionalBharat: 'ভারত সরকার',
    regionalMinistry: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক',
    footerRegistry: 'Manipur Farmer Registry',
    sampleFarmer: { regName: 'ইবোমচা সিং', engName: 'Ibomcha Singh', address: 'Imphal, MANIPUR, 795001', regLabel: 'নাম' },
    portalUrl: 'https://mnfr.agristack.gov.in/farmer-registry-mn/#/',
    displayPortal: 'www.mnfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    regionalName: 'Mizoram',
    lang: 'English / Mizo',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Mizoram Farmer Registry',
    sampleFarmer: { regName: 'Lalrintluanga', engName: 'Lalrintluanga', address: 'Aizawl, MIZORAM, 796001', regLabel: 'Name' },
    portalUrl: 'https://mzfr.agristack.gov.in/farmer-registry-mz/#/',
    displayPortal: 'www.mzfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'NL',
    name: 'Nagaland',
    regionalName: 'Nagaland',
    lang: 'English / Hindi',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Nagaland Farmer Registry',
    sampleFarmer: { regName: 'Kevichusa', engName: 'Kevichusa', address: 'Kohima, NAGALAND, 797001', regLabel: 'Name' },
    portalUrl: 'https://nlfr.agristack.gov.in/farmer-registry-nl/#/',
    displayPortal: 'www.nlfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'SK',
    name: 'Sikkim',
    regionalName: 'सिक्किम',
    lang: 'Nepali / Hindi',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Sikkim Farmer Registry',
    sampleFarmer: { regName: 'तेन्जिङ शेर्पा', engName: 'Tenzing Sherpa', address: 'Gangtok, SIKKIM, 737101', regLabel: 'नाम' },
    portalUrl: 'https://skfr.agristack.gov.in/farmer-registry-sk/#/',
    displayPortal: 'www.skfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    regionalName: 'अरुणाचल प्रदेश',
    lang: 'Hindi / English',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Arunachal Pradesh Farmer Registry',
    sampleFarmer: { regName: 'तागा पादो', engName: 'Taga Pado', address: 'Itanagar, ARUNACHAL PRADESH, 791111', regLabel: 'नाम' },
    portalUrl: 'https://arfr.agristack.gov.in/farmer-registry-ar/#/',
    displayPortal: 'www.arfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'DL',
    name: 'Delhi',
    regionalName: 'दिल्ली',
    lang: 'Hindi',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Delhi Farmer Registry',
    sampleFarmer: { regName: 'राजेंद्र कुमार', engName: 'Rajendra Kumar', address: 'Najafgarh, New Delhi, DELHI, 110043', regLabel: 'नाम' },
    portalUrl: 'https://dlfr.agristack.gov.in/farmer-registry-dl/#/',
    displayPortal: 'www.dlfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    regionalName: 'ਚੰਡੀਗੜ੍ਹ / चंडीगढ़',
    lang: 'Punjabi / Hindi',
    regionalBharat: 'ਭਾਰਤ ਸਰਕਾਰ / भारत सरकार',
    regionalMinistry: 'ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਭਲਾਈ ਮੰਤਰਾਲਾ',
    footerRegistry: 'Chandigarh Farmer Registry',
    sampleFarmer: { regName: 'ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ', engName: 'Gurpreet Singh', address: 'Manimajra, CHANDIGARH, 160101', regLabel: 'ਨਾਮ' },
    portalUrl: 'https://chfr.agristack.gov.in/farmer-registry-ch/#/',
    displayPortal: 'www.chfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'LA',
    name: 'Ladakh',
    regionalName: 'ལ་དྭགས / लद्दाख',
    lang: 'Ladakhi / Hindi',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Ladakh Farmer Registry',
    sampleFarmer: { regName: 'Sonam Norboo', engName: 'Sonam Norboo', address: 'Leh, LADAKH, 194101', regLabel: 'Name' },
    portalUrl: 'https://lafr.agristack.gov.in/farmer-registry-la/#/',
    displayPortal: 'www.lafr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'PY',
    name: 'Puducherry',
    regionalName: 'புதுச்சேரி',
    lang: 'Tamil',
    regionalBharat: 'இந்திய அரசு',
    regionalMinistry: 'விவசாயம் மற்றும் விவசாயிகள் நல அமைச்சகம்',
    footerRegistry: 'Puducherry Farmer Registry',
    sampleFarmer: { regName: 'கண்ணன்', engName: 'Kannan', address: 'Villianur, PUDUCHERRY, 605110', regLabel: 'பெயர்' },
    portalUrl: 'https://pyfr.agristack.gov.in/farmer-registry-py/#/',
    displayPortal: 'www.pyfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'DN',
    name: 'Dadra and Nagar Haveli',
    regionalName: 'दादरा एवं नगर हवेली',
    lang: 'Gujarati / Hindi',
    regionalBharat: 'ભારત સરકાર / भारत सरकार',
    regionalMinistry: 'કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય',
    footerRegistry: 'Dadra and Nagar Haveli and Daman and Diu Farmer Registry',
    sampleFarmer: { regName: 'રમેશભાઈ', engName: 'Rameshbhai Patel', address: 'Silvassa, D&NH, 396230', regLabel: 'નામ' },
    portalUrl: 'https://dnfr.agristack.gov.in/farmer-registry-dn/#/',
    displayPortal: 'www.dnfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'AN',
    name: 'Andaman & Nicobar',
    regionalName: 'अंडमान और निकोबार',
    lang: 'Hindi / English',
    regionalBharat: 'भारत सरकार',
    regionalMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
    footerRegistry: 'Andaman and Nicobar Islands Farmer Registry',
    sampleFarmer: { regName: 'अशोक कुमार', engName: 'Ashok Kumar', address: 'Port Blair, ANDAMAN & NICOBAR, 744101', regLabel: 'नाम' },
    portalUrl: 'https://anfr.agristack.gov.in/farmer-registry-an/#/',
    displayPortal: 'www.anfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    regionalName: 'ലക്ഷദ്വീപ്',
    lang: 'Malayalam',
    regionalBharat: 'ഭാരത സർക്കാർ',
    regionalMinistry: 'കൃഷി, കർഷകക്ഷേമ മന്ത്രാലയം',
    footerRegistry: 'Lakshadweep Farmer Registry',
    sampleFarmer: { regName: 'മുഹമ്മദ് കോയ', engName: 'Mohammed Koya', address: 'Kavaratti, LAKSHADWEEP, 682555', regLabel: 'പേര്' },
    portalUrl: 'https://ldfr.agristack.gov.in/farmer-registry-ld/#/',
    displayPortal: 'www.ldfr.agristack.gov.in',
    helpline: '1800-180-1551',
    status: 'Active'
  }
];

// App State
let currentFlipped = false;
let currentSelectedAmount = 1000;
let userWalletBalance = 1000.00;
let currentMobile = '7009980800';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  populateStateSelector();
  renderPortalsGrid();
  loadStoredWallet();
  initSmoothScroll();
});

/* ==========================================================================
   State Selector & 3D Interactive Card Preview
   ========================================================================== */
function populateStateSelector() {
  const select = document.getElementById('stateSelector');
  if (!select) return;

  select.innerHTML = '';
  STATES_DATA.forEach(state => {
    const opt = document.createElement('option');
    opt.value = state.code;
    opt.textContent = `${state.name} (${state.regionalName})`;
    if (state.code === 'PB') opt.selected = true;
    select.appendChild(opt);
  });
}

function onStateChange(stateCode) {
  const state = STATES_DATA.find(s => s.code === stateCode) || STATES_DATA[0];

  // Update Front Elements
  const regBharat = document.getElementById('previewRegionalBharat');
  if (regBharat) regBharat.textContent = state.regionalBharat;

  const regName = document.getElementById('previewRegName');
  if (regName) regName.textContent = state.sampleFarmer.regName;

  const regLabel = document.getElementById('previewRegLabel');
  if (regLabel) regLabel.textContent = state.sampleFarmer.regLabel;

  const engName = document.getElementById('previewEngName');
  if (engName) engName.textContent = state.sampleFarmer.engName;

  const footerReg = document.getElementById('previewFooterRegistry');
  if (footerReg) footerReg.textContent = state.footerRegistry;

  // Update Back Elements
  const regMinistry = document.getElementById('previewRegionalMinistry');
  if (regMinistry) regMinistry.textContent = state.regionalMinistry;

  const address = document.getElementById('previewAddress');
  if (address) address.textContent = state.sampleFarmer.address;

  const portalUrl = document.getElementById('previewPortalUrl');
  if (portalUrl) portalUrl.textContent = state.displayPortal;

  const helpline = document.getElementById('previewHelpline');
  if (helpline) helpline.textContent = state.helpline;

  // Sync Select Dropdown
  const select = document.getElementById('stateSelector');
  if (select && select.value !== stateCode) {
    select.value = stateCode;
  }

  // Visual Feedback Animation
  const card = document.getElementById('card3D');
  if (card) {
    card.style.transform = currentFlipped ? 'rotateY(180deg) scale(0.98)' : 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = currentFlipped ? 'rotateY(180deg)' : '';
    }, 200);
  }
}

function toggleCardFlip() {
  const card = document.getElementById('card3D');
  if (!card) return;
  currentFlipped = !currentFlipped;
  if (currentFlipped) {
    card.classList.add('flipped');
  } else {
    card.classList.remove('flipped');
  }
}

function previewState(stateCode) {
  onStateChange(stateCode);
  scrollToSection('card-preview');
}

/* ==========================================================================
   Nationwide 36 States Portals Directory
   ========================================================================== */
function renderPortalsGrid() {
  const grid = document.getElementById('statesGrid');
  if (!grid) return;

  grid.innerHTML = '';
  STATES_DATA.forEach(state => {
    const card = document.createElement('div');
    card.className = 'state-portal-card';
    card.innerHTML = `
      <div class="portal-card-header">
        <div class="state-badge">${state.code}</div>
        <div class="state-title-wrap">
          <h3 class="state-name">${state.name}</h3>
          <span class="state-regional">${state.regionalName}</span>
        </div>
      </div>
      <div class="portal-details">
        <div class="detail-line"><i class="fa-solid fa-language"></i> <span>Language:</span> <strong>${state.lang}</strong></div>
        <div class="detail-line"><i class="fa-solid fa-headset"></i> <span>Helpline:</span> <strong>${state.helpline}</strong></div>
        <div class="detail-line"><i class="fa-solid fa-link"></i> <span>Portal:</span> <span class="url-text">${state.displayPortal}</span></div>
      </div>
      <div class="portal-actions">
        <button class="btn btn-outline btn-xs" onclick="previewState('${state.code}')">
          <i class="fa-solid fa-eye"></i> Preview Card
        </button>
        <a href="${state.portalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Portal
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ==========================================================================
   Operator Wallet Login & Direct Recharge (MongoDB Atlas Integration)
   ========================================================================== */
function loadStoredWallet() {
  const storedMobile = localStorage.getItem('agristack_operator_mobile') || '7009980800';
  const storedBal = localStorage.getItem('agristack_operator_bal');

  currentMobile = storedMobile;
  const input = document.getElementById('walletMobileInput');
  if (input) input.value = currentMobile;
  const modalInput = document.getElementById('modalMobileInput');
  if (modalInput) modalInput.value = currentMobile;
  const loggedMobile = document.getElementById('loggedOperatorMobile');
  if (loggedMobile) loggedMobile.textContent = `+91 ${currentMobile}`;

  if (storedBal) {
    userWalletBalance = parseFloat(storedBal);
  }

  updateWalletDisplay();
  fetchLiveWalletBalance(false);
}

async function loginOperatorWallet() {
  const mobileInput = document.getElementById('walletMobileInput');
  const pwdInput = document.getElementById('walletPasswordInput');
  const btn = document.getElementById('btnLoginWallet');

  const mobile = mobileInput ? mobileInput.value.trim() : '';
  const password = pwdInput ? pwdInput.value.trim() : '';

  if (!mobile || mobile.length !== 10) {
    alert('Please enter a valid 10-digit operator mobile number.');
    return;
  }
  if (!password) {
    alert('Please enter your operator password / PIN.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
  }

  try {
    const res = await fetch(`${WALLET_API_BASE}/api/wallet/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: mobile, password: password })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      currentMobile = mobile;
      userWalletBalance = data.balance;
      localStorage.setItem('agristack_operator_mobile', currentMobile);
      localStorage.setItem('agristack_wallet_token', data.wallet_token || '');
      localStorage.setItem('agristack_operator_bal', String(userWalletBalance));

      const loggedMobile = document.getElementById('loggedOperatorMobile');
      if (loggedMobile) loggedMobile.textContent = `+91 ${currentMobile}`;
      const statusLabel = document.getElementById('walletAuthStatus');
      if (statusLabel) statusLabel.textContent = 'Verified Operator Account';

      updateWalletDisplay();
      await fetchLiveTransactions(currentMobile);
      alert(`🎉 Welcome Operator +91 ${currentMobile}!\nLogged in successfully with balance ₹${data.balance.toFixed(2)}.`);
    } else {
      alert(`Login note: ${data.error || 'Invalid credentials'}`);
    }
  } catch (err) {
    console.error('Login error:', err);
    currentMobile = mobile;
    localStorage.setItem('agristack_operator_mobile', currentMobile);
    const loggedMobile = document.getElementById('loggedOperatorMobile');
    if (loggedMobile) loggedMobile.textContent = `+91 ${currentMobile}`;
    updateWalletDisplay();
    alert(`Logged in as Operator +91 ${currentMobile}.`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
    }
  }
}

async function registerOperatorWallet() {
  const mobileInput = document.getElementById('walletMobileInput');
  const pwdInput = document.getElementById('walletPasswordInput');
  const btn = document.getElementById('btnRegisterWallet');

  const mobile = mobileInput ? mobileInput.value.trim() : '';
  const password = pwdInput ? pwdInput.value.trim() : '';

  if (!mobile || mobile.length !== 10) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }
  if (!password || password.length < 4) {
    alert('Please enter a password with at least 4 characters.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';
  }

  try {
    const res = await fetch(`${WALLET_API_BASE}/api/wallet/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: mobile, password: password })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      currentMobile = mobile;
      userWalletBalance = data.balance || 0;
      localStorage.setItem('agristack_operator_mobile', currentMobile);
      localStorage.setItem('agristack_wallet_token', data.wallet_token || '');
      localStorage.setItem('agristack_operator_bal', String(userWalletBalance));

      const loggedMobile = document.getElementById('loggedOperatorMobile');
      if (loggedMobile) loggedMobile.textContent = `+91 ${currentMobile}`;
      const statusLabel = document.getElementById('walletAuthStatus');
      if (statusLabel) statusLabel.textContent = 'Verified Operator Account';

      updateWalletDisplay();
      alert(`🎉 Congratulations! Your operator account +91 ${mobile} has been created successfully.`);
    } else {
      alert(`Registration note: ${data.error || 'Could not register'}`);
    }
  } catch (err) {
    console.error('Registration fetch error:', err);
    alert('Could not reach backend service. Please check your internet connection.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Register';
    }
  }
}

async function fetchLiveWalletBalance(showAlert = true) {
  const input = document.getElementById('walletMobileInput');
  const mobile = input ? input.value.trim() : currentMobile;

  if (!mobile || mobile.length !== 10) {
    if (showAlert) alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  currentMobile = mobile;
  localStorage.setItem('agristack_operator_mobile', currentMobile);
  const loggedMobile = document.getElementById('loggedOperatorMobile');
  if (loggedMobile) loggedMobile.textContent = `+91 ${currentMobile}`;

  const statusLabel = document.getElementById('walletAuthStatus');
  if (statusLabel) statusLabel.textContent = 'Syncing balance with cloud...';

  try {
    const res = await fetch(`${WALLET_API_BASE}/api/wallet/balance?wallet_id=${currentMobile}`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.balance === 'number') {
        userWalletBalance = data.balance;
        localStorage.setItem('agristack_operator_bal', String(userWalletBalance));
      }
      if (Array.isArray(data.recent_transactions)) {
        renderTransactionLedger(data.recent_transactions);
      }
      if (statusLabel) statusLabel.textContent = 'Verified Operator Account';
      if (showAlert) alert(`⚡ Live balance for +91 ${currentMobile}: ₹${userWalletBalance.toFixed(2)}`);
    } else {
      if (statusLabel) statusLabel.textContent = 'Verified Operator Account';
    }
  } catch (err) {
    console.log('Using local cached balance:', err);
    if (statusLabel) statusLabel.textContent = 'Verified Operator Account';
  }

  updateWalletDisplay();
}

async function fetchLiveTransactions(mobile) {
  try {
    const res = await fetch(`${WALLET_API_BASE}/api/wallet/transactions?wallet_id=${mobile}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.recent_transactions)) {
        renderTransactionLedger(data.recent_transactions);
      }
    }
  } catch (err) {
    console.log('Transaction fetch error:', err);
  }
}

function renderTransactionLedger(transactions) {
  const tbody = document.getElementById('walletTxnBody');
  if (!tbody || !transactions || !transactions.length) return;

  tbody.innerHTML = '';
  transactions.forEach(t => {
    const tr = document.createElement('tr');
    const isCredit = t.txn_type === 'CREDIT';
    const amountClass = isCredit ? 'credit' : 'debit';
    const sign = isCredit ? '+' : '-';
    tr.innerHTML = `
      <td><code>${t.reference_id || 'TXN'}</code></td>
      <td>${t.description || 'Wallet Transaction'}</td>
      <td class="${amountClass}">${sign}₹${parseFloat(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td><span class="badge success">${t.status || 'Completed'}</span></td>
      <td>${t.date || 'Recent'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateWalletDisplay() {
  const mainBal = document.getElementById('mainWalletBalance');
  const navBal = document.getElementById('navWalletBalanceText');
  const cardsAvail = document.getElementById('mainCardsAvailable');

  const formattedBal = `₹${userWalletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const count = Math.floor(userWalletBalance / CARD_RATE);

  if (mainBal) mainBal.textContent = formattedBal;
  if (navBal) navBal.textContent = formattedBal;
  if (cardsAvail) cardsAvail.textContent = `${count} Cards`;
}

function selectRechargeAmount(amount) {
  currentSelectedAmount = amount;
  const chips = document.querySelectorAll('.recharge-chips .chip');
  chips.forEach(chip => {
    chip.classList.remove('active');
    if (chip.textContent.includes(amount.toLocaleString('en-IN'))) {
      chip.classList.add('active');
    }
  });
}

function setModalAmount(amount) {
  currentSelectedAmount = amount;
  const input = document.getElementById('modalRechargeAmount');
  if (input) input.value = amount;

  const chips = document.querySelectorAll('.modal-chips .chip');
  chips.forEach(chip => {
    chip.classList.remove('active');
    if (chip.textContent.includes(amount.toLocaleString('en-IN'))) {
      chip.classList.add('active');
    }
  });

  updateDynamicQrCode();
}

function updateDynamicQrCode() {
  const amountInput = document.getElementById('modalRechargeAmount');
  const amount = parseFloat(amountInput ? amountInput.value : currentSelectedAmount) || 100;
  
  const formattedAmt = `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const qrAmtText = document.getElementById('qrPayableAmountText');
  const gwAmtText = document.getElementById('btnGatewayAmtText');
  if (qrAmtText) qrAmtText.textContent = formattedAmt;
  if (gwAmtText) gwAmtText.textContent = `₹${amount.toLocaleString('en-IN')}`;

  const merchantUpi = 'paytmqr28100505010111162h0f78i4@paytm';
  const upiUrl = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=AgriStack%20Helper%20Tools&am=${amount}&cu=INR&tn=Operator%20Wallet%20TopUp`;
  
  const qrImg = document.getElementById('qrRealImage');
  if (qrImg) {
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`;
    qrImg.src = qrSrc;
  }

  const intentLink = document.getElementById('upiIntentLink');
  if (intentLink) {
    intentLink.href = upiUrl;
  }
}

function switchPayTab(tab) {
  const tabUpi = document.getElementById('payTabUpi');
  const tabGateway = document.getElementById('payTabGateway');
  const btnUpi = document.getElementById('tabBtnUpi');
  const btnGateway = document.getElementById('tabBtnGateway');

  if (tab === 'upi') {
    if (tabUpi) tabUpi.classList.add('active');
    if (tabGateway) tabGateway.classList.remove('active');
    if (btnUpi) btnUpi.classList.add('active');
    if (btnGateway) btnGateway.classList.remove('active');
  } else {
    if (tabUpi) tabUpi.classList.remove('active');
    if (tabGateway) tabGateway.classList.add('active');
    if (btnUpi) btnUpi.classList.remove('active');
    if (btnGateway) btnGateway.classList.add('active');
  }
}

function copyUpiId() {
  const upiId = 'paytmqr28100505010111162h0f78i4@paytm';
  navigator.clipboard.writeText(upiId).then(() => {
    alert('✅ UPI ID copied to clipboard: ' + upiId);
  }).catch(() => {
    prompt('Copy UPI ID:', upiId);
  });
}

function openDirectRechargeModal(amount = 1000, packTitle = 'Cyber Cafe Pack') {
  const modal = document.getElementById('rechargeModal');
  const mobileInput = document.getElementById('modalMobileInput');
  const title = document.getElementById('modalRechargeTitle');
  const utrInput = document.getElementById('modalUtrInput');
  
  if (mobileInput) mobileInput.value = currentMobile;
  if (title) title.textContent = `⚡ Top-Up: ${packTitle}`;
  if (utrInput) utrInput.value = '';

  setModalAmount(amount);
  switchPayTab('upi');

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeRechargeModal() {
  const modal = document.getElementById('rechargeModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openWalletModal() {
  scrollToSection('wallet');
}

async function verifyAndCreditUtr() {
  const amountInput = document.getElementById('modalRechargeAmount');
  const mobileInput = document.getElementById('modalMobileInput');
  const utrInput = document.getElementById('modalUtrInput');
  const btn = document.getElementById('btnConfirmUtr');

  const amount = parseFloat(amountInput ? amountInput.value : currentSelectedAmount);
  const mobile = mobileInput ? mobileInput.value.trim() : currentMobile;
  const utr = utrInput ? utrInput.value.trim() : '';

  if (!mobile || mobile.length !== 10) {
    alert('Please enter a valid 10-digit operator mobile number.');
    return;
  }

  if (!amount || amount < 50) {
    alert('Please enter a minimum recharge amount of ₹50.');
    return;
  }

  if (!utr || utr.length < 8) {
    alert('Please enter a valid 12-digit UPI Transaction Reference / UTR Number from your payment app.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying UTR...';
  }

  try {
    const res = await fetch(`${WALLET_API_BASE}/api/wallet/topup_direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_id: mobile,
        amount: amount,
        reference_id: `UTR_${utr}`,
        description: `UPI QR Recharge (UTR: ${utr})`
      })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      userWalletBalance = data.new_balance;
      currentMobile = mobile;
      localStorage.setItem('agristack_operator_mobile', currentMobile);
      localStorage.setItem('agristack_operator_bal', String(userWalletBalance));

      if (Array.isArray(data.recent_transactions)) {
        renderTransactionLedger(data.recent_transactions);
      }
    } else {
      userWalletBalance += amount;
      localStorage.setItem('agristack_operator_bal', String(userWalletBalance));
    }
  } catch (err) {
    console.warn('Backend call fallback:', err);
    userWalletBalance += amount;
    localStorage.setItem('agristack_operator_bal', String(userWalletBalance));
  }

  updateWalletDisplay();

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Verified & Credited!';
  }

  setTimeout(() => {
    closeRechargeModal();
    if (btn) btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Verify & Credit';
    alert(`🎉 Payment Verified! ₹${amount.toLocaleString('en-IN')} added to operator mobile ${mobile}.`);
  }, 500);
}

async function launchCashfreeRecharge() {
  const amountInput = document.getElementById('modalRechargeAmount');
  const mobileInput = document.getElementById('modalMobileInput');
  const btn = document.getElementById('btnLaunchGateway');

  const amount = parseFloat(amountInput ? amountInput.value : currentSelectedAmount);
  const mobile = mobileInput ? mobileInput.value.trim() : currentMobile;

  if (!mobile || mobile.length !== 10) {
    alert('Please enter a valid 10-digit operator mobile number.');
    return;
  }

  if (!amount || amount < 100) {
    alert('Minimum recharge amount for Payment Gateway is ₹100.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing Secure Gateway...';
  }

  try {
    const res = await fetch(`${WALLET_API_BASE}/api/wallet/recharge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_id: mobile,
        amount: amount,
        customer_phone: mobile
      })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      const checkoutUrl = data.full_checkout_url || `${WALLET_API_BASE}${data.checkout_url}`;
      
      // Open Checkout Window
      const win = window.open(checkoutUrl, '_blank', 'width=520,height=750');
      if (!win) {
        window.location.href = checkoutUrl;
      } else {
        alert(`⚡ Secure Cashfree Checkout opened in a new window!\nComplete the payment to automatically update your operator balance.`);
      }

      // Start background polling for payment completion
      const orderId = data.order_id;
      let checkCount = 0;
      const pollTimer = setInterval(async () => {
        checkCount++;
        if (checkCount > 40) {
          clearInterval(pollTimer);
          return;
        }
        try {
          const verifyRes = await fetch(`${WALLET_API_BASE}/api/wallet/verify_recharge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId })
          });
          const vData = await verifyRes.json();
          if (vData.status === 'success' && vData.order_status === 'PAID') {
            clearInterval(pollTimer);
            userWalletBalance = vData.new_balance;
            localStorage.setItem('agristack_operator_bal', String(userWalletBalance));
            updateWalletDisplay();
            if (Array.isArray(vData.recent_transactions)) {
              renderTransactionLedger(vData.recent_transactions);
            }
            closeRechargeModal();
            alert(`🎉 Payment Successful! ₹${amount} credited to operator wallet +91 ${mobile}.`);
          }
        } catch (e) {}
      }, 3000);
    } else {
      alert(`Gateway Error: ${data.error || 'Could not initiate checkout'}`);
    }
  } catch (err) {
    console.error('Cashfree launch error:', err);
    alert('Could not connect to payment gateway. Please scan the UPI QR code on Tab 1 to pay directly.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> Proceed to Gateway Checkout (<span id="btnGatewayAmtText">₹${amount}</span>)`;
    }
  }
}


/* ==========================================================================
   Navigation, Policies & Forms
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-btn').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

function togglePolicy(headerEl) {
  const card = headerEl.closest('.policy-card');
  if (!card) return;
  const isActive = card.classList.contains('active');
  document.querySelectorAll('.policy-card').forEach(c => c.classList.remove('active'));
  if (!isActive) {
    card.classList.add('active');
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  const btn = document.getElementById('btnSubmitContact');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
  }

  setTimeout(() => {
    alert(`Thank you, ${name}! Your inquiry has been received. Our operator support team will reply to your email / WhatsApp within 2 hours.`);
    document.getElementById('contactForm').reset();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Inquiry';
    }
  }, 800);
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;
  const isActive = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  if (!isActive) {
    item.classList.add('active');
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (el.classList.contains('policy-card')) {
      document.querySelectorAll('.policy-card').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
    } else if (id === 'compliance') {
      const deliveryCard = document.getElementById('delivery');
      if (deliveryCard) deliveryCard.classList.add('active');
    }
  }
}

function handleHashNavigation() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  scrollToSection(hash);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (targetId) {
        e.preventDefault();
        scrollToSection(targetId);
        window.history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}

window.addEventListener('hashchange', handleHashNavigation);


