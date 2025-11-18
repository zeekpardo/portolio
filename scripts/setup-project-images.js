#!/usr/bin/env node

/**
 * Quick setup script for project images
 * Usage: node scripts/setup-project-images.js <project-slug> <image-path>
 * Example: node scripts/setup-project-images.js ai-grant-coach ~/Desktop/workflow.png
 */

import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, extname } from 'path';

const [,, projectSlug, imagePath] = process.argv;

if (!projectSlug || !imagePath) {
  console.log('Usage: node setup-project-images.js <project-slug> <image-path>');
  console.log('Example: node setup-project-images.js ai-grant-coach ~/Desktop/workflow.png');
  process.exit(1);
}

async function setupImages() {
  const projectImageDir = `src/content/projects/images/${projectSlug}`;
  const sourceImage = resolve(imagePath);
  
  if (!existsSync(sourceImage)) {
    console.error(`Source image not found: ${sourceImage}`);
    process.exit(1);
  }
  
  // Create project image directory
  await mkdir(projectImageDir, { recursive: true });
  
  // Copy image as both cover and og-cover
  await copyFile(sourceImage, `${projectImageDir}/cover.webp`);
  await copyFile(sourceImage, `${projectImageDir}/og-cover.webp`);
  
  console.log(`✅ Images set up for project: ${projectSlug}`);
  console.log(`📁 Directory: ${projectImageDir}`);
  console.log(`🖼️  Source: ${sourceImage}`);
}

setupImages().catch(console.error);