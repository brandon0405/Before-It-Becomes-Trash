"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { LanguageToggle } from "@/components/language-toggle";
import type { AnalysisResult, HistoryEntry, ItemFormInput, StatsSummary } from "@/lib/domain";
import { useAppLanguage } from "@/hooks/use-app-language";
import type { AppLanguage } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { buildDemoAnalysis } from "@/lib/demo-data";

type DashboardClientProps = {
  initialHistory: HistoryEntry[];
  initialStats: StatsSummary;
  userName: string;
  isDemo?: boolean;
};

const CATEGORY_OPTIONS = [
  "Electronics",
  "Home appliance",
  "Furniture",
  "Textiles",
  "Footwear",
  "Accessories",
  "Kitchen",
  "Other",
];

const STATE_OPTIONS = ["usable", "partially damaged", "non-functional", "unsafe"];

const CATEGORY_LABELS: Record<AppLanguage, Record<string, string>> = {
  en: {
    Electronics: "Electronics",
    "Home appliance": "Home appliance",
    Furniture: "Furniture",
    Textiles: "Textiles",
    Footwear: "Footwear",
    Accessories: "Accessories",
    Kitchen: "Kitchen",
    Other: "Other",
  },
  es: {
    Electronics: "Electronica",
    "Home appliance": "Electrodomestico",
    Furniture: "Mueble",
    Textiles: "Textiles",
    Footwear: "Calzado",
    Accessories: "Accesorios",
    Kitchen: "Cocina",
    Other: "Otro",
  },
  hi: {
    Electronics: "इलेक्ट्रॉनिक्स",
    "Home appliance": "घरेलू उपकरण",
    Furniture: "फर्नीचर",
    Textiles: "कपड़ा",
    Footwear: "जूते",
    Accessories: "एसेसरीज़",
    Kitchen: "रसोई",
    Other: "अन्य",
  },
  zh: {
    Electronics: "电子产品",
    "Home appliance": "家电",
    Furniture: "家具",
    Textiles: "纺织品",
    Footwear: "鞋类",
    Accessories: "配件",
    Kitchen: "厨房",
    Other: "其他",
  },
  ar: {
    Electronics: "الكترونيات",
    "Home appliance": "اجهزة منزلية",
    Furniture: "اثاث",
    Textiles: "منسوجات",
    Footwear: "احذية",
    Accessories: "اكسسوارات",
    Kitchen: "مطبخ",
    Other: "اخرى",
  },
  fr: {
    Electronics: "Electronique",
    "Home appliance": "Appareil domestique",
    Furniture: "Mobilier",
    Textiles: "Textiles",
    Footwear: "Chaussures",
    Accessories: "Accessoires",
    Kitchen: "Cuisine",
    Other: "Autre",
  },
  pt: {
    Electronics: "Eletronicos",
    "Home appliance": "Eletrodomestico",
    Furniture: "Movel",
    Textiles: "Texteis",
    Footwear: "Calcados",
    Accessories: "Acessorios",
    Kitchen: "Cozinha",
    Other: "Outro",
  },
};

const STATE_LABELS: Record<AppLanguage, Record<string, string>> = {
  en: {
    usable: "Usable",
    "partially damaged": "Partially damaged",
    "non-functional": "Non-functional",
    unsafe: "Unsafe",
  },
  es: {
    usable: "Usable",
    "partially damaged": "Parcialmente dañado",
    "non-functional": "No funcional",
    unsafe: "Inseguro",
  },
  hi: {
    usable: "उपयोग योग्य",
    "partially damaged": "आंशिक रूप से क्षतिग्रस्त",
    "non-functional": "काम नहीं कर रहा",
    unsafe: "असुरक्षित",
  },
  zh: {
    usable: "可用",
    "partially damaged": "部分损坏",
    "non-functional": "无法工作",
    unsafe: "不安全",
  },
  ar: {
    usable: "قابل للاستخدام",
    "partially damaged": "متضرر جزئيا",
    "non-functional": "غير عامل",
    unsafe: "غير آمن",
  },
  fr: {
    usable: "Utilisable",
    "partially damaged": "Partiellement endommage",
    "non-functional": "Non fonctionnel",
    unsafe: "Dangereux",
  },
  pt: {
    usable: "Utilizavel",
    "partially damaged": "Parcialmente danificado",
    "non-functional": "Nao funcional",
    unsafe: "Inseguro",
  },
};

const DASHBOARD_LABELS: Record<
  AppLanguage,
  {
    heroEyebrow: string;
    statsRepair: string;
    statsReuse: string;
    statsRecycle: string;
    registerTitle: string;
    registerDescription: string;
    fieldName: string;
    fieldCategory: string;
    fieldState: string;
    fieldAge: string;
    fieldAgePlaceholder: string;
    fieldDamage: string;
    fieldImage: string;
    fieldImagePlaceholder: string;
    smartTitle: string;
    smartEmpty: string;
    primaryRecommendation: string;
    probableDiagnosis: string;
    justification: string;
    suggestedSteps: string;
    estimatedDifficulty: string;
    recoverableLife: string;
    ecoImpact: string;
    historyStatus: string;
    historyBadge: string;
    historyViewSolana: string;
    historyNoBlockchain: string;
    dateLocale: string;
  }
