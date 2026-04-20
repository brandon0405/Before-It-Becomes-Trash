import { z } from "zod";

import { SUPPORTED_LANGUAGES } from "@/lib/i18n";

export const itemFormSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.string().min(2).max(60),
  damageDescription: z.string().min(6).max(1500),
  approximateAge: z.string().max(120).optional().or(z.literal("")),
  currentState: z.string().min(2).max(80),
});

export const recommendationSchema = z.enum([
  "repair",
  "reuse",
  "recycle",
  "discard",
]);

export const analysisSchema = z.object({
  probableDiagnosis: z.string().min(10).max(600),
  recommendation: recommendationSchema,
  justification: z.string().min(10).max(700),
  suggestedSteps: z.array(z.string().min(5).max(300)).min(3).max(6),
  difficulty: z.string().min(2).max(50),
  ecoImpact: z.string().min(10).max(600),
  recoveredLife: z.string().min(4).max(140),
});

export const analyzeRequestSchema = z.object({
  item: itemFormSchema,
  language: z.enum(SUPPORTED_LANGUAGES).default("es"),
  imageDataUrl: z
    .string()
    .max(12_000_000)
    .refine((value) => value.startsWith("data:image/"), "Invalid image data URL")
    .optional(),
});

export const rescueCreateRequestSchema = z.object({
  item: itemFormSchema,
  analysis: analysisSchema,
  registerOnChain: z.boolean().optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type RescueCreateRequest = z.infer<typeof rescueCreateRequestSchema>;
