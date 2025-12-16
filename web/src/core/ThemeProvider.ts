import { App, ComputedRef, InjectionKey, computed, inject, reactive, watch } from 'vue';

type ThemeMode = 'light' | 'dark';

interface ThemeContext {
  mode: ComputedRef<ThemeMode>;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'app-theme-mode';
const ThemeSymbol: InjectionKey<{
  state: { mode: ThemeMode };
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}> = Symbol('ThemeProvider');

function resolveInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute('data-theme', mode);
}

export function createThemeProvider() {
  const state = reactive<{ mode: ThemeMode }>({
    mode: resolveInitialTheme(),
  });

  const setTheme = (mode: ThemeMode) => {
    state.mode = mode;
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode);
  };

  const toggleTheme = () => setTheme(state.mode === 'light' ? 'dark' : 'light');

  // sync on init and whenever the state changes externally
  applyTheme(state.mode);

  watch(
    () => state.mode,
    (mode) => {
      localStorage.setItem(STORAGE_KEY, mode);
      applyTheme(mode);
    },
    { immediate: false }
  );

  return { state, setTheme, toggleTheme };
}

export function installThemeProvider(app: App) {
  const provider = createThemeProvider();
  app.provide(ThemeSymbol, provider);
  return provider;
}

export function useThemeProvider(): ThemeContext {
  const ctx = inject(ThemeSymbol);
  if (!ctx) {
    throw new Error('ThemeProvider has not been installed.');
  }

  return {
    mode: computed(() => ctx.state.mode),
    toggleTheme: ctx.toggleTheme,
    setTheme: ctx.setTheme,
  };
}

export function useIsDark() {
  const { mode } = useThemeProvider();
  return computed(() => mode.value === 'dark');
}
