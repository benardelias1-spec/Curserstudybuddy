import { create } from "zustand";
import {
  DEFAULT_PROMPT_SELECTIONS,
  type LayoutOption,
  type PresentationShell,
  type SectionType,
  type StyleFamily,
  type TypographyPreset,
} from "@/lib/prompt-config";

export type PromptBuilderState = {
  sectionType: SectionType;
  layout: LayoutOption;
  presentation: PresentationShell;
  style: StyleFamily;
  typography: TypographyPreset;
  referenceImage?: {
    id: string;
    name: string;
    previewUrl: string;
    file?: File;
  };
};

type PromptBuilderActions = {
  update: (values: Partial<PromptBuilderState>) => void;
  reset: () => void;
};

const initialState: PromptBuilderState = {
  ...DEFAULT_PROMPT_SELECTIONS,
};

export const usePromptBuilderStore = create<
  PromptBuilderState & PromptBuilderActions
>((set) => ({
  ...initialState,
  update: (values) => set((state) => ({ ...state, ...values })),
  reset: () => set(() => ({ ...initialState })),
}));
