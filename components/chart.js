import React from "react";

import { View, Dimensions, Text } from "react-native";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

const Chart = () => {
  const data = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 },
  ];
  return (
    <View>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
          data={data}
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
        />
      </VictoryChart>
    </View>
  );
};

export default Chart;
