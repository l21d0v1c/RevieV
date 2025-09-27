"use client";

import React, { useState, useEffect } from 'react';

interface BackgroundCarouselProps {
  images: string[];
  interval?: number; // en millisecondes, par défaut 10000 (10 secondes)
}

const BackgroundCarousel: React.FC<BackgroundCarouselProps> = ({ images, interval = 10000 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayedImageUrl, setDisplayedImageUrl] = useState<string>(''); // L'image actuellement visible
  const [nextImageUrl, setNextImageUrl] = useState<string>(''); // L'image qui va apparaître
  const [nextImageOpacity, setNextImageOpacity] = useState(0); // Opacité de la prochaine image

  const [allImagesPreloaded, setAllImagesPreloaded] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  // Effet pour précharger toutes les images et filtrer celles qui échouent
  useEffect(() => {
    if (images.length === 0) {
      setAllImagesPreloaded(true);
      setAvailableImages([]);
      return;
    }

    let loadedCount = 0;
    const successfullyLoaded: string[] = [];

    const checkCompletion = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        setAvailableImages(successfullyLoaded);
        setAllImagesPreloaded(true);
        if (successfullyLoaded.length > 0) {
          setDisplayedImageUrl(successfullyLoaded[0]); // Initialise la première image affichée
        }
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        successfullyLoaded.push(src);
        checkCompletion();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        checkCompletion();
      };
    });

  }, [images]);

  // Effet pour la logique du carrousel et la transition cross-fade
  useEffect(() => {
    if (!allImagesPreloaded || availableImages.length === 0) {
      return;
    }

    const fadeDuration = 500; // Durée de la transition cross-fade en ms (0.5 seconde)
    const displayDuration = interval - fadeDuration; // Temps où l'image est entièrement visible

    let cycleTimer: ReturnType<typeof setTimeout>;
    let transitionStartTimer: ReturnType<typeof setTimeout>;
    let transitionEndTimer: ReturnType<typeof setTimeout>;

    const startTransition = () => {
      const nextIndex = (currentImageIndex + 1) % availableImages.length;
      const newNextImageUrl = availableImages[nextIndex];

      setNextImageUrl(newNextImageUrl);
      setNextImageOpacity(0); // S'assure que la prochaine image est invisible au début

      // Déclenche le fondu enchaîné de la prochaine image
      transitionStartTimer = setTimeout(() => {
        setNextImageOpacity(1); // Fait apparaître la prochaine image
      }, 50); // Petit délai pour s'assurer que la transition CSS est appliquée

      // Après la durée du fondu, la nouvelle image est entièrement visible
      transitionEndTimer = setTimeout(() => {
        setDisplayedImageUrl(newNextImageUrl); // La prochaine image devient l'image affichée
        setNextImageUrl(''); // Réinitialise la prochaine image
        setNextImageOpacity(0); // Réinitialise l'opacité pour le prochain cycle
        setCurrentImageIndex(nextIndex);
        cycleTimer = setTimeout(startTransition, displayDuration); // Démarre le prochain cycle
      }, fadeDuration);
    };

    if (availableImages.length > 1) {
      // Démarre le premier cycle après la durée d'affichage initiale
      cycleTimer = setTimeout(startTransition, displayDuration);
    }

    return () => {
      clearTimeout(cycleTimer);
      clearTimeout(transitionStartTimer);
      clearTimeout(transitionEndTimer);
    };
  }, [availableImages, interval, allImagesPreloaded, currentImageIndex]);

  if (!allImagesPreloaded) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-gray-800 flex items-center justify-center text-white font-satisfy text-3xl">
        Chargement des images...
      </div>
    );
  }

  if (availableImages.length === 0) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-gray-800 flex items-center justify-center text-white font-satisfy text-3xl">
        Aucune image de fond disponible.
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Couche de l'image actuellement affichée */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${displayedImageUrl}')` }}
      />
      {/* Couche de la prochaine image, qui se fondra par-dessus */}
      {nextImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out"
          style={{
            backgroundImage: `url('${nextImageUrl}')`,
            opacity: nextImageOpacity,
          }}
        />
      )}
      <div className="absolute inset-0 bg-black opacity-10 z-10"></div>
    </div>
  );
};

export default BackgroundCarousel;
