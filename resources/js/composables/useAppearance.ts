import { onMounted, ref } from 'vue';

/**
 * Tipos para las apariencias disponibles en la aplicación
 * - Incluye tanto modos claros/oscuros como temas de color específicos
 */
type ThemeMode = 'light' | 'dark' | 'system';
type ColorTheme = 'blue' | 'dark-purple' | 'green-dark' | 'amber' | 'dark-red' | 'default' | 
                  'midnight-ocean' | 'emerald-forest' | 'cyber-neon' | 'sunset-gold' | 'arctic-frost';
type Appearance = ThemeMode | ColorTheme;

/**
 * Actualiza el tema de la aplicación basado en la apariencia seleccionada
 * @param value - La apariencia seleccionada por el usuario
 */
export function updateTheme(value: Appearance) {
    if (typeof window === 'undefined') {
        return;
    }
    
    // Lista de todos los temas de color disponibles
    const colorThemes: ColorTheme[] = [
        'blue', 'dark-purple', 'green-dark', 'amber', 'dark-red', 'default',
        'midnight-ocean', 'emerald-forest', 'cyber-neon', 'sunset-gold', 'arctic-frost'
    ];
    
    // Primero, removemos todas las clases de tema previas
    document.documentElement.classList.remove(...colorThemes);
    
    // Manejo del modo claro/oscuro
    if (value === 'system') {
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme = mediaQueryList.matches ? 'dark' : 'light';
        
        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else if (value === 'light' || value === 'dark') {
        document.documentElement.classList.toggle('dark', value === 'dark');
    }
    
    // Manejo de temas de color específicos
    // Verificamos si el valor es uno de nuestros temas de color
    if (colorThemes.includes(value as ColorTheme)) {
        // Si es un tema de color, lo aplicamos añadiendo la clase correspondiente
        document.documentElement.classList.add(value);
        
        // Por defecto, los temas de color personalizados usan el modo oscuro,
        // excepto que explícitamente se indique lo contrario
        if (value !== 'default') {
            document.documentElement.classList.add('dark');
        }
    }
}

/**
 * Establece una cookie con la apariencia seleccionada
 * @param name - Nombre de la cookie
 * @param value - Valor a almacenar
 * @param days - Duración en días (por defecto 365)
 */
const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }
    
    const maxAge = days * 24 * 60 * 60;
    
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

/**
 * Obtiene el objeto mediaQuery para detectar el tema del sistema
 * @returns Media query list o null si no está disponible
 */
const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)');
};

/**
 * Obtiene la apariencia almacenada en localStorage
 * @returns La apariencia almacenada o null si no hay ninguna
 */
const getStoredAppearance = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    
    return localStorage.getItem('appearance') as Appearance | null;
};

/**
 * Maneja cambios en el tema del sistema operativo
 * Solo aplica cuando el usuario tiene seleccionado 'system'
 */
const handleSystemThemeChange = () => {
    const currentAppearance = getStoredAppearance();
    
    // Solo actualizamos si está usando el tema del sistema o no hay preferencia guardada
    if (!currentAppearance || currentAppearance === 'system') {
        updateTheme('system');
    }
};

/**
 * Inicializa el tema basado en las preferencias guardadas o el sistema
 * Configurar este método para ser llamado durante la carga inicial de la aplicación
 */
export function initializeTheme() {
    if (typeof window === 'undefined') {
        return;
    }
    
    // Inicializa el tema desde la preferencia guardada o usa el sistema por defecto
    const savedAppearance = getStoredAppearance();
    updateTheme(savedAppearance || 'system');
    
    // Configura el listener para cambios en el tema del sistema
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

/**
 * Hook personalizado para gestionar la apariencia de la aplicación
 * @returns Un objeto con el estado actual y método para actualizar la apariencia
 */
export function useAppearance() {
    // Estado reactivo para la apariencia actual
    const appearance = ref<Appearance>('system');
    
    // Validar que la apariencia es válida
    const isValidAppearance = (value: string): value is Appearance => {
        const validAppearances: Appearance[] = [
            'light', 'dark', 'system',  // Modos básicos
            'blue', 'dark-purple', 'green-dark', 'amber', 'dark-red', 'default',  // Temas originales
            'midnight-ocean', 'emerald-forest', 'cyber-neon', 'sunset-gold', 'arctic-frost'  // Nuevos temas
        ];
        return validAppearances.includes(value as Appearance);
    };
    
    onMounted(() => {
        // Inicializa el tema
        initializeTheme();
        
        // Recupera la apariencia guardada
        const savedAppearance = localStorage.getItem('appearance');
        
        // Verifica que la apariencia guardada sea válida antes de aplicarla
        if (savedAppearance && isValidAppearance(savedAppearance)) {
            appearance.value = savedAppearance as Appearance;
        }
    });
    
    /**
     * Actualiza la apariencia de la aplicación
     * @param value - Nueva apariencia a aplicar
     */
    function updateAppearance(value: Appearance) {
        // Validación adicional para asegurar que solo se usan valores permitidos
        if (!isValidAppearance(value)) {
            console.warn(`Apariencia no válida: ${value}. Usando 'system' por defecto.`);
            value = 'system';
        }
        
        // Actualiza el estado reactivo
        appearance.value = value;
        
        // Guarda en localStorage para persistencia del lado del cliente
        localStorage.setItem('appearance', value);
        
        // Guarda en cookie para SSR
        setCookie('appearance', value);
        
        // Aplica el tema en el DOM
        updateTheme(value);
    }
    
    /**
     * Devuelve todas las apariencias disponibles para mostrar en la UI
     * @returns Un objeto con las apariencias organizadas por categorías
     */
    function getAvailableAppearances() {
        return {
            modes: ['light', 'dark', 'system'] as ThemeMode[],
            themes: [
                'default',
                'blue', 
                'dark-purple', 
                'green-dark', 
                'amber', 
                'dark-red',
                'midnight-ocean', 
                'emerald-forest', 
                'cyber-neon', 
                'sunset-gold', 
                'arctic-frost'
            ] as ColorTheme[]
        };
    }
    
    return {
        appearance,
        updateAppearance,
        isValidAppearance,
        getAvailableAppearances
    };
}