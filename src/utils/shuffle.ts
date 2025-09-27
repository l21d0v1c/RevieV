export const seededShuffle = <T>(array: T[], seed: number): T[] => {
  const shuffledArray = [...array];
  let currentIndex = shuffledArray.length;
  let randomIndex: number;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    // Use a simple pseudo-random number generator based on the seed
    seed = (seed * 9301 + 49297) % 233280;
    const random = seed / 233280;
    randomIndex = Math.floor(random * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }

  return shuffledArray;
};
