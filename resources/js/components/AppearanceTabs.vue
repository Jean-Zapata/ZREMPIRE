<script setup lang="ts">
import { useAppearance } from '@/composables/useAppearance';
import { Monitor, Moon, Sun, Droplet, Star, Leaf, Flame, Heart, Flower, CloudRain, Cloud, Waves } from 'lucide-vue-next';

interface Props {
    class?: string;
}

const { class: containerClass = '' } = defineProps<Props>();

const { appearance, updateAppearance } = useAppearance();

// Agruparemos los temas por categorías para mostrarlos en columnas
const themeGroups = [
    // Columna 1: Temas base
    [
        { value: 'light', Icon: Sun, label: 'Light' },
        { value: 'dark', Icon: Moon, label: 'Dark' },
        { value: 'system', Icon: Monitor, label: 'System' },
    ],
    // Columna 2: Temas originales
    [
        { value: 'blue', Icon: Droplet, label: 'Blue' },
        { value: 'dark-purple', Icon: Star, label: 'Dark Purple' },
        { value: 'green-dark', Icon: Leaf, label: 'Green Dark' },
        { value: 'amber', Icon: Flame, label: 'Amber' },
        { value: 'dark-red', Icon: Heart, label: 'Dark Red' },
    ],
    // Columna 3: Temas nuevos
    [
        { value: 'midnight-ocean', Icon: Waves, label: 'Midnight Ocean' },
        { value: 'emerald-forest', Icon: Leaf, label: 'Emerald Forest' },
        { value: 'cyber-neon', Icon: Star, label: 'Cyber Neon' },
        { value: 'sunset-gold', Icon: Flame, label: 'Sunset Gold' },
        { value: 'arctic-frost', Icon: CloudRain, label: 'Arctic Frost' },
    ]
] as const;
</script>

<template>
    <div :class="['flex flex-row gap-2 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800', containerClass]">
        <!-- Iteramos sobre cada grupo (columna) -->
        <div v-for="(group, groupIndex) in themeGroups" :key="'group-'+groupIndex" class="flex flex-col gap-1">
            <!-- Iteramos sobre los temas de cada grupo -->
            <button
                v-for="{ value, Icon, label } in group"
                :key="value"
                @click="updateAppearance(value)"
                :class="[
                    'flex items-center rounded-md px-3 py-1.5 transition-colors',
                    appearance === value
                        ? 'bg-white shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                        : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                ]"
            >
                <component :is="Icon" class="h-4 w-4" />
                <span class="ml-1.5 text-sm">{{ label }}</span>
            </button>
        </div>
    </div>
</template>