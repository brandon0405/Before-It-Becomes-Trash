import type { AnalysisResult, HistoryEntry, ItemFormInput, StatsSummary } from "@/lib/domain";
import type { AppLanguage } from "@/lib/i18n";

export const DEMO_USER_NAME = "Demo Judge";

export const DEMO_HISTORY: HistoryEntry[] = [
  {
    rescueActionId: "demo-ra-1",
    itemId: "demo-item-1",
    analysisId: "demo-analysis-1",
    itemName: "Bluetooth Headphones",
    category: "Electronics",
    recommendation: "repair",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    probableDiagnosis: "Likely cable stress near the left ear cup causing intermittent channel loss.",
    badgeLabel: "Rescue Builder",
    blockchainSignature: "5nYf8xQp2vDemoSig0001",
    blockchainExplorerUrl: "https://explorer.solana.com/tx/5nYf8xQp2vDemoSig0001?cluster=devnet",
  },
  {
    rescueActionId: "demo-ra-2",
    itemId: "demo-item-2",
    analysisId: "demo-analysis-2",
    itemName: "Kitchen Blender",
    category: "Home appliance",
    recommendation: "reuse",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(),
    probableDiagnosis: "Motor is weak for heavy loads, but jar and body are still useful.",
    badgeLabel: "Rescue Builder",
    blockchainSignature: null,
    blockchainExplorerUrl: null,
  },
  {
    rescueActionId: "demo-ra-3",
    itemId: "demo-item-3",
    analysisId: "demo-analysis-3",
    itemName: "Winter Jacket",
    category: "Textiles",
    recommendation: "recycle",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 78).toISOString(),
    probableDiagnosis: "Outer shell is heavily worn, but material can still be recovered via textile recycling.",
    badgeLabel: "First Rescue",
    blockchainSignature: null,
    blockchainExplorerUrl: null,
  },
];

export const DEMO_STATS: StatsSummary = {
  totalRescued: DEMO_HISTORY.length,
  repairCount: DEMO_HISTORY.filter((entry) => entry.recommendation === "repair").length,
  reuseCount: DEMO_HISTORY.filter((entry) => entry.recommendation === "reuse").length,
  recycleCount: DEMO_HISTORY.filter((entry) => entry.recommendation === "recycle").length,
  discardCount: DEMO_HISTORY.filter((entry) => entry.recommendation === "discard").length,
  badgesEarned: DEMO_HISTORY.filter((entry) => Boolean(entry.badgeLabel)).length,
  latestRescues: DEMO_HISTORY.slice(0, 5).map((entry) => ({
    rescueActionId: entry.rescueActionId,
    itemName: entry.itemName,
    recommendation: entry.recommendation,
    createdAt: entry.createdAt,
  })),
};

type DemoText = {
  probableDiagnosis: (itemName: string) => string;
  repairJustification: string;
  repairSteps: string[];
  repairEcoImpact: string;
  repairRecoveredLife: string;
  electronicsDiagnosis: (itemName: string) => string;
  electronicsJustification: string;
  electronicsSteps: string[];
  electronicsEcoImpact: string;
  electronicsRecoveredLife: string;
  genericDiagnosis: (itemName: string) => string;
  genericJustification: string;
  genericSteps: string[];
  genericEcoImpact: string;
  genericRecoveredLife: string;
};

