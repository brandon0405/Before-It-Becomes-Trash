"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { EvaluationCard } from "@/components/evaluation-card";
import { RescueLogbook } from "@/components/rescue-logbook";
import {
  CATEGORY_LABELS,
  CATEGORY_PROFILES,
  DEMO_CASES,
  ISSUE_TYPE_OPTIONS,
} from "@/lib/mock-data";
import { analyzeObject } from "@/lib/analyzer";
import { useRescueLog } from "@/hooks/use-rescue-log";
import type { CategoryId, EvaluationInput, RescueAssessment } from "@/lib/types";

const INITIAL_FORM: EvaluationInput = {
  objectName: "",
  categoryId: "headphones",
  issueType: "sound",
  details: "",
};

export function BeforeTrashApp() {
  const [form, setForm] = useState<EvaluationInput>(INITIAL_FORM);
  const [assessment, setAssessment] = useState<RescueAssessment | null>(null);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const { entries, hydrated, saveAssessment } = useRescueLog();

  const activeCategory =
    CATEGORY_PROFILES.find((profile) => profile.id === form.categoryId) ??
    CATEGORY_PROFILES[0];

  const handleChange =
    <Key extends keyof EvaluationInput>(field: Key) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleAnalyze = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextAssessment = analyzeObject({
      ...form,
      objectName: form.objectName.trim(),
      details: form.details.trim(),
    });

    setAssessment(nextAssessment);
    setLastSavedId(null);
  };

  const handleUseDemoCase = (index: number) => {
    const demoCase = DEMO_CASES[index];
    const nextForm: EvaluationInput = {
      objectName: demoCase.objectName,
      categoryId: demoCase.categoryId as CategoryId,
      issueType: demoCase.issueType,
      details: demoCase.details,
    };

    setForm(nextForm);
    setAssessment(analyzeObject(nextForm));
    setLastSavedId(null);
  };

  const handleSave = () => {
    if (!assessment || !hydrated) {
      return;
    }

    saveAssessment(assessment);
    setLastSavedId(assessment.id);
  };

  const isSaveDisabled =
    !assessment || !hydrated || (lastSavedId !== null && lastSavedId === assessment.id);

  const saveLabel = !hydrated
    ? "Loading local log..."
    : lastSavedId === assessment?.id
      ? "Saved to rescue log"
      : "Save to rescue log";

  return (
    <main className="page-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />

      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-kicker">Before It Becomes Trash</span>
          <h1>Give damaged everyday objects a better next move than the bin.</h1>
          <p className="hero-lead">
            Describe what is going wrong, choose the object category and get a
            clear recommendation: repair it, repurpose it, recycle it or only
            discard it when nothing safer remains.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#evaluator">
              Evaluate an object
            </a>
            <a className="secondary-button" href="#logbook">
              View rescue log
            </a>
          </div>

          <div className="hero-pills">
            <span>Local-first demo</span>
            <span>Mock heuristics</span>
            <span>Ready for Vercel</span>
          </div>
        </div>

        <aside className="hero-panel">
          <div className="hero-panel-top">
            <span className="eyebrow">Built for a 1-minute demo</span>
            <h2>Clear enough to explain instantly. Useful enough to remember.</h2>
          </div>

          <div className="hero-feature-grid">
            <article className="hero-feature-card">
              <span className="feature-title">Repair before replacement</span>
              <p>
                Lightweight rules help detect issues that usually deserve one
                more attempt before disposal.
              </p>
            </article>
            <article className="hero-feature-card">
              <span className="feature-title">Emotion without guilt</span>
              <p>
                The app focuses on practical next steps and small wins, not
                overwhelming climate dashboards.
              </p>
            </article>
            <article className="hero-feature-card">
              <span className="feature-title">Rescue log included</span>
              <p>
                Every evaluated case can be saved locally and turned into simple
                personal rescue stats.
              </p>
            </article>
          </div>

          <div className="category-cloud">
            {CATEGORY_LABELS.map((category) => (
              <span key={category.value}>{category.label}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className="workspace-section" id="evaluator">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Object evaluator</span>
            <h2>Find the least wasteful next step in under a minute</h2>
          </div>
          <p>
            The engine uses a small internal catalog of common failures and
            practical rescue actions. No API calls. No backend required.
          </p>
        </div>

        <div className="workspace-grid">
          <article className="panel form-panel">
            <form className="analysis-form" onSubmit={handleAnalyze}>
              <label className="field-group">
                <span>Object name or short description</span>
                <input
                  name="objectName"
                  value={form.objectName}
                  onChange={handleChange("objectName")}
                  placeholder="Headphones only work on one side"
                  required
                />
              </label>

              <div className="field-row">
                <label className="field-group">
                  <span>Category</span>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange("categoryId")}
                  >
                    {CATEGORY_LABELS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-group">
                  <span>Problem type</span>
                  <select
                    name="issueType"
                    value={form.issueType}
                    onChange={handleChange("issueType")}
                  >
                    {ISSUE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field-group">
                <span>What is happening?</span>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange("details")}
                  placeholder="Tell the app what failed, where it happens, or what you've already tried."
                  rows={5}
                />
              </label>

              <button className="primary-button" type="submit">
                Analyze this object
              </button>
            </form>

            <div className="sample-block">
              <div className="sample-block-header">
                <span className="eyebrow">Try a sample</span>
                <p>Useful when you need a quick public-demo walkthrough.</p>
              </div>
              <div className="sample-grid">
                {DEMO_CASES.map((demoCase, index) => (
                  <button
                    key={demoCase.objectName}
                    type="button"
                    className="sample-card"
                    onClick={() => handleUseDemoCase(index)}
                  >
                    <strong>{demoCase.objectName}</strong>
                    <span>{demoCase.details}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="category-insight">
              <span className="eyebrow">Current category cues</span>
              <h3>{activeCategory.label}</h3>
              <p>{activeCategory.description}</p>
              <div className="insight-tags">
                {activeCategory.commonFailures.map((failure) => (
                  <span key={failure.label}>{failure.label}</span>
                ))}
              </div>
              <p className="insight-note">{activeCategory.ecoMessage}</p>
            </div>
          </article>

          <EvaluationCard
            assessment={assessment}
            onSave={handleSave}
            canSave={!isSaveDisabled}
            saveLabel={saveLabel}
          />
        </div>
      </section>

      <RescueLogbook entries={entries} hydrated={hydrated} />
    </main>
  );
}
