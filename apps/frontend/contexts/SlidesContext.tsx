"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { Presentation, Slide, SlideUpdate, AgentEvent, ThemeName, SalesPitchInput, TemplateGenerateRequest } from "@/lib/types";
import { SlidesRepository, SalesRepository, TemplateRepository } from "@/lib/api/repositories";

// State
interface SlidesState {
  presentation: Presentation | null;
  currentSlideIndex: number;
  isGenerating: boolean;
  isSaving: boolean;
  error: string | null;
  agentEvents: AgentEvent[];
  currentTheme: ThemeName;
  requestedSlideCount: number | null;
}

const initialState: SlidesState = {
  presentation: null,
  currentSlideIndex: 0,
  isGenerating: false,
  isSaving: false,
  error: null,
  agentEvents: [],
  currentTheme: "neobrutalism",
  requestedSlideCount: null,
};

// Actions
type SlidesAction =
  | { type: "SET_PRESENTATION"; payload: Presentation }
  | { type: "CLEAR_PRESENTATION" }
  | { type: "SET_CURRENT_SLIDE"; payload: number }
  | { type: "UPDATE_SLIDE"; payload: { index: number; data: Partial<Slide> } }
  | { type: "SET_GENERATING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_AGENT_EVENT"; payload: AgentEvent }
  | { type: "CLEAR_AGENT_EVENTS" }
  | { type: "UPDATE_AGENT_EVENT"; payload: { slideNumber: number; args: Record<string, unknown> } }
  | { type: "SET_THEME"; payload: ThemeName }
  | { type: "SET_REQUESTED_SLIDE_COUNT"; payload: number | null };

// Reducer
function slidesReducer(state: SlidesState, action: SlidesAction): SlidesState {
  switch (action.type) {
    case "SET_PRESENTATION":
      return {
        ...state,
        presentation: action.payload,
        currentSlideIndex: 0,
        error: null,
      };

    case "CLEAR_PRESENTATION":
      return {
        ...state,
        presentation: null,
        currentSlideIndex: 0,
      };

    case "SET_CURRENT_SLIDE":
      return {
        ...state,
        currentSlideIndex: action.payload,
      };

    case "UPDATE_SLIDE":
      if (!state.presentation) return state;
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map((slide, i) =>
            i === action.payload.index
              ? { ...slide, ...action.payload.data }
              : slide
          ),
        },
      };

    case "SET_GENERATING":
      return { ...state, isGenerating: action.payload };

    case "SET_SAVING":
      return { ...state, isSaving: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isGenerating: false };

    case "ADD_AGENT_EVENT":
      return { ...state, agentEvents: [...state.agentEvents, action.payload] };

    case "CLEAR_AGENT_EVENTS":
      return { ...state, agentEvents: [] };

    case "UPDATE_AGENT_EVENT":
      return {
        ...state,
        agentEvents: state.agentEvents.map((event) => {
          if (event.type === "tool_call" && event.tool === "add_slide" && event.slide_number === action.payload.slideNumber) {
            // Update the args and also update the slide object
            const newArgs = { ...event.args, ...action.payload.args };
            const updatedSlide = event.slide ? {
              ...event.slide,
              title: newArgs.title as string || event.slide.title,
              subtitle: newArgs.subtitle as string || event.slide.subtitle,
              body: newArgs.body as string || event.slide.body,
              bullets: newArgs.bullets as string[] || event.slide.bullets,
              quote: newArgs.quote as string || event.slide.quote,
              attribution: newArgs.attribution as string || event.slide.attribution,
            } : event.slide;
            return { ...event, args: newArgs, slide: updatedSlide };
          }
          return event;
        }),
      };

    case "SET_THEME":
      return { ...state, currentTheme: action.payload };

    case "SET_REQUESTED_SLIDE_COUNT":
      return { ...state, requestedSlideCount: action.payload };

    default:
      return state;
  }
}

// Context
interface SlidesContextValue {
  state: SlidesState;
  // Actions
  generateSlides: (text: string, theme?: ThemeName, slideCount?: number, title?: string) => Promise<void>;
  generateFromFile: (file: File, theme?: ThemeName, slideCount?: number, title?: string) => Promise<void>;
  generateFromTemplate: (templateId: number, request: TemplateGenerateRequest) => Promise<void>;
  generateSalesPitch: (pitch: SalesPitchInput) => Promise<void>;
  loadPresentation: (id: number) => Promise<void>;
  clearPresentation: () => void;
  startNewPresentation: () => void;
  setCurrentSlide: (index: number) => void;
  updateSlide: (index: number, data: SlideUpdate) => Promise<void>;
  updateAgentEventSlide: (slideNumber: number, args: Record<string, unknown>) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  // Computed
  currentSlide: Slide | null;
  totalSlides: number;
}

const SlidesContext = createContext<SlidesContextValue | null>(null);