const DEMO_TEXT: Record<AppLanguage, DemoText> = {
  en: {
    probableDiagnosis: (itemName) => `Localized wear detected on ${itemName}; seams or high-friction zones are likely failing first.`,
    repairJustification: "Repair is practical with low-cost materials and can quickly extend useful life while avoiding early disposal.",
    repairSteps: [
      "Clean and dry the damaged area before intervention.",
      "Reinforce seams or weak zones using heavy thread or textile adhesive patch.",
      "Apply a protective layer to reduce future friction and verify durability for daily use.",
    ],
    repairEcoImpact: "A small textile repair avoids premature waste and lowers replacement demand.",
    repairRecoveredLife: "6-12 additional months",
    electronicsDiagnosis: (itemName) => `Likely component-level fault in ${itemName}, not full end-of-life failure.`,
    electronicsJustification: "A focused repair can restore functionality with lower cost and impact than replacement.",
    electronicsSteps: [
      "Run a basic safety check and disconnect power before handling.",
      "Inspect cable, connector, and external moving parts for visible stress or looseness.",
      "Replace the failing low-cost part or use a verified repair guide, then test under normal load.",
    ],
    electronicsEcoImpact: "Repair keeps mixed materials in use and reduces e-waste generation.",
    electronicsRecoveredLife: "8-18 additional months",
    genericDiagnosis: (itemName) => `${itemName} shows partial degradation but still has recoverable value for circular use.`,
    genericJustification: "A reuse path is fast, safe, and practical when full repair is not necessary.",
    genericSteps: [
      "Stabilize any damaged area and remove unsafe sharp or loose parts.",
      "Repurpose the object for secondary household use based on remaining functionality.",
      "Document the new use and monitor condition to delay final disposal.",
    ],
    genericEcoImpact: "Reuse extends product life and delays entry into landfill streams.",
    genericRecoveredLife: "4-10 additional months",
  },
  es: {
    probableDiagnosis: (itemName) => `Se detecta desgaste localizado en ${itemName}; las costuras o zonas de alta fricción probablemente fallan primero.`,
    repairJustification: "Reparar es práctico con materiales de bajo costo y puede extender rápidamente la vida útil evitando el descarte temprano.",
    repairSteps: [
      "Limpia y seca el área dañada antes de intervenir.",
      "Refuerza costuras o zonas débiles con hilo resistente o parche textil adhesivo.",
      "Aplica una capa de protección para reducir fricción futura y verifica durabilidad en uso diario.",
    ],
    repairEcoImpact: "Una reparación textil pequeña evita residuos prematuros y reduce demanda de reemplazo.",
    repairRecoveredLife: "6-12 meses adicionales",
    electronicsDiagnosis: (itemName) => `Probable falla a nivel de componente en ${itemName}, no fin de vida total.`,
    electronicsJustification: "Una reparación puntual puede recuperar funcionalidad con menor costo e impacto que reemplazar.",
    electronicsSteps: [
      "Haz una revisión básica de seguridad y desconecta la energía antes de manipular.",
      "Inspecciona cable, conector y piezas móviles externas buscando desgaste o holgura.",
      "Reemplaza la pieza económica que falla o usa una guía de reparación verificada y luego prueba en uso normal.",
    ],
    electronicsEcoImpact: "Reparar mantiene materiales mixtos en uso y reduce generación de residuos electrónicos.",
    electronicsRecoveredLife: "8-18 meses adicionales",
    genericDiagnosis: (itemName) => `${itemName} presenta degradación parcial pero todavía conserva valor recuperable para uso circular.`,
    genericJustification: "La reutilización es rápida, segura y práctica cuando no hace falta una reparación completa.",
    genericSteps: [
      "Estabiliza cualquier zona dañada y retira partes sueltas o filosas inseguras.",
      "Reutiliza el objeto para un uso secundario en el hogar según su funcionalidad restante.",
      "Documenta el nuevo uso y monitorea su estado para retrasar el descarte final.",
    ],
    genericEcoImpact: "La reutilización extiende la vida del producto y retrasa su entrada al vertedero.",
    genericRecoveredLife: "4-10 meses adicionales",
  },
  hi: {
    probableDiagnosis: (itemName) => `${itemName} me localized wear dikh raha hai; seam ya high-friction zones pehle fail ho sakte hain.`,
    repairJustification: "Low-cost materials ke saath repair practical hai aur jaldi useful life badha sakta hai.",
    repairSteps: [
      "Intervention se pehle damaged area ko clean aur dry karein.",
      "Heavy thread ya textile adhesive patch se weak seams ko reinforce karein.",
      "Future friction kam karne ke liye protective layer lagayen aur daily use me durability check karein.",
    ],
    repairEcoImpact: "Chhota textile repair early waste ko rokta hai aur replacement demand kam karta hai.",
    repairRecoveredLife: "6-12 additional months",
    electronicsDiagnosis: (itemName) => `${itemName} me likely component-level fault hai, full end-of-life failure nahi.`,
    electronicsJustification: "Focused repair se replacement ke muqable kam cost aur impact me functionality wapas aa sakti hai.",
    electronicsSteps: [
      "Basic safety check karein aur handle karne se pehle power disconnect karein.",
      "Cable, connector aur external moving parts me stress ya looseness inspect karein.",
      "Low-cost failing part replace karein ya verified repair guide use karke normal load par test karein.",
    ],
    electronicsEcoImpact: "Repair mixed materials ko use me rakhta hai aur e-waste kam karta hai.",
    electronicsRecoveredLife: "8-18 additional months",
    genericDiagnosis: (itemName) => `${itemName} me partial degradation hai lekin circular use ke liye recoverable value abhi bhi hai.`,
    genericJustification: "Jab full repair zaruri na ho to reuse fast, safe aur practical path hai.",
    genericSteps: [
      "Damaged area stabilize karein aur unsafe sharp ya loose parts hata dein.",
      "Bachi hui functionality ke basis par object ko secondary household use me repurpose karein.",
      "Naye use ko document karein aur condition monitor karein taaki final disposal delay ho.",
    ],
    genericEcoImpact: "Reuse product life badhata hai aur landfill me jane ko delay karta hai.",
    genericRecoveredLife: "4-10 additional months",
  },
  zh: {
    probableDiagnosis: (itemName) => `${itemName} 出现局部磨损，缝线或高摩擦区域可能最先失效。`,
    repairJustification: "低成本材料即可完成修复，可快速延长使用寿命并避免过早丢弃。",
    repairSteps: [
      "处理前先清洁并彻底干燥受损区域。",
      "使用耐用线材或纺织补片加固薄弱缝线和受力点。",
      "增加保护层以降低后续摩擦，并在日常使用中验证耐久性。",
    ],
    repairEcoImpact: "小规模纺织修复可减少过早废弃并降低替换需求。",
    repairRecoveredLife: "可额外使用 6-12 个月",
    electronicsDiagnosis: (itemName) => `${itemName} 更可能是部件级故障，而非整体寿命结束。`,
    electronicsJustification: "针对性修复通常比直接更换成本更低、环境影响更小。",
    electronicsSteps: [
      "先完成基础安全检查，并在操作前断电。",
      "检查线缆、接口和外部活动部件是否有磨损或松动。",
      "更换故障低成本部件或按可靠维修指南操作后进行负载测试。",
    ],
    electronicsEcoImpact: "维修可延长混合材料部件使用周期并减少电子垃圾。",
    electronicsRecoveredLife: "可额外使用 8-18 个月",
    genericDiagnosis: (itemName) => `${itemName} 存在部分退化，但仍有可回收利用价值。`,
    genericJustification: "当不需要完整维修时，再利用是快速、安全且实用的路径。",
    genericSteps: [
      "先稳定受损区域并移除不安全的尖锐或松动部件。",
      "根据剩余功能将物品改作家庭二次用途。",
      "记录新用途并持续观察状态，尽量延后最终报废。",
    ],
    genericEcoImpact: "再利用可延长产品寿命并推迟进入填埋流程。",
    genericRecoveredLife: "可额外使用 4-10 个月",
  },
  ar: {
    probableDiagnosis: (itemName) => `يوجد تآكل موضعي في ${itemName} ومن المرجح ان تفشل مناطق الاحتكاك العالي او الخياطة اولا.`,
    repairJustification: "الاصلاح عملي بمواد منخفضة التكلفة ويمكنه اطالة العمر المفيد بسرعة وتجنب التخلص المبكر.",
    repairSteps: [
      "نظف وجفف المنطقة المتضررة قبل اي تدخل.",
      "عزز الخياطة او المناطق الضعيفة بخيط قوي او رقعة نسيج لاصقة.",
      "اضف طبقة حماية لتقليل الاحتكاك لاحقا وتحقق من المتانة في الاستخدام اليومي.",
    ],
    repairEcoImpact: "اصلاح نسيجي بسيط يقلل النفايات المبكرة ويخفض الحاجة للاستبدال.",
    repairRecoveredLife: "من 6 الى 12 شهرا اضافيا",
    electronicsDiagnosis: (itemName) => `الخلل في ${itemName} غالبا على مستوى مكون وليس نهاية عمر كاملة للجهاز.`,
    electronicsJustification: "الاصلاح الموجه يعيد الوظيفة بكلفة واثر اقل من الاستبدال الكامل.",
    electronicsSteps: [
      "اجر فحص سلامة اساسي وافصل الكهرباء قبل التعامل.",
      "افحص الكابل والموصل والاجزاء المتحركة الخارجية بحثا عن ارتخاء او تآكل.",
      "استبدل الجزء منخفض التكلفة المعطل او اتبع دليلا موثوقا ثم اختبر تحت حمل طبيعي.",
    ],
    electronicsEcoImpact: "الاصلاح يبقي المواد المختلطة قيد الاستخدام ويقلل النفايات الالكترونية.",
    electronicsRecoveredLife: "من 8 الى 18 شهرا اضافيا",
    genericDiagnosis: (itemName) => `${itemName} يظهر تدهورا جزئيا لكنه ما زال يملك قيمة قابلة للاستعادة في الاستخدام الدائري.`,
    genericJustification: "اعادة الاستخدام خيار سريع وآمن وعملي عندما لا تكون هناك حاجة لاصلاح كامل.",
    genericSteps: [
      "ثبت المناطق المتضررة وازل الاجزاء الحادة او المفكوكة غير الآمنة.",
      "اعد توظيف العنصر لاستخدام منزلي ثانوي حسب الوظيفة المتبقية.",
      "وثق الاستخدام الجديد وراقب الحالة لتأخير التخلص النهائي.",
    ],
    genericEcoImpact: "اعادة الاستخدام تطيل عمر المنتج وتؤخر وصوله الى المكب.",
    genericRecoveredLife: "من 4 الى 10 اشهر اضافية",
  },
  fr: {
    probableDiagnosis: (itemName) => `Usure localisee detectee sur ${itemName} ; les coutures ou zones de forte friction sont probablement les premieres a ceder.`,
    repairJustification: "La reparation est pratique avec des materiaux peu couteux et peut prolonger rapidement la duree de vie utile.",
    repairSteps: [
      "Nettoyez et sechez la zone endommagee avant intervention.",
      "Renforcez les coutures ou zones faibles avec un fil solide ou un patch textile adhesif.",
      "Ajoutez une couche de protection pour reduire la friction future et verifiez la durabilite en usage quotidien.",
    ],
    repairEcoImpact: "Une petite reparation textile evite des dechets prematures et limite le remplacement.",
    repairRecoveredLife: "6 a 12 mois supplementaires",
    electronicsDiagnosis: (itemName) => `Defaut probable au niveau composant sur ${itemName}, plutot qu'une fin de vie complete.`,
    electronicsJustification: "Une reparation ciblee peut restaurer la fonction avec moins de cout et d'impact qu'un remplacement.",
    electronicsSteps: [
      "Effectuez une verification de securite de base et debranchez l'alimentation avant manipulation.",
      "Inspectez cable, connecteur et parties mobiles externes pour detecter usure ou jeu.",
      "Remplacez la piece defaillante a faible cout ou suivez un guide de reparation fiable puis testez en charge normale.",
    ],
    electronicsEcoImpact: "La reparation maintient les materiaux mixtes en circulation et reduit les dechets electroniques.",
    electronicsRecoveredLife: "8 a 18 mois supplementaires",
    genericDiagnosis: (itemName) => `${itemName} presente une degradation partielle mais conserve une valeur recuperable pour un usage circulaire.`,
    genericJustification: "La reutilisation est rapide, sure et pratique lorsqu'une reparation complete n'est pas necessaire.",
    genericSteps: [
      "Stabilisez les zones endommagees et retirez les parties dangereuses, pointues ou desserrees.",
      "Reaffectez l'objet a un usage domestique secondaire selon sa fonctionnalite restante.",
      "Documentez ce nouvel usage et surveillez l'etat pour retarder l'elimination finale.",
    ],
    genericEcoImpact: "La reutilisation prolonge la duree de vie et retarde l'entree en decharge.",
    genericRecoveredLife: "4 a 10 mois supplementaires",
  },
  pt: {
    probableDiagnosis: (itemName) => `Desgaste localizado detectado em ${itemName}; costuras ou areas de alta friccao provavelmente falham primeiro.`,
    repairJustification: "Reparar e pratico com materiais de baixo custo e pode estender rapidamente a vida util.",
    repairSteps: [
      "Limpe e seque a area danificada antes da intervencao.",
      "Reforce costuras ou zonas fracas com linha resistente ou adesivo textil.",
      "Aplique uma camada de protecao para reduzir friccao futura e valide a durabilidade no uso diario.",
    ],
    repairEcoImpact: "Um pequeno reparo textil evita descarte precoce e reduz necessidade de substituicao.",
    repairRecoveredLife: "6-12 meses adicionais",
    electronicsDiagnosis: (itemName) => `Falha provavel em nivel de componente em ${itemName}, nao uma falha total de fim de vida.`,
    electronicsJustification: "Um reparo focado pode restaurar funcionalidade com menor custo e impacto do que substituir.",
    electronicsSteps: [
      "Faca uma verificacao basica de seguranca e desconecte a energia antes de manusear.",
      "Inspecione cabo, conector e partes moveis externas em busca de desgaste ou folga.",
      "Substitua a peca de baixo custo com defeito ou siga um guia confiavel e teste em carga normal.",
    ],
    electronicsEcoImpact: "Reparar mantem materiais mistos em uso e reduz geracao de lixo eletronico.",
    electronicsRecoveredLife: "8-18 meses adicionais",
    genericDiagnosis: (itemName) => `${itemName} apresenta degradacao parcial, mas ainda possui valor recuperavel para uso circular.`,
    genericJustification: "Reutilizar e um caminho rapido, seguro e pratico quando um reparo completo nao e necessario.",
    genericSteps: [
      "Estabilize areas danificadas e remova partes soltas ou cortantes inseguras.",
      "Reaproveite o objeto para uso domestico secundario conforme a funcionalidade restante.",
      "Documente o novo uso e monitore a condicao para adiar o descarte final.",
    ],
    genericEcoImpact: "A reutilizacao estende a vida do produto e adia a entrada em aterro.",
    genericRecoveredLife: "4-10 meses adicionais",
  },
};

