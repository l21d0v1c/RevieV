"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface CardNavigationButtonsProps {
  onShowQuarterly: () => void;
  onShowMonthly: () => void;
  onShowDaily: () => void;
  currentDate: Date;
}

const CardNavigationButtons: React.FC<CardNavigationButtonsProps> = ({
  onShowQuarterly,
  onShowMonthly,
  onShowDaily,
  currentDate,
}) => {
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1; // 1-indexed quarter

  // Classes réactives pour les boutons
  const buttonClasses = "bg-silver-medium hover:bg-silver-medium-hover text-white hover:text-black font-satisfy " +
                        "text-lg sm:text-xl md:text-2xl lg:text-xl " + // Taille de texte réactive légèrement diminuée
                        "px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-16 lg:py-8 " + // Padding réactif (inchangé)
                        "[clip-path:polygon(50%_0%,_100%_50%,_50%_100%,_0%_50%)] " +
                        "[box-shadow:0_0_0_2px_white]";

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-10 p-4 sm:p-6 lg:p-10 bg-transparent rounded-b-lg shadow-lg z-30 relative">
      <Button
        onClick={onShowQuarterly}
        className={buttonClasses}
      >
        {currentQuarter}/4
      </Button>
      <Button
        onClick={onShowMonthly}
        className={buttonClasses}
      >
        {currentMonthName}
      </Button>
      <Button
        onClick={onShowDaily}
        className={buttonClasses}
      >
        Jour {currentDate.getDate()}
      </Button>
    </div>
  );
};

export default CardNavigationButtons;
