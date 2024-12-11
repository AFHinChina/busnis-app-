import React, { useState, useEffect } from 'react';
import { FileExtensionService } from '../../services/storage/FileExtensionService';
import { FileExtensionSelector } from '../Settings/FileExtensionSelector';

export const FirstUseWizard: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);
  const extensionService = FileExtensionService.getInstance();

  useEffect(() => {
    checkFirstUse();
  }, []);

  const checkFirstUse = async () => {
    const isFirstUse = await extensionService.isFirstUse();
    setShowWizard(isFirstUse);
  };

  if (!showWizard) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <FileExtensionSelector
        isFirstUse={true}
        onSelect={() => setShowWizard(false)}
      />
    </div>
  );
};