export type BlueprintStatus = "draft" | "published" | "archived";
export type BlueprintDifficulty = "beginner" | "intermediate" | "advanced";
export type BlueprintType = "construction" | "operations";
export type BlueprintBlock = "strategy" | "operations" | "business" | "customers";

export type StepType =
  | "one_time"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semester"
  | "yearly"
  | "milestone"
  | "custom";

export type StepDifficulty = "easy" | "medium" | "hard";
export type StepPriority = "low" | "normal" | "high";

export type StepResourceType =
  | "pdf"
  | "word"
  | "excel"
  | "powerpoint"
  | "google_docs"
  | "google_sheets"
  | "google_drive"
  | "dropbox"
  | "onedrive"
  | "firebase_storage"
  | "aws_s3"
  | "cloudflare"
  | "youtube"
  | "vimeo"
  | "loom"
  | "spotify"
  | "podcast"
  | "image"
  | "video"
  | "audio"
  | "zip"
  | "code"
  | "website"
  | "api"
  | "form"
  | "template"
  | "presentation"
  | "manual"
  | "other";

export type StepResourceVisibility = "public" | "organization";

export interface StepResource {
  id: string;
  type: StepResourceType;
  title: string;
  description: string;
  provider: string;
  previewUrl: string;
  downloadUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  mimeType: string;
  extension: string;
  size: number;
  metadata: {
    pages: number | null;
    duration: number | null;
    language: string;
  };
  tags: string[];
  visibility: StepResourceVisibility;
}

export interface StepChecklistItem {
  id: string;
  task: string;
  description?: string;
}

export interface StepCompletionRules {
  requiredChecklist: boolean;
  requiredResources: boolean;
  requiredApproval: boolean;
  requiredQuiz: boolean;
}

export interface StepAssistantConfig {
  systemPrompt: string;
  context: string;
  suggestions: string[];
}

export interface StepRecommendedTool {
  name: string;
  url: string;
}

export type StepRegistroFieldType =
  | "text"
  | "textarea"
  | "select"
  | "url"
  | "number"
  | "date"
  | "checkbox"
  | "email"
  | "phone"
  | "multiselect"
  | "color";

export interface StepRegistroField {
  id: string;
  label: string;
  type: StepRegistroFieldType;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  unit?: string;
  required?: boolean;
}

export interface StepContent {
  overview: { title: string; summary: string; body: string };
  objective: { description: string };
  checklist: StepChecklistItem[];
  resources: StepResource[];
  assistant: StepAssistantConfig;
  knowledge: string[];
  whyItMatters?: string;
  bestPractices?: string[];
  commonMistakes?: string[];
  tip?: string;
  recommendedTools?: StepRecommendedTool[];
  registroFields?: StepRegistroField[];
  learnings?: { title: string; description: string }[];
  inspirationalQuote?: string;
}

export interface BlueprintStep {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
  type: StepType;
  estimatedHours: number;
  difficulty: StepDifficulty;
  priority: StepPriority;
  dependencies: string[];
  completionRules: StepCompletionRules;
  content: StepContent;
}

export interface BlueprintPhase {
  id: string;
  title: string;
  description: string;
  objective?: string;
  resources?: StepResource[];
  block?: BlueprintBlock;
  order: number;
  steps: BlueprintStep[];
}

export interface BlueprintSettings {
  allowComments: boolean;
  allowAssistant: boolean;
  allowKnowledge: boolean;
  allowExport: boolean;
  allowMarketplace: boolean;
}

export interface Blueprint {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  version: string;
  author: string;
  language: string;
  difficulty: BlueprintDifficulty;
  estimatedDuration: string;
  tags: string[];
  coverImage: string;
  icon: string;
  status: BlueprintStatus;
  blueprintType?: BlueprintType;
  settings: BlueprintSettings;
  roadmap: BlueprintPhase[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