> = {
  en: {
    heroEyebrow: "Earth Day Rescue Assistant",
    statsRepair: "Repair",
    statsReuse: "Reuse",
    statsRecycle: "Recycle",
    registerTitle: "Register item",
    registerDescription: "Complete the case and run a structured AI evaluation.",
    fieldName: "Item name",
    fieldCategory: "Category",
    fieldState: "Current state",
    fieldAge: "Approximate age",
    fieldAgePlaceholder: "Ex: 2 years",
    fieldDamage: "Damage description",
    fieldImage: "Upload image (optional)",
    fieldImagePlaceholder: "https://...",
    smartTitle: "Smart evaluation",
    smartEmpty:
      "Run an analysis to see diagnosis, primary recommendation, suggested steps, difficulty, ecological impact, and recoverable life.",
    primaryRecommendation: "Primary recommendation",
    probableDiagnosis: "Probable diagnosis",
    justification: "Justification",
    suggestedSteps: "Suggested steps",
    estimatedDifficulty: "Estimated difficulty",
    recoverableLife: "Recoverable life",
    ecoImpact: "Estimated ecological impact",
    historyStatus: "Status",
    historyBadge: "Badge",
    historyViewSolana: "View Solana record",
    historyNoBlockchain: "No blockchain reference",
    dateLocale: "en-US",
  },
  es: {
    heroEyebrow: "Asistente de rescate ambiental",
    statsRepair: "Reparar",
    statsReuse: "Reutilizar",
    statsRecycle: "Reciclar",
    registerTitle: "Registrar objeto",
    registerDescription: "Completa el caso y ejecuta evaluación IA estructurada.",
    fieldName: "Nombre del objeto",
    fieldCategory: "Categoría",
    fieldState: "Estado actual",
    fieldAge: "Antigüedad aproximada",
    fieldAgePlaceholder: "Ej: 2 años",
    fieldDamage: "Descripción del daño",
    fieldImage: "Subir imagen (opcional)",
    fieldImagePlaceholder: "https://...",
    smartTitle: "Evaluación inteligente",
    smartEmpty:
      "Ejecuta un análisis para ver diagnóstico, recomendación principal, pasos sugeridos, dificultad, impacto ecológico y vida recuperable.",
    primaryRecommendation: "Recomendación principal",
    probableDiagnosis: "Diagnóstico probable",
    justification: "Justificación",
    suggestedSteps: "Pasos sugeridos",
    estimatedDifficulty: "Dificultad estimada",
    recoverableLife: "Vida recuperable",
    ecoImpact: "Impacto ecológico estimado",
    historyStatus: "Estado",
    historyBadge: "Badge",
    historyViewSolana: "Ver registro en Solana",
    historyNoBlockchain: "Sin referencia blockchain",
    dateLocale: "es-ES",
  },
  hi: {
    heroEyebrow: "Earth Day Rescue Assistant",
    statsRepair: "रिपेयर",
    statsReuse: "रीयूज़",
    statsRecycle: "रिसायकल",
    registerTitle: "आइटम दर्ज करें",
    registerDescription: "केस पूरा करें और structured AI evaluation चलाएं।",
    fieldName: "आइटम का नाम",
    fieldCategory: "श्रेणी",
    fieldState: "वर्तमान स्थिति",
    fieldAge: "अनुमानित उम्र",
    fieldAgePlaceholder: "उदाहरण: 2 साल",
    fieldDamage: "क्षति विवरण",
    fieldImage: "छवि अपलोड करें (वैकल्पिक)",
    fieldImagePlaceholder: "https://...",
    smartTitle: "स्मार्ट मूल्यांकन",
    smartEmpty:
      "विश्लेषण चलाकर diagnosis, primary recommendation, suggested steps, difficulty, ecological impact और recoverable life देखें।",
    primaryRecommendation: "मुख्य सिफारिश",
    probableDiagnosis: "संभावित diagnosis",
    justification: "औचित्य",
    suggestedSteps: "सुझाए गए चरण",
    estimatedDifficulty: "अनुमानित कठिनाई",
    recoverableLife: "रिकवर होने वाली आयु",
    ecoImpact: "अनुमानित पारिस्थितिक प्रभाव",
    historyStatus: "स्थिति",
    historyBadge: "Badge",
    historyViewSolana: "Solana रिकॉर्ड देखें",
    historyNoBlockchain: "कोई blockchain reference नहीं",
    dateLocale: "hi-IN",
  },
  zh: {
    heroEyebrow: "地球日修复助手",
    statsRepair: "修复",
    statsReuse: "再利用",
    statsRecycle: "回收",
    registerTitle: "登记物品",
    registerDescription: "填写案例并运行结构化 AI 评估。",
    fieldName: "物品名称",
    fieldCategory: "类别",
    fieldState: "当前状态",
    fieldAge: "大致使用年限",
    fieldAgePlaceholder: "例如：2 年",
    fieldDamage: "损坏描述",
    fieldImage: "上传图片（可选）",
    fieldImagePlaceholder: "https://...",
    smartTitle: "智能评估",
    smartEmpty:
      "运行分析以查看诊断、主要建议、建议步骤、难度、生态影响和可恢复寿命。",
    primaryRecommendation: "主要建议",
    probableDiagnosis: "可能诊断",
    justification: "理由",
    suggestedSteps: "建议步骤",
    estimatedDifficulty: "预计难度",
    recoverableLife: "可恢复寿命",
    ecoImpact: "预计生态影响",
    historyStatus: "状态",
    historyBadge: "徽章",
    historyViewSolana: "查看 Solana 记录",
    historyNoBlockchain: "无区块链记录",
    dateLocale: "zh-CN",
  },
  ar: {
    heroEyebrow: "مساعد انقاذ يوم الارض",
    statsRepair: "اصلاح",
    statsReuse: "اعادة الاستخدام",
    statsRecycle: "اعادة التدوير",
    registerTitle: "تسجيل عنصر",
    registerDescription: "اكمل الحالة وشغل تقييما منظما بالذكاء الاصطناعي.",
    fieldName: "اسم العنصر",
    fieldCategory: "الفئة",
    fieldState: "الحالة الحالية",
    fieldAge: "العمر التقريبي",
    fieldAgePlaceholder: "مثال: سنتان",
    fieldDamage: "وصف الضرر",
    fieldImage: "رفع صورة (اختياري)",
    fieldImagePlaceholder: "https://...",
    smartTitle: "تقييم ذكي",
    smartEmpty:
      "شغل التحليل لرؤية التشخيص والتوصية الرئيسية والخطوات المقترحة والصعوبة والاثر البيئي والعمر المستعاد.",
    primaryRecommendation: "التوصية الرئيسية",
    probableDiagnosis: "التشخيص المحتمل",
    justification: "التبرير",
    suggestedSteps: "الخطوات المقترحة",
    estimatedDifficulty: "الصعوبة المتوقعة",
    recoverableLife: "العمر القابل للاستعادة",
    ecoImpact: "الاثر البيئي المتوقع",
    historyStatus: "الحالة",
    historyBadge: "شارة",
    historyViewSolana: "عرض سجل Solana",
    historyNoBlockchain: "لا يوجد سجل بلوكشين",
    dateLocale: "ar-SA",
  },
  fr: {
    heroEyebrow: "Assistant de sauvetage Jour de la Terre",
    statsRepair: "Reparer",
    statsReuse: "Reutiliser",
    statsRecycle: "Recycler",
    registerTitle: "Enregistrer un objet",
    registerDescription: "Completez le cas et lancez une evaluation IA structuree.",
    fieldName: "Nom de l'objet",
    fieldCategory: "Categorie",
    fieldState: "Etat actuel",
    fieldAge: "Age approximatif",
    fieldAgePlaceholder: "Ex : 2 ans",
    fieldDamage: "Description du dommage",
    fieldImage: "Televerser une image (optionnel)",
    fieldImagePlaceholder: "https://...",
    smartTitle: "Evaluation intelligente",
    smartEmpty:
      "Lancez une analyse pour voir diagnostic, recommandation principale, etapes suggerees, difficulte, impact ecologique et duree recuperee.",
    primaryRecommendation: "Recommandation principale",
    probableDiagnosis: "Diagnostic probable",
    justification: "Justification",
    suggestedSteps: "Etapes suggerees",
    estimatedDifficulty: "Difficulte estimee",
    recoverableLife: "Duree recuperable",
    ecoImpact: "Impact ecologique estime",
    historyStatus: "Statut",
    historyBadge: "Badge",
    historyViewSolana: "Voir l'enregistrement Solana",
    historyNoBlockchain: "Sans reference blockchain",
    dateLocale: "fr-FR",
  },
  pt: {
    heroEyebrow: "Assistente de resgate do Dia da Terra",
    statsRepair: "Reparar",
    statsReuse: "Reutilizar",
    statsRecycle: "Reciclar",
    registerTitle: "Registrar item",
    registerDescription: "Complete o caso e execute avaliacao estruturada por IA.",
    fieldName: "Nome do item",
    fieldCategory: "Categoria",
    fieldState: "Estado atual",
    fieldAge: "Idade aproximada",
    fieldAgePlaceholder: "Ex: 2 anos",
    fieldDamage: "Descricao do dano",
    fieldImage: "Enviar imagem (opcional)",
    fieldImagePlaceholder: "https://...",
    smartTitle: "Avaliacao inteligente",
    smartEmpty:
      "Execute uma analise para ver diagnostico, recomendacao principal, passos sugeridos, dificuldade, impacto ecologico e vida recuperavel.",
    primaryRecommendation: "Recomendacao principal",
    probableDiagnosis: "Diagnostico provavel",
    justification: "Justificativa",
    suggestedSteps: "Passos sugeridos",
    estimatedDifficulty: "Dificuldade estimada",
    recoverableLife: "Vida recuperavel",
    ecoImpact: "Impacto ecologico estimado",
    historyStatus: "Status",
    historyBadge: "Badge",
    historyViewSolana: "Ver registro na Solana",
    historyNoBlockchain: "Sem referencia blockchain",
    dateLocale: "pt-PT",
  },
};

