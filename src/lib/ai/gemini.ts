import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Part } from "@google/generative-ai";

import type { AnalysisResult, ItemFormInput } from "@/lib/domain";
import { getEnv } from "@/lib/env";
import type { AppLanguage } from "@/lib/i18n";
import { getPromptLanguageName } from "@/lib/i18n";
import { analysisSchema } from "@/lib/validation";

const MODEL_CONFIG = {
  temperature: 0.4,
  topP: 0.95,
  topK: 40,
  responseMimeType: "application/json",
};

function buildPrompt(item: ItemFormInput, language: AppLanguage) {
  const targetLanguage = getPromptLanguageName(language);

  return [
    "You are an expert circular economy assistant for damaged household objects.",
    "Analyze the object and provide practical and realistic advice for a user.",
    "Prefer: repair > reuse > recycle > discard (discard only when necessary).",
    `Write every natural-language field in ${targetLanguage}.`,
    `This is mandatory. Do not answer explanations in any other language.`,
    "Keep the recommendation enum values in English only: repair, reuse, recycle, discard.",
    "Return ONLY valid JSON with this exact shape:",
    '{"probableDiagnosis":"string","recommendation":"repair|reuse|recycle|discard","justification":"string","suggestedSteps":["string"],"difficulty":"string","ecoImpact":"string","recoveredLife":"string"}',
    "Rules:",
    "- suggestedSteps must have 3 to 6 concrete action steps.",
    "- Each step should be specific, practical, and ordered for real execution.",
    "- Include realistic tools/materials or reusable resources when relevant.",
    "- If recommendation is reuse, include at least one concrete upcycling idea.",
    "- If recommendation is repair/recycle, include at least one useful public guide or resource link.",
    "- Mention estimated effort and expected outcome in the justification.",
    "- Be realistic and safe. Mention safety risk clearly if needed.",
    "- Keep each field concise and useful.",
    "Object payload:",
    JSON.stringify(item),
  ].join("\n");
}

function parseJsonSafe(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const fencedMatch = text.match(/\{[\s\S]*\}/);

    if (!fencedMatch) {
      throw new Error("Invalid JSON response from Gemini");
    }

    return JSON.parse(fencedMatch[0]);
  }
}

function normalizeRecommendation(value: unknown): AnalysisResult["recommendation"] {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (["repair", "reparar", "fix"].includes(normalized)) {
    return "repair";
  }

  if (["reuse", "reutilizar", "repurpose"].includes(normalized)) {
    return "reuse";
  }

  if (["recycle", "reciclar"].includes(normalized)) {
    return "recycle";
  }

  return "discard";
}

function normalizeSteps(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(Boolean)
      .slice(0, 6);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|\r|\d+\.\s|\-\s/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)
      .slice(0, 6);
  }

  return [];
}

function normalizePayload(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") {
    return raw;
  }

  const data = raw as Record<string, unknown>;
  const suggestedSteps = normalizeSteps(data.suggestedSteps ?? data.suggested_steps);

  return {
    probableDiagnosis:
      data.probableDiagnosis ?? data.probable_diagnosis ?? data.diagnosis ?? "",
    recommendation: normalizeRecommendation(data.recommendation),
    justification: data.justification ?? data.reasoning ?? "",
    suggestedSteps,
    difficulty: data.difficulty ?? data.estimatedDifficulty ?? "",
    ecoImpact: data.ecoImpact ?? data.ecologicalImpact ?? data.environmentalImpact ?? "",
    recoveredLife: data.recoveredLife ?? data.recoverableLife ?? data.potentialRecoveredLife ?? "",
  };
}

function textOrFallback(value: unknown, fallback: string, minLength = 1): string {
  const text = String(value ?? "").trim();
  return text.length >= minLength ? text : fallback;
}