export function buildDemoAnalysis(item: ItemFormInput, language: AppLanguage): AnalysisResult {
  const text = DEMO_TEXT[language] ?? DEMO_TEXT.es;
  const normalizedCategory = item.category.toLowerCase();

  if (normalizedCategory.includes("textile") || normalizedCategory.includes("footwear")) {
    return {
      probableDiagnosis: text.probableDiagnosis(item.name),
      recommendation: "repair",
      justification: text.repairJustification,
      suggestedSteps: text.repairSteps,
      difficulty: "easy",
      ecoImpact: text.repairEcoImpact,
      recoveredLife: text.repairRecoveredLife,
    };
  }

  if (normalizedCategory.includes("electronic") || normalizedCategory.includes("appliance")) {
    return {
      probableDiagnosis: text.electronicsDiagnosis(item.name),
      recommendation: "repair",
      justification: text.electronicsJustification,
      suggestedSteps: text.electronicsSteps,
      difficulty: "medium",
      ecoImpact: text.electronicsEcoImpact,
      recoveredLife: text.electronicsRecoveredLife,
    };
  }

  return {
    probableDiagnosis: text.genericDiagnosis(item.name),
    recommendation: "reuse",
    justification: text.genericJustification,
    suggestedSteps: text.genericSteps,
    difficulty: "easy",
    ecoImpact: text.genericEcoImpact,
    recoveredLife: text.genericRecoveredLife,
  };
}
