"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Template,
  TemplateListItem,
  TemplateCategory,
  CategoryCount,
} from "@/lib/types";
import { TemplateRepository } from "@/lib/api/repositories";

// State
interface TemplateState {
  templates: TemplateListItem[];
  categories: CategoryCount[];
  popularTemplates: TemplateListItem[];
  selectedTemplate: Template | null;
  selectedCategory: TemplateCategory | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  categories: [],
  popularTemplates: [],
  selectedTemplate: null,
  selectedCategory: null,
  searchQuery: "",
  isLoading: false,
  error: null,
};

// Actions
type TemplateAction =
  | { type: "SET_TEMPLATES"; payload: TemplateListItem[] }
  | { type: "SET_CATEGORIES"; payload: CategoryCount[] }
  | { type: "SET_POPULAR_TEMPLATES"; payload: TemplateListItem[] }
  | { type: "SET_SELECTED_TEMPLATE"; payload: Template | null }
  | { type: "SET_SELECTED_CATEGORY"; payload: TemplateCategory | null }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_FILTERS" };

// Reducer
function templateReducer(
  state: TemplateState,
  action: TemplateAction
): TemplateState {
  switch (action.type) {
    case "SET_TEMPLATES":
      return { ...state, templates: action.payload };

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "SET_POPULAR_TEMPLATES":
      return { ...state, popularTemplates: action.payload };

    case "SET_SELECTED_TEMPLATE":
      return { ...state, selectedTemplate: action.payload };

    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "CLEAR_FILTERS":
      return {
        ...state,
        selectedCategory: null,
        searchQuery: "",
      };

    default:
      return state;
  }
}

// Context
interface TemplateContextValue {
  state: TemplateState;
  // Actions
  loadTemplates: (category?: TemplateCategory, search?: string) => Promise<void>;
  loadCategories: () => Promise<void>;
  loadPopularTemplates: (limit?: number) => Promise<void>;
  selectTemplate: (id: number) => Promise<void>;
  clearSelectedTemplate: () => void;
  setCategory: (category: TemplateCategory | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  // Computed
  filteredTemplates: TemplateListItem[];
}

const TemplateContext = createContext<TemplateContextValue | null>(null);

// Provider
export function TemplateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(templateReducer, initialState);

  const loadTemplates = useCallback(
    async (category?: TemplateCategory, search?: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const templates = await TemplateRepository.list({
          category,
          search,
        });
        dispatch({ type: "SET_TEMPLATES", payload: templates });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load templates";
        dispatch({ type: "SET_ERROR", payload: message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    []
  );

  const loadCategories = useCallback(async () => {
    try {
      const categories = await TemplateRepository.getCategories();
      dispatch({ type: "SET_CATEGORIES", payload: categories });
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }, []);

  const loadPopularTemplates = useCallback(async (limit = 10) => {
    try {
      const templates = await TemplateRepository.getPopular(limit);
      dispatch({ type: "SET_POPULAR_TEMPLATES", payload: templates });
    } catch (error) {
      console.error("Failed to load popular templates:", error);
    }
  }, []);

  const selectTemplate = useCallback(async (id: number) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const template = await TemplateRepository.getById(id);
      dispatch({ type: "SET_SELECTED_TEMPLATE", payload: template });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load template";
      dispatch({ type: "SET_ERROR", payload: message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const clearSelectedTemplate = useCallback(() => {
    dispatch({ type: "SET_SELECTED_TEMPLATE", payload: null });
  }, []);

  const setCategory = useCallback((category: TemplateCategory | null) => {
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_FILTERS" });
  }, []);

  // Computed - filter templates based on current state
  const filteredTemplates = state.templates.filter((template) => {
    // Category filter
    if (state.selectedCategory && template.category !== state.selectedCategory) {
      return false;
    }

    // Search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      const matchesName = template.name.toLowerCase().includes(query);
      const matchesDescription = template.description?.toLowerCase().includes(query);
      const matchesTags = template.tags?.some((tag) =>
        tag.toLowerCase().includes(query)
      );

      if (!matchesName && !matchesDescription && !matchesTags) {
        return false;
      }
    }

    return true;
  });

  const value: TemplateContextValue = {
    state,
    loadTemplates,
    loadCategories,
    loadPopularTemplates,
    selectTemplate,
    clearSelectedTemplate,
    setCategory,
    setSearchQuery,
    clearFilters,
    filteredTemplates,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

// Hook
export function useTemplates() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplates must be used within TemplateProvider");
  }
  return context;
}
