"use client";

import { useEffect } from 'react';
import { useExperimentStore } from '@/store/experimentStore';

export function ClientMigration() {
  const { migrateExperiments } = useExperimentStore();

  useEffect(() => {
    // Migrate old model names to new ones on app load
    migrateExperiments();
  }, [migrateExperiments]);

  // This component doesn't render anything
  return null;
} 