// Provider
export function SlidesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(slidesReducer, initialState);

  const handleAgentEvent = useCallback((event: AgentEvent) => {
    dispatch({ type: "ADD_AGENT_EVENT", payload: event });

    // When complete, set the presentation
    if (event.type === "complete" && event.presentation) {
      dispatch({ type: "SET_PRESENTATION", payload: event.presentation });
    }

    // Handle errors
    if (event.type === "error") {
      dispatch({ type: "SET_ERROR", payload: event.message || "Generation failed" });
    }
  }, []);

  const generateSlides = useCallback(
    async (text: string, theme?: ThemeName, slideCount?: number, title?: string) => {
      dispatch({ type: "SET_GENERATING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "CLEAR_AGENT_EVENTS" });
      dispatch({ type: "SET_THEME", payload: theme || "neobrutalism" });
      dispatch({ type: "SET_REQUESTED_SLIDE_COUNT", payload: slideCount || null });

      try {
        await SlidesRepository.generateStream(
          { text, slide_count: slideCount, title, theme },
          handleAgentEvent
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to generate slides";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      } finally {
        dispatch({ type: "SET_GENERATING", payload: false });
      }
    },
    [handleAgentEvent]
  );

  const generateFromFile = useCallback(
    async (file: File, theme?: ThemeName, slideCount?: number, title?: string) => {
      dispatch({ type: "SET_GENERATING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "CLEAR_AGENT_EVENTS" });
      dispatch({ type: "SET_THEME", payload: theme || "neobrutalism" });

      try {
        await SlidesRepository.generateFromFileStream(
          file,
          { slideCount, title, theme },
          handleAgentEvent
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to generate slides from file";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      } finally {
        dispatch({ type: "SET_GENERATING", payload: false });
      }
    },
    [handleAgentEvent]
  );

  const generateSalesPitch = useCallback(
    async (pitch: SalesPitchInput) => {
      dispatch({ type: "SET_GENERATING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "CLEAR_AGENT_EVENTS" });
      dispatch({ type: "SET_THEME", payload: (pitch.theme as ThemeName) || "corporate" });

      try {
        await SalesRepository.generateStream(
          { pitch },
          handleAgentEvent
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to generate sales pitch";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      } finally {
        dispatch({ type: "SET_GENERATING", payload: false });
      }
    },
    [handleAgentEvent]
  );

  const generateFromTemplate = useCallback(
    async (templateId: number, request: TemplateGenerateRequest) => {
      dispatch({ type: "SET_GENERATING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "CLEAR_AGENT_EVENTS" });
      dispatch({ type: "SET_THEME", payload: (request.theme as ThemeName) || "neobrutalism" });

      try {
        await TemplateRepository.generateStream(
          templateId,
          request,
          handleAgentEvent
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to generate from template";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      } finally {
        dispatch({ type: "SET_GENERATING", payload: false });
      }
    },
    [handleAgentEvent]
  );

  const loadPresentation = useCallback(async (id: number) => {
    dispatch({ type: "SET_GENERATING", payload: true });
    try {
      const presentation = await SlidesRepository.getPresentation(id);
      dispatch({ type: "SET_PRESENTATION", payload: presentation });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load presentation";
      dispatch({ type: "SET_ERROR", payload: message });
      throw error;
    } finally {
      dispatch({ type: "SET_GENERATING", payload: false });
    }
  }, []);

  const clearPresentation = useCallback(() => {
    dispatch({ type: "CLEAR_PRESENTATION" });
  }, []);

  const startNewPresentation = useCallback(() => {
    dispatch({ type: "CLEAR_PRESENTATION" });
    dispatch({ type: "CLEAR_AGENT_EVENTS" });
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const setCurrentSlide = useCallback((index: number) => {
    dispatch({ type: "SET_CURRENT_SLIDE", payload: index });
  }, []);

  const updateSlide = useCallback(
    async (index: number, data: SlideUpdate) => {
      if (!state.presentation) return;

      // Optimistic update
      dispatch({ type: "UPDATE_SLIDE", payload: { index, data } });
      dispatch({ type: "SET_SAVING", payload: true });

      try {
        await SlidesRepository.updateSlide(state.presentation.id, index, data);
      } catch (error) {
        // Revert on error - reload the presentation
        const message = error instanceof Error ? error.message : "Failed to save slide";
        dispatch({ type: "SET_ERROR", payload: message });
        // Could reload presentation here to revert
      } finally {
        dispatch({ type: "SET_SAVING", payload: false });
      }
    },
    [state.presentation]
  );

  const nextSlide = useCallback(() => {
    if (!state.presentation) return;
    const next = Math.min(
      state.currentSlideIndex + 1,
      state.presentation.slides.length - 1
    );
    dispatch({ type: "SET_CURRENT_SLIDE", payload: next });
  }, [state.currentSlideIndex, state.presentation]);

  const previousSlide = useCallback(() => {
    const prev = Math.max(state.currentSlideIndex - 1, 0);
    dispatch({ type: "SET_CURRENT_SLIDE", payload: prev });
  }, [state.currentSlideIndex]);

  const updateAgentEventSlide = useCallback((slideNumber: number, args: Record<string, unknown>) => {
    dispatch({ type: "UPDATE_AGENT_EVENT", payload: { slideNumber, args } });
  }, []);

  // Computed values
  const currentSlide = state.presentation?.slides[state.currentSlideIndex] ?? null;
  const totalSlides = state.presentation?.slides.length ?? 0;

  const value: SlidesContextValue = {
    state,
    generateSlides,
    generateFromFile,
    generateFromTemplate,
    generateSalesPitch,
    loadPresentation,
    clearPresentation,
    startNewPresentation,
    setCurrentSlide,
    updateSlide,
    updateAgentEventSlide,
    nextSlide,
    previousSlide,
    currentSlide,
    totalSlides,
  };

  return (
    <SlidesContext.Provider value={value}>{children}</SlidesContext.Provider>
  );
}

// Hook
export function useSlides() {
  const context = useContext(SlidesContext);
  if (!context) {
    throw new Error("useSlides must be used within SlidesProvider");
  }
  return context;
}
