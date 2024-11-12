const transformData = (data) => {
  return data.map((item, index) => {
    if (item.counter === 0) {
      return {
        y: null,
        x: index,
      }; // Handle division by zero
    } else {
      return {
        y: Math.round(item.value / item.counter),
        x: index,
      };
    }
  });
};

export default transformData;