function localizeCategory(value: string, language: AppLanguage): string {
  return CATEGORY_LABELS[language][value] ?? value;
}

function localizeState(value: string, language: AppLanguage): string {
  return STATE_LABELS[language][value] ?? value;
}

function localizeStatus(value: string, language: AppLanguage): string {
  const normalized = value.trim().toLowerCase();
  if (normalized === "saved" || normalized === "completed") {
    return language === "es" ? "Guardado" : language === "fr" ? "Enregistre" : language === "pt" ? "Salvo" : language === "ar" ? "محفوظ" : language === "zh" ? "已保存" : language === "hi" ? "सहेजा गया" : "Saved";
  }
  return value;
}

const INITIAL_FORM: ItemFormInput = {
  name: "",
  category: "Electronics",
  damageDescription: "",
  approximateAge: "",
  currentState: "partially damaged",
};

const UI_COPY: Record<
  AppLanguage,
  {
    greeting: string;
    intro: string;
    demoIntro: string;
    logout: string;
    backHome: string;
    analyze: string;
    analyzing: string;
    save: string;
    saving: string;
    failedAnalyze: string;
    failedSave: string;
    failedAnalyzeRequest: string;
    successWithChain: string;
    successNoChain: string;
    statsTotal: string;
    statsBadges: string;
    historyTitle: string;
    casesRegistered: string;
    historyEmpty: string;
  }
