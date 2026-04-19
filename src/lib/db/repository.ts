import type { AnalysisResult, HistoryEntry, ItemFormInput, Recommendation, StatsSummary } from "@/lib/domain";
import type { AuthUser } from "@/lib/auth";
import { registerRescueMemo } from "@/lib/blockchain/solana";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { writeBackupEvent } from "@/lib/db/sqlite";

async function ensureProfile(user: AuthUser) {
  const supabase = getSupabaseAdminClient();

  const upsert = await supabase
    .from("profiles")
    .upsert(
      {
        auth0_sub: user.sub,
        email: user.email ?? null,
        name: user.name ?? null,
        avatar_url: user.picture ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "auth0_sub" },
    )
    .select("id")
    .single();

  if (upsert.error || !upsert.data) {
    throw new Error(`Unable to resolve profile: ${upsert.error?.message ?? "unknown"}`);
  }

  return upsert.data.id as string;
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeSteps(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.map((step) => normalizeText(step)).join("|");
}

function isDuplicateRescuePayload(
  row: any,
  item: ItemFormInput,
  analysis: AnalysisResult,
) {
  return (
    normalizeText(row.item?.name) === normalizeText(item.name)
    && normalizeText(row.item?.category) === normalizeText(item.category)
    && normalizeText(row.item?.damage_description) === normalizeText(item.damageDescription)
    && normalizeText(row.item?.approximate_age) === normalizeText(item.approximateAge)
    && normalizeText(row.item?.current_state) === normalizeText(item.currentState)
    && normalizeText(row.analysis?.recommendation) === normalizeText(analysis.recommendation)
    && normalizeText(row.analysis?.probable_diagnosis) === normalizeText(analysis.probableDiagnosis)
    && normalizeText(row.analysis?.justification) === normalizeText(analysis.justification)
    && normalizeText(row.analysis?.difficulty) === normalizeText(analysis.difficulty)
    && normalizeText(row.analysis?.eco_impact) === normalizeText(analysis.ecoImpact)
    && normalizeText(row.analysis?.recovered_life) === normalizeText(analysis.recoveredLife)
    && normalizeSteps(row.analysis?.suggested_steps) === normalizeSteps(analysis.suggestedSteps)
  );
}

function computeBadgeLabel(totalRescues: number) {
  if (totalRescues >= 20) {
    return "Planet Guardian";
  }

  if (totalRescues >= 10) {
    return "Circular Hero";
  }

  if (totalRescues >= 3) {
    return "Rescue Builder";
  }

  return "First Rescue";
}

export async function createRescueCase(params: {
  user: AuthUser;
  item: ItemFormInput;
  analysis: AnalysisResult;
  registerOnChain?: boolean;
}) {
  const supabase = getSupabaseAdminClient();
  const profileId = await ensureProfile(params.user);

  const duplicateProbe = await supabase
    .from("rescue_actions")
    .select(
      `
      id,
      item:items(name,category,damage_description,approximate_age,current_state),
      analysis:analyses(recommendation,probable_diagnosis,justification,suggested_steps,difficulty,eco_impact,recovered_life)
      `,
    )
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (duplicateProbe.error) {
    throw new Error(`Failed duplicate check: ${duplicateProbe.error.message}`);
  }

  const isDuplicate = (duplicateProbe.data ?? []).some((row: any) =>
    isDuplicateRescuePayload(row, params.item, params.analysis),
  );

  if (isDuplicate) {
    throw new Error("Duplicate rescue case");
  }

  const itemInsert = await supabase
    .from("items")
    .insert({
      profile_id: profileId,
      name: params.item.name,
      category: params.item.category,
      damage_description: params.item.damageDescription,
      approximate_age: params.item.approximateAge || null,
      current_state: params.item.currentState,
      image_url: null,
    })
    .select("id,name")
    .single();

  if (itemInsert.error || !itemInsert.data) {
    throw new Error(`Failed to store item: ${itemInsert.error?.message ?? "unknown"}`);
  }

  const analysisInsert = await supabase
    .from("analyses")
    .insert({
      item_id: itemInsert.data.id,
      probable_diagnosis: params.analysis.probableDiagnosis,
      recommendation: params.analysis.recommendation,
      justification: params.analysis.justification,
      suggested_steps: params.analysis.suggestedSteps,
      difficulty: params.analysis.difficulty,
      eco_impact: params.analysis.ecoImpact,
      recovered_life: params.analysis.recoveredLife,
      raw_model: params.analysis,
    })
    .select("id,recommendation")
    .single();

  if (analysisInsert.error || !analysisInsert.data) {
    throw new Error(`Failed to store analysis: ${analysisInsert.error?.message ?? "unknown"}`);
  }

  const actionInsert = await supabase
    .from("rescue_actions")
    .insert({
      profile_id: profileId,
      item_id: itemInsert.data.id,
      analysis_id: analysisInsert.data.id,
      status: "completed",
    })
    .select("id,created_at")
    .single();

  if (actionInsert.error || !actionInsert.data) {
    throw new Error(`Failed to store rescue action: ${actionInsert.error?.message ?? "unknown"}`);
  }

  const actionsCountResult = await supabase
    .from("rescue_actions")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const totalRescues = actionsCountResult.count ?? 1;
  const badgeLabel = computeBadgeLabel(totalRescues);

  const badgeInsert = await supabase
    .from("badges")
    .insert({
      rescue_action_id: actionInsert.data.id,
      profile_id: profileId,
      label: badgeLabel,
      description: `Awarded for completing rescue #${totalRescues}.`,
    })
    .select("id,label")
    .single();

  if (badgeInsert.error || !badgeInsert.data) {
    throw new Error(`Failed to store badge: ${badgeInsert.error?.message ?? "unknown"}`);
  }

  let blockchainRecord: {
    signature: string;
    explorerUrl: string;
  } | null = null;

  if (params.registerOnChain !== false) {
    try {
      const onChain = await registerRescueMemo({
        rescueActionId: actionInsert.data.id,
        recommendation: analysisInsert.data.recommendation,
        itemName: itemInsert.data.name,
      });

      const chainInsert = await supabase.from("blockchain_records").insert({
        rescue_action_id: actionInsert.data.id,
        badge_id: badgeInsert.data.id,
        network: onChain.network,
        transaction_signature: onChain.signature,
        explorer_url: onChain.explorerUrl,
        memo_payload: JSON.parse(onChain.memo),
      });

      if (!chainInsert.error) {
        blockchainRecord = {
          signature: onChain.signature,
          explorerUrl: onChain.explorerUrl,
        };
      }
    } catch {
      blockchainRecord = null;
    }
  }

  writeBackupEvent("rescue_created", params.user.sub, {
    item: params.item,
    analysis: params.analysis,
    rescueActionId: actionInsert.data.id,
    badgeId: badgeInsert.data.id,
    blockchainRecord,
  });

  return {
    rescueActionId: actionInsert.data.id,
    badgeLabel: badgeInsert.data.label,
    createdAt: actionInsert.data.created_at,
    blockchainRecord,
  };
}

export async function getHistory(user: AuthUser): Promise<HistoryEntry[]> {
  const supabase = getSupabaseAdminClient();
  const profileId = await ensureProfile(user);

  const { data, error } = await supabase
    .from("rescue_actions")
    .select(
      `
      id,
      status,
      created_at,
      item:items(id,name,category),
      analysis:analyses(id,recommendation,probable_diagnosis),
      badge:badges(label),
      blockchain:blockchain_records(transaction_signature,explorer_url)
      `,
    )
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to read history: ${error.message}`);
  }

  return (data ?? []).map((row: any) => ({
    rescueActionId: row.id,
    itemId: row.item?.id,
    analysisId: row.analysis?.id,
    itemName: row.item?.name ?? "Unnamed item",
    category: row.item?.category ?? "Unknown",
    recommendation: (row.analysis?.recommendation ?? "discard") as Recommendation,
    status: row.status,
    createdAt: row.created_at,
    probableDiagnosis: row.analysis?.probable_diagnosis ?? "",
    badgeLabel: row.badge?.[0]?.label ?? null,
    blockchainSignature: row.blockchain?.[0]?.transaction_signature ?? null,
    blockchainExplorerUrl: row.blockchain?.[0]?.explorer_url ?? null,
  }));
}

export async function getStats(user: AuthUser): Promise<StatsSummary> {
  const history = await getHistory(user);

  const repairCount = history.filter((entry) => entry.recommendation === "repair").length;
  const reuseCount = history.filter((entry) => entry.recommendation === "reuse").length;
  const recycleCount = history.filter((entry) => entry.recommendation === "recycle").length;
  const discardCount = history.filter((entry) => entry.recommendation === "discard").length;
  const badgesEarned = history.filter((entry) => Boolean(entry.badgeLabel)).length;

  return {
    totalRescued: history.length,
    repairCount,
    reuseCount,
    recycleCount,
    discardCount,
    badgesEarned,
    latestRescues: history.slice(0, 5).map((entry) => ({
      rescueActionId: entry.rescueActionId,
      itemName: entry.itemName,
      recommendation: entry.recommendation,
      createdAt: entry.createdAt,
    })),
  };
}
