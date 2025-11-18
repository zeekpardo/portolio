// Utility functions for managing project images
import type { ImageMetadata } from 'astro';

/**
 * Auto-generates image paths based on project slug
 * @param projectSlug - The project identifier (from filename)
 * @returns Object with cover and ogImage paths
 */
export function getProjectImages(projectSlug: string) {
  const imagePath = `/src/content/projects/images/${projectSlug}`;
  
  return {
    cover: `${imagePath}/cover.webp`,
    ogImage: `${imagePath}/og-cover.webp`
  };
}

/**
 * Dynamic import for project images with fallback
 * @param projectSlug - The project identifier
 * @returns Promise with image metadata or fallback
 */
export async function loadProjectImages(projectSlug: string) {
  const images = import.meta.glob<{ default: ImageMetadata }>('/src/content/projects/images/**/*.{jpeg,jpg,png,gif,webp}');
  
  const coverPath = `/src/content/projects/images/${projectSlug}/cover.webp`;
  const ogPath = `/src/content/projects/images/${projectSlug}/og-cover.webp`;
  
  try {
    const cover = images[coverPath] ? await images[coverPath]() : null;
    const ogImage = images[ogPath] ? await images[ogPath]() : null;
    
    return { cover: cover?.default, ogImage: ogImage?.default };
  } catch (error) {
    console.warn(`Images not found for project: ${projectSlug}`);
    return { cover: null, ogImage: null };
  }
}

/**
 * Check if images exist for a project
 * @param projectSlug - The project identifier
 * @returns Boolean indicating if images exist
 */
export function projectImagesExist(projectSlug: string): boolean {
  const images = import.meta.glob('/src/content/projects/images/**/*.{jpeg,jpg,png,gif,webp}');
  const coverPath = `/src/content/projects/images/${projectSlug}/cover.webp`;
  
  return !!images[coverPath];
}