> = {
  en: {
    greeting: "Hello",
    intro:
      "Register damaged objects, receive structured AI evaluation, save each case in your history, and issue a symbolic verifiable record on Solana Devnet.",
    demoIntro:
      "Demo mode: same UI flow without login. Analysis and saves are simulated with realistic mock examples for judge review.",
    logout: "Log out",
    backHome: "Back to home",
    analyze: "Evaluate with AI",
    analyzing: "Analyzing with Gemini...",
    save: "Save case and issue badge",
    saving: "Saving rescue...",
    failedAnalyze: "Analysis failed",
    failedSave: "Save failed",
    failedAnalyzeRequest: "Failed to analyze this item",
    successWithChain: "Rescue saved and badge recorded on Solana Devnet",
    successNoChain: "Rescue saved. Blockchain record was skipped or unavailable.",
    statsTotal: "Total rescued",
    statsBadges: "Badges",
    historyTitle: "Personal history",
    casesRegistered: "cases registered",
    historyEmpty: "There are no saved rescues in your account yet.",
  },
  es: {
    greeting: "Hola",
    intro:
      "Registra objetos dañados, recibe evaluación estructurada con IA, guarda el caso en tu historial y emite una constancia simbólica verificable en Solana Devnet.",
    demoIntro:
      "Modo demo: mismo flujo visual sin login. El análisis y guardado se simulan con datos mock realistas para revisión de jueces.",
    logout: "Cerrar sesión",
    backHome: "Volver al inicio",
    analyze: "Evaluar con IA",
    analyzing: "Analizando con Gemini...",
    save: "Guardar caso y emitir badge",
    saving: "Guardando rescate...",
    failedAnalyze: "Falló el análisis",
    failedSave: "Fallo al guardar",
    failedAnalyzeRequest: "No se pudo analizar este objeto",
    successWithChain: "Rescate guardado y badge registrado en Solana Devnet",
    successNoChain: "Rescate guardado. El registro blockchain fue omitido o no estuvo disponible.",
    statsTotal: "Total rescatados",
    statsBadges: "Badges",
    historyTitle: "Historial personal",
    casesRegistered: "casos registrados",
    historyEmpty: "Todavía no hay rescates guardados para tu cuenta.",
  },
  hi: {
    greeting: "नमस्ते",
    intro:
      "Kharab vastuon ko register karein, AI se sanrachit mulyankan paayen, case history me save karein, aur Solana Devnet par pratikatmak record jari karein.",
    demoIntro:
      "Demo mode: bina login wahi UI flow. Analysis aur save realistic mock examples ke saath simulate hote hain.",
    logout: "लॉग आउट",
    backHome: "होम पर जाएं",
    analyze: "AI से मूल्यांकन करें",
    analyzing: "Gemini se vishleshan ho raha hai...",
    save: "Case save karein aur badge jari karein",
    saving: "Rescue save ho raha hai...",
    failedAnalyze: "विश्लेषण असफल",
    failedSave: "सहेजना असफल",
    failedAnalyzeRequest: "इस आइटम का विश्लेषण नहीं हो सका",
    successWithChain: "रेस्क्यू सेव हुआ और बैज Solana Devnet पर दर्ज हुआ",
    successNoChain: "रेस्क्यू सेव हुआ। Blockchain रिकॉर्ड छोड़ा गया या उपलब्ध नहीं था।",
    statsTotal: "कुल बचाए गए",
    statsBadges: "Badges",
    historyTitle: "व्यक्तिगत इतिहास",
    casesRegistered: "मामले दर्ज",
    historyEmpty: "आपके खाते में अभी तक कोई रेस्क्यू सेव नहीं है।",
  },
  zh: {
    greeting: "你好",
    intro:
      "登记受损物品，获取结构化 AI 评估，将案例保存到历史记录，并在 Solana Devnet 上生成可验证的象征性记录。",
    demoIntro:
      "演示模式：无需登录即可体验同样流程。分析与保存使用真实感的 mock 数据模拟。",
    logout: "退出登录",
    backHome: "返回首页",
    analyze: "使用 AI 评估",
    analyzing: "正在使用 Gemini 分析...",
    save: "保存案例并生成徽章",
    saving: "正在保存...",
    failedAnalyze: "分析失败",
    failedSave: "保存失败",
    failedAnalyzeRequest: "无法分析该物品",
    successWithChain: "案例已保存，徽章已记录到 Solana Devnet",
    successNoChain: "案例已保存。区块链记录被跳过或不可用。",
    statsTotal: "总救助数",
    statsBadges: "徽章",
    historyTitle: "个人历史",
    casesRegistered: "个已记录案例",
    historyEmpty: "你的账户还没有已保存的救援案例。",
  },
  ar: {
    greeting: "Marhaban",
    intro:
      "سجل العناصر التالفة، واحصل على تقييم منظم بالذكاء الاصطناعي، واحفظ الحالة في السجل، واصدر سجلا رمزيا قابلا للتحقق على Solana Devnet.",
    demoIntro:
      "وضع تجريبي: نفس التدفق بدون تسجيل دخول. التحليل والحفظ يتمان ببيانات mock واقعية لمراجعة الحكام.",
    logout: "تسجيل الخروج",
    backHome: "العودة للصفحة الرئيسية",
    analyze: "تحليل بالذكاء الاصطناعي",
    analyzing: "جار التحليل بواسطة Gemini...",
    save: "حفظ الحالة واصدار شارة",
    saving: "جار حفظ الانقاذ...",
    failedAnalyze: "فشل التحليل",
    failedSave: "فشل الحفظ",
    failedAnalyzeRequest: "تعذر تحليل هذا العنصر",
    successWithChain: "تم حفظ الانقاذ وتسجيل الشارة على Solana Devnet",
    successNoChain: "تم حفظ الانقاذ. تم تجاوز سجل البلوكشين او لم يكن متاحا.",
    statsTotal: "اجمالي العناصر المنقذة",
    statsBadges: "الشارات",
    historyTitle: "السجل الشخصي",
    casesRegistered: "حالة مسجلة",
    historyEmpty: "لا توجد حالات انقاذ محفوظة لحسابك بعد.",
  },
  fr: {
    greeting: "Bonjour",
    intro:
      "Enregistrez des objets endommages, recevez une evaluation IA structuree, sauvegardez chaque cas dans votre historique et emettez une preuve symbolique sur Solana Devnet.",
    demoIntro:
      "Mode demo : meme parcours sans connexion. Analyse et sauvegarde sont simulees avec des exemples mock realistes.",
    logout: "Se deconnecter",
    backHome: "Retour a l'accueil",
    analyze: "Evaluer avec IA",
    analyzing: "Analyse avec Gemini...",
    save: "Enregistrer le cas et emettre un badge",
    saving: "Enregistrement en cours...",
    failedAnalyze: "Echec de l'analyse",
    failedSave: "Echec de l'enregistrement",
    failedAnalyzeRequest: "Impossible d'analyser cet objet",
    successWithChain: "Sauvetage enregistre et badge inscrit sur Solana Devnet",
    successNoChain: "Sauvetage enregistre. Le registre blockchain a ete ignore ou indisponible.",
    statsTotal: "Total sauves",
    statsBadges: "Badges",
    historyTitle: "Historique personnel",
    casesRegistered: "cas enregistres",
    historyEmpty: "Aucun sauvetage enregistre pour votre compte pour le moment.",
  },
  pt: {
    greeting: "Ola",
    intro:
      "Registre objetos danificados, receba avaliacao estruturada por IA, salve cada caso no historico e emita um registro simbolico verificavel na Solana Devnet.",
    demoIntro:
      "Modo demo: mesmo fluxo visual sem login. Analise e salvamento sao simulados com dados mock realistas.",
    logout: "Encerrar sessao",
    backHome: "Voltar ao inicio",
    analyze: "Avaliar com IA",
    analyzing: "Analisando com Gemini...",
    save: "Salvar caso e emitir badge",
    saving: "Salvando resgate...",
    failedAnalyze: "Falha na analise",
    failedSave: "Falha ao salvar",
    failedAnalyzeRequest: "Nao foi possivel analisar este item",
    successWithChain: "Resgate salvo e badge registrado na Solana Devnet",
    successNoChain: "Resgate salvo. O registro blockchain foi ignorado ou indisponivel.",
    statsTotal: "Total resgatados",
    statsBadges: "Badges",
    historyTitle: "Historico pessoal",
    casesRegistered: "casos registrados",
    historyEmpty: "Ainda nao ha resgates salvos para sua conta.",
  },
};