function localizedFallbacks(language: AppLanguage, itemName: string) {
  if (language === "es") {
    return {
      probableDiagnosis: `Desgaste o falla localizada probable en ${itemName} segun los sintomas reportados.`,
      justification: "Esta recomendacion prioriza seguridad, practicidad e impacto de economia circular.",
      ecoImpact:
        "Seguir la accion sugerida reduce residuos, extiende la vida util cuando sea posible y disminuye el impacto ambiental.",
      recycleEcoImpact:
        "Reciclar este objeto mantiene materiales valiosos en circulacion y evita residuos innecesarios en vertedero.",
      recoveredLife: "Al menos varios meses adicionales segun la calidad de ejecucion.",
    };
  }

  if (language === "fr") {
    return {
      probableDiagnosis: `Usure probable ou defaillance localisee sur ${itemName} selon les symptomes signales.`,
      justification: "Cette recommandation privilegie la securite, la praticite et l'impact d'economie circulaire.",
      ecoImpact:
        "Suivre l'action suggeree reduit les dechets, prolonge la duree de vie utile et diminue l'impact environnemental.",
      recycleEcoImpact:
        "Recycler cet objet maintient des materiaux utiles en circulation et evite des dechets inutiles en decharge.",
      recoveredLife: "Au moins plusieurs mois supplementaires selon la qualite d'execution.",
    };
  }

  if (language === "pt") {
    return {
      probableDiagnosis: `Provavel desgaste ou falha localizada em ${itemName} com base nos sintomas reportados.`,
      justification: "Esta recomendacao prioriza seguranca, praticidade e impacto de economia circular.",
      ecoImpact:
        "Seguir a acao sugerida reduz residuos, amplia a vida util quando possivel e diminui o impacto ambiental.",
      recycleEcoImpact:
        "Reciclar este item mantem materiais valiosos em circulacao e evita descarte desnecessario em aterro.",
      recoveredLife: "Pelo menos varios meses adicionais, dependendo da qualidade da execucao.",
    };
  }

  if (language === "zh") {
    return {
      probableDiagnosis: `根据描述症状，${itemName} 可能存在局部磨损或故障。`,
      justification: "该建议优先考虑安全性、可操作性和循环经济影响。",
      ecoImpact: "采取建议行动可减少废弃物、尽可能延长使用寿命，并降低环境影响。",
      recycleEcoImpact: "回收该物品可让有价值材料继续循环，并减少不必要的填埋。",
      recoveredLife: "根据执行质量，通常可额外延长数月使用寿命。",
    };
  }

  if (language === "ar") {
    return {
      probableDiagnosis: `من المرجح وجود تآكل او خلل موضعي في ${itemName} بناء على الاعراض المذكورة.`,
      justification: "هذه التوصية تعطي الاولوية للسلامة والعملية واثر الاقتصاد الدائري.",
      ecoImpact: "اتباع الاجراء المقترح يقلل النفايات ويطيل العمر المفيد قدر الامكان ويخفض الاثر البيئي.",
      recycleEcoImpact: "اعادة تدوير هذا العنصر تبقي المواد القيمة قيد الاستخدام وتمنع نفايات غير ضرورية في المكبات.",
      recoveredLife: "عدة اشهر اضافية على الاقل حسب جودة التنفيذ.",
    };
  }

  if (language === "hi") {
    return {
      probableDiagnosis: `${itemName} में बताए गए लक्षणों के आधार पर स्थानीय घिसाव या खराबी की संभावना है।`,
      justification: "यह सिफारिश सुरक्षा, व्यवहारिकता और सर्कुलर इकोनॉमी प्रभाव को प्राथमिकता देती है।",
      ecoImpact: "सुझाए गए कदम से कचरा कम होता है, उपयोगी जीवन बढ़ता है और पर्यावरणीय प्रभाव घटता है।",
      recycleEcoImpact: "इस वस्तु को रीसायकल करने से उपयोगी सामग्री चक्र में रहती है और लैंडफिल कचरा कम होता है।",
      recoveredLife: "काम की गुणवत्ता के अनुसार कम से कम कुछ अतिरिक्त महीने मिल सकते हैं।",
    };
  }

  return {
    probableDiagnosis: `Likely wear or localized failure in ${itemName} based on the reported symptoms.`,
    justification: "This recommendation prioritizes safety, practicality, and circular economy impact.",
    ecoImpact:
      "Following the suggested action reduces waste, extends useful life where possible, and lowers environmental impact.",
    recycleEcoImpact:
      "Recycling this item keeps valuable materials in circulation and avoids unnecessary landfill waste.",
    recoveredLife: "At least several additional months depending on execution quality.",
  };
}

