const fillingInTheBlanksHandler = (data) => {
  if (data.length === 0) return []; // Guard clause for empty data

  let lastKnownValue = data[0].y !== null ? data[0].y : 0; // Initialize with the first known value or default to 0

  return data.map(({ y, x }, index) => {
    if (y === null) {
      return { y: lastKnownValue, x }; // Fill in the blank with last known value
    } else {
      lastKnownValue = y; // Update last known value
      return { y, x }; // Return the current value
    }
  });
};

export default fillingInTheBlanksHandler;