function recommendationText(value: string, language: AppLanguage) {
  switch (value) {
    case "repair":
      return language === "es" ? "Reparar" : language === "fr" ? "Reparer" : language === "pt" ? "Reparar" : language === "ar" ? "اصلاح" : language === "zh" ? "修复" : language === "hi" ? "मरम्मत" : "Repair";
    case "reuse":
      return language === "es" ? "Reutilizar" : language === "fr" ? "Reutiliser" : language === "pt" ? "Reutilizar" : language === "ar" ? "اعادة الاستخدام" : language === "zh" ? "再利用" : language === "hi" ? "पुनः उपयोग" : "Reuse";
    case "recycle":
      return language === "es" ? "Reciclar" : language === "fr" ? "Recycler" : language === "pt" ? "Reciclar" : language === "ar" ? "اعادة التدوير" : language === "zh" ? "回收" : language === "hi" ? "रीसायकल" : "Recycle";
    default:
      return language === "es" ? "Descartar" : language === "fr" ? "Jeter" : language === "pt" ? "Descartar" : language === "ar" ? "تخلص" : language === "zh" ? "丢弃" : language === "hi" ? "त्यागें" : "Discard";
  }
}

function recommendationClass(value: string) {
  switch (value) {
    case "repair":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200";
    case "reuse":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200";
    case "recycle":
      return "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200";
    default:
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200";
  }
}