function enforceMinimumShape(payload: unknown, item: ItemFormInput, language: AppLanguage): AnalysisResult {
  const base = (payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : {}) as Record<string, unknown>;

  const recommended = normalizeRecommendation(base.recommendation);
  const fallbackText = localizedFallbacks(language, item.name);
  const fallbackEcoImpact =
    recommended === "recycle"
      ? fallbackText.recycleEcoImpact
      : fallbackText.ecoImpact;

  const steps = normalizeSteps(base.suggestedSteps);
  const completedSteps = [...steps];

  const defaultSteps = [
    "Inspect the item and prioritize safety before any intervention.",
    "Follow the recommendation using an authorized repair, reuse, or recycling option.",
    "Document the result and keep this rescue in your sustainability log.",
  ];

  for (const step of defaultSteps) {
    if (completedSteps.length >= 3) {
      break;
    }

    completedSteps.push(step);
  }

  return {
    probableDiagnosis: textOrFallback(
      base.probableDiagnosis,
      fallbackText.probableDiagnosis,
      10,
    ),
    recommendation: recommended,
    justification: textOrFallback(
      base.justification,
      fallbackText.justification,
      10,
    ),
    suggestedSteps: completedSteps.slice(0, 6),
    difficulty: textOrFallback(base.difficulty, "medium", 2),
    ecoImpact: textOrFallback(base.ecoImpact, fallbackEcoImpact, 10),
    recoveredLife: textOrFallback(base.recoveredLife, fallbackText.recoveredLife, 4),
  };
}

function translationPrompt(analysis: AnalysisResult, language: AppLanguage) {
  const targetLanguage = getPromptLanguageName(language);

  return [
    "Translate the JSON below into the target language.",
    `Target language: ${targetLanguage}`,
    "Do not change keys and do not add new keys.",
    "Keep recommendation exactly as one of: repair, reuse, recycle, discard.",
    "Translate only natural-language fields.",
    JSON.stringify(analysis),
  ].join("\n");
}

function parseImageDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    data: match[2],
  };
}

function containsUrl(text: string) {
  return /https?:\/\//i.test(text);
}

function getResourceStep(item: ItemFormInput, recommendation: AnalysisResult["recommendation"], language: AppLanguage) {
  const category = String(item.category ?? "").toLowerCase();

  const link =
    recommendation === "repair"
      ? category.includes("textile") || category.includes("footwear")
        ? "https://www.ifixit.com"
        : "https://www.ifixit.com"
      : recommendation === "reuse"
        ? "https://www.instructables.com"
        : recommendation === "recycle"
          ? "https://search.earth911.com"
          : "https://www.epa.gov/recycle";

  const prefixByLanguage: Record<AppLanguage, string> = {
    en: "Guide:",
    es: "Guía:",
    hi: "Guide:",
    zh: "指南:",
    ar: "دليل:",
    fr: "Guide:",
    pt: "Guia:",
  };

  return `${prefixByLanguage[language]} ${link}`;
}

function getReuseIdea(item: ItemFormInput, language: AppLanguage) {
  const category = String(item.category ?? "").toLowerCase();

  if (category.includes("textile") || category.includes("footwear")) {
    const textileIdeas: Record<AppLanguage, string> = {
      en: "Upcycling idea: convert usable fabric sections into cleaning cloths, tote patches, or small organizer pouches.",
      es: "Idea de reutilización: convierte las partes de tela en buen estado en paños de limpieza, parches para bolsos o pequeños organizadores.",
      hi: "Reuse idea: usable fabric ko cleaning cloth, tote patch ya small organizer pouch me convert karein.",
      zh: "再利用建议：将可用布料改造成清洁布、手提袋补丁或小收纳袋。",
      ar: "فكرة لاعادة الاستخدام: حول الاجزاء السليمة من القماش الى قطع تنظيف او رقع للحقائب او حافظات صغيرة.",
      fr: "Idee de reutilisation : transformez les zones de tissu utilisables en chiffons, patchs de sac ou petites pochettes.",
      pt: "Ideia de reutilizacao: transforme partes de tecido aproveitaveis em panos de limpeza, remendos para bolsas ou pequenas necessaires.",
    };

    return textileIdeas[language];
  }

  const genericIdeas: Record<AppLanguage, string> = {
    en: "Upcycling idea: repurpose functional components for secondary household use before disposal.",
    es: "Idea de reutilización: reaprovecha componentes funcionales para un segundo uso en el hogar antes de descartar.",
    hi: "Reuse idea: usable components ko ghar me secondary use ke liye repurpose karein.",
    zh: "再利用建议：在报废前，将可用部件改作家庭二次用途。",
    ar: "فكرة لاعادة الاستخدام: اعد توظيف الاجزاء الصالحة لاستخدام منزلي ثانوي قبل التخلص النهائي.",
    fr: "Idee de reutilisation : reemployez les composants fonctionnels pour un usage secondaire a la maison.",
    pt: "Ideia de reutilizacao: reaproveite componentes funcionais para uso secundario em casa antes do descarte.",
  };

  return genericIdeas[language];
}

