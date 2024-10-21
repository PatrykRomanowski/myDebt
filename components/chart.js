import React, { useState, useEffect } from "react";

import {
  View,
  Pressable,
  Dimensions,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
  CartesianChart,
  Line,
} from "victory-native";

const Chart = () => {
  const [actualNumber, setActualNumber] = useState(1);

  const [data, setData] = useState([
    { x: "sty", y: actualNumber },
    { x: "lut", y: 3 },
    { x: "mar", y: 5 },
    { x: "kwi", y: 4 },
    { x: "maj", y: 7 },
    { x: "cze", y: 2 },
    { x: "lip", y: 3 },
    { x: "sie", y: 5 },
    { x: "wrz", y: 4 },
    { x: "paź", y: 7 },
    { x: "lis", y: 4 },
    { x: "gru", y: 7 },
  ]);

  const [testData, setTestData] = useState([
    { data: new Date(2024, 9, 16), value: 12000 },
    { data: new Date(2024, 9, 17), value: 13000 },
    { data: new Date(2024, 9, 18), value: 13200 },
    { data: new Date(2024, 9, 19), value: 13800 },
  ]);

  const [transformData, setTransformData] = useState([]);

  useEffect(() => {
    const formattedData = testData.map((item) => ({
      x: item.data.toLocaleDateString(),
      y: item.value,
    }));

    setTransformData(formattedData);
  }, []);

  const [data2, setData2] = useState([
    { x: "sty", y: actualNumber },
    { x: "lut", y: 32 },
    { x: "mar", y: 53 },
    { x: "kwi", y: 44 },
    { x: "maj", y: 75 },
    { x: "cze", y: 26 },
    { x: "lip", y: 37 },
    { x: "sie", y: 51 },
    { x: "wrz", y: 41 },
    { x: "paź", y: 72 },
    { x: "lis", y: 41 },
    { x: "gru", y: 72 },
  ]);

  const onPressHandler = () => {
    setActualNumber(actualNumber + 1);
    console.log(actualNumber);
    setData([
      { x: "sty", y: actualNumber },
      { x: "lut", y: 3 },
      { x: "mar", y: 5 },
      { x: "kwi", y: 4 },
      { x: "maj", y: 7 },
      { x: "cze", y: 2 },
      { x: "lip", y: 3 },
      { x: "sie", y: 5 },
      { x: "wrz", y: 4 },
      { x: "paź", y: 7 },
      { x: "lis", y: 4 },
      { x: "gru", y: 7 },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLegend
              x={Dimensions.get("window").width / 4} // Center the legend
              orientation="horizontal"
              gutter={20}
              data={[
                { name: actualNumber, symbol: { fill: "#c43a31" } },
                { name: "Second Line", symbol: { fill: "#ccc" } },
              ]}
            />
            <VictoryLine
              data={transformData}
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc" },
              }}
            />
            <VictoryLine
              data={transformData}
              style={{
                data: { stroke: "#ccc" },
                parent: { border: "1px solid #ccc" },
              }}
            />
          </VictoryChart>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine
              data={data}
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc" },
              }}
            />
            <VictoryLine
              data={data2}
              style={{
                data: { stroke: "#ccc" },
                parent: { border: "1px solid #ccc" },
              }}
            />
          </VictoryChart>
        </View>
        <Pressable style={styles.button} onPress={onPressHandler}>
          <Text style={styles.buttonText}>Dodaj</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100vw",
    borderRadius: 7,
    backgroundColor: "#1B84E6",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    padding: 20,
  },
});

export default Chart;