export function DashboardClient({ initialHistory, initialStats, userName, isDemo = false }: DashboardClientProps) {
  const { language } = useAppLanguage();
  const copy = UI_COPY[language];
  const labels = DASHBOARD_LABELS[language];
  const resultsRef = useRef<HTMLElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<ItemFormInput>(INITIAL_FORM);
  const [analyzedItem, setAnalyzedItem] = useState<ItemFormInput | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [stats, setStats] = useState<StatsSummary>(initialStats);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const latest = useMemo(() => history.slice(0, 6), [history]);
  const evaluationState = useMemo<"idle" | "loading" | "success">(() => {
    if (isAnalyzing) {
      return "loading";
    }

    if (analysis) {
      return "success";
    }

    return "idle";
  }, [analysis, isAnalyzing]);

  const firstName = useMemo(() => {
    const normalized = userName.trim();
    return normalized.length > 0 ? normalized.split(/\s+/)[0] : "eco-rescuer";
  }, [userName]);

  const setField = (field: keyof ItemFormInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    if (!analysis || !resultsRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [analysis]);

  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageDataUrl(null);
      setImagePreviewUrl(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setImageDataUrl(result);
      setImagePreviewUrl(result);
    };

    reader.onerror = () => {
      setImageDataUrl(null);
      setImagePreviewUrl(null);
    };

    reader.readAsDataURL(file);
  }

  async function refreshHistoryAndStats() {
    if (isDemo) {
      return;
    }

    const [historyRes, statsRes] = await Promise.all([
      fetch("/api/history", { cache: "no-store" }),
      fetch("/api/stats", { cache: "no-store" }),
    ]);

    if (historyRes.ok) {
      const historyPayload = await historyRes.json();
      setHistory(historyPayload.history ?? []);
    }

    if (statsRes.ok) {
      const statsPayload = await statsRes.json();
      setStats(statsPayload.stats ?? initialStats);
    }
  }

  async function handleAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    setSuccess(null);

    const formSnapshot = { ...form };
    const imageDataSnapshot = imageDataUrl;

    setForm(INITIAL_FORM);
    setImageDataUrl(null);
    setImagePreviewUrl(null);

    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = "";
    }

    try {
      if (isDemo) {
        const demoAnalysis = buildDemoAnalysis(formSnapshot, language);
        await new Promise((resolve) => setTimeout(resolve, 700));
        setAnalysis(demoAnalysis);
        setAnalyzedItem(formSnapshot);
        return;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: formSnapshot, language, imageDataUrl: imageDataSnapshot ?? undefined }),
      });

      let payload: { analysis?: AnalysisResult; error?: string } | null = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(payload?.error ?? copy.failedAnalyzeRequest);
      }

      if (!payload?.analysis) {
        throw new Error(copy.failedAnalyzeRequest);
      }

      setAnalysis(payload.analysis);
      setAnalyzedItem(formSnapshot);
    } catch (err) {
      const message = err instanceof Error ? err.message : copy.failedAnalyze;
      setError(message);
      setAnalyzedItem(null);
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSaveRescue() {
    if (!analysis || !analyzedItem) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (isDemo) {
        await new Promise((resolve) => setTimeout(resolve, 550));

        const nextEntry: HistoryEntry = {
          rescueActionId: `demo-${Date.now()}`,
          itemId: `demo-item-${Date.now()}`,
          analysisId: `demo-analysis-${Date.now()}`,
          itemName: analyzedItem.name,
          category: analyzedItem.category,
          recommendation: analysis.recommendation,
          status: "completed",
          createdAt: new Date().toISOString(),
          probableDiagnosis: analysis.probableDiagnosis,
          badgeLabel: "Demo Badge",
          blockchainSignature: null,
          blockchainExplorerUrl: null,
        };

        setHistory((current) => [nextEntry, ...current]);
        setStats((current) => ({
          ...current,
          totalRescued: current.totalRescued + 1,
          repairCount: current.repairCount + (analysis.recommendation === "repair" ? 1 : 0),
          reuseCount: current.reuseCount + (analysis.recommendation === "reuse" ? 1 : 0),
          recycleCount: current.recycleCount + (analysis.recommendation === "recycle" ? 1 : 0),
          discardCount: current.discardCount + (analysis.recommendation === "discard" ? 1 : 0),
          badgesEarned: current.badgesEarned + 1,
          latestRescues: [
            {
              rescueActionId: nextEntry.rescueActionId,
              itemName: nextEntry.itemName,
              recommendation: nextEntry.recommendation,
              createdAt: nextEntry.createdAt,
            },
            ...current.latestRescues,
          ].slice(0, 5),
        }));

        setSuccess(copy.successNoChain);
        setAnalysis(null);
        setAnalyzedItem(null);
        return;
      }

      const response = await fetch("/api/rescues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: analyzedItem,
          analysis,
          registerOnChain: true,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? copy.failedSave);
      }

      const signature = payload.rescue?.blockchainRecord?.signature;
      setSuccess(
        signature
          ? `${copy.successWithChain} (${signature.slice(0, 8)}...).`
          : copy.successNoChain,
      );
      setAnalysis(null);
      setAnalyzedItem(null);

      await refreshHistoryAndStats();
    } catch (err) {
      const message = err instanceof Error ? err.message : copy.failedSave;
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-16 top-4 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-amber-300/20 blur-3xl" />

      <section className="relative rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-sky-50/90 via-emerald-50/80 to-amber-50/85 p-6 shadow-soft backdrop-blur dark:border-slate-700/80 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-800/90 sm:p-8">
        <Image
          src="/images/pngtree-earth-globe-surrounded-by-green-leaves-symbolizing-environmental-protection-and-sustainability-png-image_11989157.png"
          alt="Planet care illustration"
          width={128}
          height={128}
          className="pointer-events-none absolute right-3 top-3 h-20 w-20 object-contain opacity-95 sm:right-5 sm:top-5 sm:h-24 sm:w-24 md:h-28 md:w-28"
          priority
        />

        <div className="max-w-3xl pr-20 sm:pr-28 md:pr-36">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">{labels.heroEyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 dark:text-slate-100 sm:text-4xl">
            {copy.greeting} {firstName}
          </h1>
          <p className="mt-3 text-sm text-emerald-900/80 dark:text-slate-300 sm:text-base">
            {isDemo ? copy.demoIntro : copy.intro}
          </p>

          <div className="mt-5 flex flex-col gap-2 min-[430px]:flex-row min-[430px]:items-center">
            <LanguageToggle />
            <ThemeToggle />
            {isDemo ? (
              <a
                href="/"
                className="inline-flex h-[38px] w-fit self-end items-center justify-center whitespace-nowrap rounded-full border border-emerald-300/70 bg-white/80 px-4 text-xs font-semibold leading-none text-emerald-950 shadow-sm backdrop-blur transition hover:border-emerald-500 hover:bg-white min-[430px]:self-auto dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                {copy.backHome}
              </a>
            ) : (
              <a
                href="/auth/logout"
                className="inline-flex h-[38px] w-fit self-end items-center justify-center whitespace-nowrap rounded-full border border-emerald-300/70 bg-white/80 px-4 text-xs font-semibold leading-none text-emerald-950 shadow-sm backdrop-blur transition hover:border-emerald-500 hover:bg-white min-[430px]:self-auto dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                {copy.logout}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-white p-3 shadow-soft dark:border-sky-900/70 dark:from-sky-950/60 dark:to-slate-900/80">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-sky-700">{copy.statsTotal}</p>
            <span className="inline-flex items-center justify-center text-sky-700 dark:text-sky-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <path d="M4.5 7.5h15v10.5a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V7.5Z" />
                <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
                <path d="m9.5 13 1.7 1.7L14.7 11" />
              </svg>
            </span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-sky-950 dark:text-sky-100">{stats.totalRescued}</p>
        </article>
        <article className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-3 shadow-soft dark:border-emerald-900/70 dark:from-emerald-950/50 dark:to-slate-900/80">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{labels.statsRepair}</p>
            <span className="inline-flex items-center justify-center text-emerald-700 dark:text-emerald-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <path d="M21 7.2a4 4 0 0 1-5.2 3.8l-6.9 6.9a2.1 2.1 0 1 1-3-3l6.9-6.9A4 4 0 0 1 16.8 3L14 5.8l1.2 1.2L18 4.2A4 4 0 0 1 21 7.2Z" />
              </svg>
            </span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-emerald-100">{stats.repairCount}</p>
        </article>
        <article className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-white p-3 shadow-soft dark:border-emerald-900/70 dark:from-emerald-950/45 dark:to-slate-900/80">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{labels.statsReuse}</p>
            <span className="inline-flex items-center justify-center text-emerald-700 dark:text-emerald-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <path d="M8 7h7" />
                <path d="m12 4 3 3-3 3" />
                <path d="M16 17H9" />
                <path d="m12 14-3 3 3 3" />
                <path d="M6 10.5A4.5 4.5 0 0 0 10.5 15" />
                <path d="M18 13.5A4.5 4.5 0 0 0 13.5 9" />
              </svg>
            </span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-emerald-100">{stats.reuseCount}</p>
        </article>
        <article className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/80 to-white p-3 shadow-soft dark:border-sky-900/70 dark:from-sky-950/55 dark:to-slate-900/80">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">{labels.statsRecycle}</p>
            <span className="inline-flex items-center justify-center text-sky-700 dark:text-sky-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <path d="m10.2 4.5 1.8-2 1.8 2" />
                <path d="M12 2.5v5" />
                <path d="m18.7 10.1 2.7.7-1.2 2.4" />
                <path d="m21.4 10.8-4.3 2.5" />
                <path d="m5.3 10.1-2.7.7 1.2 2.4" />
                <path d="m2.6 10.8 4.3 2.5" />
                <path d="M8.6 8.7h6.8l3.4 5.8-3.4 5.8H8.6l-3.4-5.8 3.4-5.8Z" />
              </svg>
            </span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-sky-950 dark:text-sky-100">{stats.recycleCount}</p>
        </article>
        <article className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-white p-3 shadow-soft dark:border-amber-900/70 dark:from-amber-950/45 dark:to-slate-900/80">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">{copy.statsBadges}</p>
            <span className="inline-flex items-center justify-center text-amber-700 dark:text-amber-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <circle cx="12" cy="8.5" r="4" />
                <path d="m9.2 12.4-1 7 3.8-2.1 3.8 2.1-1-7" />
                <path d="m12 6.7.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3.9-1.8Z" />
              </svg>
            </span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-amber-950 dark:text-amber-100">{stats.badgesEarned}</p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-emerald-200/70 bg-white/85 p-6 shadow-soft dark:border-slate-700/80 dark:bg-slate-900/75 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-emerald-950 dark:text-slate-100">{labels.registerTitle}</h2>
          <p className="mt-2 text-sm text-emerald-900/80 dark:text-slate-300">{labels.registerDescription}</p>

          <form className="mt-6 space-y-4" onSubmit={handleAnalyze}>
            <label className="block">
              <span className="text-sm font-medium text-emerald-900 dark:text-slate-200">{labels.fieldName}</span>
              <input
                className="mt-1 w-full rounded-xl border border-emerald-200 bg-white/75 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:ring-slate-500"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-emerald-900 dark:text-slate-200">{labels.fieldCategory}</span>
                <select
                  className="mt-1 w-full rounded-xl border border-emerald-200 bg-white/75 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:ring-slate-500"
                  value={form.category}
                  onChange={(event) => setField("category", event.target.value)}
                >
                  {CATEGORY_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {localizeCategory(value, language)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-emerald-900 dark:text-slate-200">{labels.fieldState}</span>
                <select
                  className="mt-1 w-full rounded-xl border border-emerald-200 bg-white/75 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:ring-slate-500"
                  value={form.currentState}
                  onChange={(event) => setField("currentState", event.target.value)}
                >
                  {STATE_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {localizeState(value, language)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-emerald-900 dark:text-slate-200">{labels.fieldAge}</span>
              <input
                className="mt-1 w-full rounded-xl border border-emerald-200 bg-white/75 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:ring-slate-500"
                value={form.approximateAge}
                onChange={(event) => setField("approximateAge", event.target.value)}
                placeholder={labels.fieldAgePlaceholder}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-emerald-900 dark:text-slate-200">{labels.fieldDamage}</span>
              <textarea
                className="mt-1 min-h-28 w-full rounded-xl border border-emerald-200 bg-white/75 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:ring-slate-500"
                value={form.damageDescription}
                onChange={(event) => setField("damageDescription", event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-emerald-900 dark:text-slate-200">{labels.fieldImage}</span>
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                className="mt-1 w-full rounded-xl border border-emerald-200 bg-white/75 px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-800 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                onChange={handleImageFileChange}
              />
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Vista previa"
                  className="mt-2 h-24 w-24 rounded-lg border border-emerald-200 object-cover dark:border-slate-700"
                />
              ) : null}
            </label>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAnalyzing ? copy.analyzing : copy.analyze}
            </button>
          </form>

          {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-200">{error}</p> : null}
          {success ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">{success}</p> : null}
        </article>

        <article ref={resultsRef} className="rounded-3xl border border-sky-200/70 bg-white/85 p-6 shadow-soft dark:border-slate-700/80 dark:bg-slate-900/75 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-sky-950 dark:text-slate-100">{labels.smartTitle}</h2>
          <div className="mt-4 transition-all duration-300">
            {evaluationState === "idle" ? (
              <p className="rounded-xl border border-dashed border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-900/80 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
                Submit an item to receive an AI evaluation.
              </p>
            ) : null}

            {evaluationState === "loading" ? (
              <div className="space-y-4 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 dark:border-slate-600 dark:bg-slate-900/60">
                <p className="text-sm font-medium text-sky-900/90 dark:text-slate-200">Generating intelligent evaluation...</p>
                <div className="space-y-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-sky-200/90 dark:bg-slate-700" />
                  <div className="h-12 w-full animate-pulse rounded-xl bg-sky-200/70 dark:bg-slate-800" />
                  <div className="h-4 w-28 animate-pulse rounded bg-sky-200/90 dark:bg-slate-700" />
                  <div className="h-4 w-full animate-pulse rounded bg-sky-200/70 dark:bg-slate-800" />
                  <div className="h-4 w-11/12 animate-pulse rounded bg-sky-200/70 dark:bg-slate-800" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="h-16 animate-pulse rounded-xl bg-sky-200/70 dark:bg-slate-800" />
                    <div className="h-16 animate-pulse rounded-xl bg-sky-200/70 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            ) : null}

            {evaluationState === "success" && analysis ? (
              <div className="space-y-4 transition-opacity duration-300 ease-out">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-sky-200 bg-sky-50/70 p-4 dark:border-slate-600 dark:bg-slate-900/60">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-700 dark:text-slate-300">{labels.primaryRecommendation}</p>
                  <p className="mt-1 text-lg font-semibold text-sky-950 dark:text-slate-100">{recommendationText(analysis.recommendation, language)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${recommendationClass(analysis.recommendation)}`}>
                  {analysis.recommendation}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-sky-950 dark:text-slate-100">{labels.probableDiagnosis}</h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{analysis.probableDiagnosis}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-sky-950 dark:text-slate-100">{labels.justification}</h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{analysis.justification}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-sky-950 dark:text-slate-100">{labels.suggestedSteps}</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {analysis.suggestedSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-sky-200 p-3 dark:border-slate-600">
                  <p className="text-xs uppercase tracking-wider text-sky-700 dark:text-slate-300">{labels.estimatedDifficulty}</p>
                  <p className="mt-1 text-sm font-medium text-sky-950 dark:text-slate-100">{analysis.difficulty}</p>
                </div>
                <div className="rounded-xl border border-sky-200 p-3 dark:border-slate-600">
                  <p className="text-xs uppercase tracking-wider text-sky-700 dark:text-slate-300">{labels.recoverableLife}</p>
                  <p className="mt-1 text-sm font-medium text-sky-950 dark:text-slate-100">{analysis.recoveredLife}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-sky-950 dark:text-slate-100">{labels.ecoImpact}</h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{analysis.ecoImpact}</p>
              </div>

              <button
                type="button"
                onClick={handleSaveRescue}
                disabled={isSaving}
                className="w-full rounded-xl bg-sky-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? copy.saving : copy.save}
              </button>
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-3xl border border-amber-200/70 bg-white/85 p-6 shadow-soft dark:border-slate-700/80 dark:bg-slate-900/75 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-amber-950 dark:text-slate-100">{copy.historyTitle}</h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
            {history.length} {copy.casesRegistered}
          </span>
        </div>

        {latest.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900/85 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
            {copy.historyEmpty}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {latest.map((entry) => (
              <article key={entry.rescueActionId} className="rounded-2xl border border-amber-200/70 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-900/65">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-amber-950 dark:text-slate-100">{entry.itemName}</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {localizeCategory(entry.category, language)} · {new Date(entry.createdAt).toLocaleDateString(labels.dateLocale)}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${recommendationClass(entry.recommendation)}`}>
                    {recommendationText(entry.recommendation, language)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{entry.probableDiagnosis}</p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
                    {labels.historyStatus}: {localizeStatus(entry.status, language)}
                  </span>
                  {entry.badgeLabel ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
                      {labels.historyBadge}: {entry.badgeLabel}
                    </span>
                  ) : null}
                  {entry.blockchainExplorerUrl ? (
                    <a
                      className="rounded-full bg-sky-100 px-2 py-1 text-sky-700 underline"
                      href={entry.blockchainExplorerUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {labels.historyViewSolana}
                    </a>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">
                      {labels.historyNoBlockchain}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