function enrichAnalysis(
  analysis: AnalysisResult,
  item: ItemFormInput,
  language: AppLanguage,
): AnalysisResult {
  const nextSteps = [...analysis.suggestedSteps.map((step) => step.trim()).filter(Boolean)];

  if (analysis.recommendation === "repair") {
    const hasToolsHint = nextSteps.some((step) => /tool|material|herramient|materiales|utensil|outil/i.test(step));

    if (!hasToolsHint) {
      const toolStepByLanguage: Record<AppLanguage, string> = {
        en: "Prepare tools/materials first (cleaning cloth, adhesive or thread, basic hand tools) and isolate a safe workspace.",
        es: "Prepara herramientas/materiales primero (paño, adhesivo o hilo, herramientas manuales básicas) y trabaja en un espacio seguro.",
        hi: "Pehle tools/material ready karein (cleaning cloth, adhesive ya thread, basic hand tools) aur safe workspace banayein.",
        zh: "先准备工具和材料（清洁布、胶粘剂或线材、基础手工具），并确保操作环境安全。",
        ar: "جهز الادوات والمواد اولا (قطعة تنظيف، لاصق او خيط، ادوات يدوية بسيطة) واعمل في مساحة آمنة.",
        fr: "Preparez d'abord les outils/materiaux (chiffon, adhesif ou fil, outils manuels de base) et securisez l'espace de travail.",
        pt: "Prepare primeiro as ferramentas/materiais (pano, adesivo ou linha, ferramentas manuais basicas) e garanta um espaco seguro.",
      };

      nextSteps.push(toolStepByLanguage[language]);
    }
  }

  if (analysis.recommendation === "reuse") {
    nextSteps.push(getReuseIdea(item, language));
  }

  if (!["discard"].includes(analysis.recommendation) && !nextSteps.some(containsUrl)) {
    nextSteps.push(getResourceStep(item, analysis.recommendation, language));
  }

  const deduped = Array.from(new Set(nextSteps)).slice(0, 6);

  return {
    ...analysis,
    suggestedSteps: deduped,
  };
}

function repairPromptFromRaw(rawText: string, language: AppLanguage) {
  const targetLanguage = getPromptLanguageName(language);

  return [
    "Rewrite the following model output into STRICT valid JSON.",
    "Do not include markdown fences or extra keys.",
    `Write every natural-language field in ${targetLanguage}.`,
    "Keep recommendation as one of: repair, reuse, recycle, discard.",
    "Use this exact schema:",
    '{"probableDiagnosis":"string","recommendation":"repair|reuse|recycle|discard","justification":"string","suggestedSteps":["string"],"difficulty":"string","ecoImpact":"string","recoveredLife":"string"}',
    "Rules:",
    "- suggestedSteps must contain between 3 and 6 items",
    "- recommendation must be one of the allowed enum values",
    "Source output:",
    rawText,
  ].join("\n");
}

function createFallbackAnalysis(item: ItemFormInput, language: AppLanguage): AnalysisResult {
  const fallbackText = localizedFallbacks(language, item.name);
  const currentState = String(item.currentState ?? "").toLowerCase();
  const damage = String(item.damageDescription ?? "").toLowerCase();

  const recommendation: AnalysisResult["recommendation"] =
    currentState.includes("unsafe")
      ? "discard"
      : currentState.includes("non-functional")
        ? "recycle"
        : damage.includes("hole") || damage.includes("hueco")
        ? "repair"
        : currentState.includes("partially")
          ? "repair"
          : "reuse";

  const stepsByLanguage: Record<AppLanguage, string[]> = {
    en: [
      "Inspect the item and confirm there is no safety risk before handling.",
      "Clean and stabilize the damaged area before repair or reuse.",
      "Apply the recommended action and verify functionality after intervention.",
    ],
    es: [
      "Inspecciona el objeto y confirma que no exista riesgo de seguridad.",
      "Limpia y estabiliza la zona dañada antes de reparar o reutilizar.",
      "Aplica la acción recomendada y verifica funcionamiento al finalizar.",
    ],
    hi: [
      "वस्तु की जांच करें और सुनिश्चित करें कि कोई सुरक्षा जोखिम न हो।",
      "मरम्मत या पुनः उपयोग से पहले क्षतिग्रस्त हिस्से को साफ और स्थिर करें।",
      "सुझाए गए कदम लागू करें और अंत में कार्यक्षमता जांचें।",
    ],
    zh: [
      "先检查物品，确认不存在安全风险。",
      "在修复或再利用前，先清洁并固定受损部位。",
      "执行建议方案后，检查功能是否恢复。",
    ],
    ar: [
      "افحص العنصر وتأكد من عدم وجود مخاطر سلامة قبل التعامل معه.",
      "نظف الجزء المتضرر وثبته قبل الاصلاح او اعادة الاستخدام.",
      "طبق الاجراء المقترح ثم تحقق من عمل العنصر بعد الانتهاء.",
    ],
    fr: [
      "Inspectez l'objet et confirmez l'absence de risque de securite.",
      "Nettoyez et stabilisez la zone endommagee avant reparation ou reutilisation.",
      "Appliquez l'action recommandee puis verifiez le fonctionnement.",
    ],
    pt: [
      "Inspecione o item e confirme que nao ha risco de seguranca.",
      "Limpe e estabilize a area danificada antes de reparar ou reutilizar.",
      "Aplique a acao recomendada e valide o funcionamento ao final.",
    ],
  };

  return {
    probableDiagnosis: fallbackText.probableDiagnosis,
    recommendation,
    justification: fallbackText.justification,
    suggestedSteps: stepsByLanguage[language],
    difficulty: recommendation === "discard" ? "low" : recommendation === "repair" ? "medium" : "low",
    ecoImpact: recommendation === "recycle" ? fallbackText.recycleEcoImpact : fallbackText.ecoImpact,
    recoveredLife: fallbackText.recoveredLife,
  };
}

export async function analyzeWithGemini(
  item: ItemFormInput,
  language: AppLanguage,
  imageDataUrl?: string,
): Promise<AnalysisResult> {
  try {
    const env = getEnv();
    const ai = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: env.GEMINI_MODEL });
    const parsedImage = imageDataUrl ? parseImageDataUrl(imageDataUrl) : null;

    const promptParts: Part[] = [
      { text: buildPrompt(item, language) },
    ];

    if (parsedImage) {
      promptParts.push({
        text: "An image was uploaded by the user. Use it as additional context for the diagnosis.",
      });
      promptParts.push({
        inlineData: {
          mimeType: parsedImage.mimeType,
          data: parsedImage.data,
        },
      });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }],
      generationConfig: MODEL_CONFIG,
    });

    const responseText = result.response.text().trim();
    const parsed = parseJsonSafe(responseText);
    const normalized = enforceMinimumShape(normalizePayload(parsed), item, language);
    const validated = analysisSchema.safeParse(normalized);

    if (!validated.success) {
      const repaired = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: repairPromptFromRaw(responseText, language) }] }],
        generationConfig: MODEL_CONFIG,
      });

      const repairedText = repaired.response.text().trim();
      const repairedParsed = enforceMinimumShape(normalizePayload(parseJsonSafe(repairedText)), item, language);
      const repairedValidated = analysisSchema.safeParse(repairedParsed);

      if (!repairedValidated.success) {
        const reason = repairedValidated.error.issues
          .map((issue) => issue.path.join(".") || "root")
          .join(", ");
        throw new Error(`Gemini response could not be validated: ${reason}`);
      }

      const repairedData = repairedValidated.data;

      if (language === "en") {
        return repairedData;
      }

      try {
        const translated = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: translationPrompt(repairedData, language) }] }],
          generationConfig: MODEL_CONFIG,
        });

        const translatedText = translated.response.text().trim();
        const translatedParsed = enforceMinimumShape(normalizePayload(parseJsonSafe(translatedText)), item, language);
        const translatedValidated = analysisSchema.safeParse(translatedParsed);

        return translatedValidated.success
          ? enrichAnalysis(translatedValidated.data, item, language)
          : enrichAnalysis(repairedData, item, language);
      } catch {
        return enrichAnalysis(repairedData, item, language);
      }
    }

    const data = validated.data;

    if (language === "en") {
      return data;
    }

    try {
      const translated = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: translationPrompt(data, language) }] }],
        generationConfig: MODEL_CONFIG,
      });

      const translatedText = translated.response.text().trim();
      const translatedParsed = enforceMinimumShape(normalizePayload(parseJsonSafe(translatedText)), item, language);
      const translatedValidated = analysisSchema.safeParse(translatedParsed);

      return translatedValidated.success
        ? enrichAnalysis(translatedValidated.data, item, language)
        : enrichAnalysis(data, item, language);
    } catch {
      return enrichAnalysis(data, item, language);
    }
  } catch (error) {
    console.error("Gemini analyze failed, using fallback analysis:", error);
    return enrichAnalysis(createFallbackAnalysis(item, language), item, language);
  }
}
