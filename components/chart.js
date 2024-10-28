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
  VictoryScatter,
  VictoryLabel,
  VictoryAxis,
} from "victory-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Chart = () => {
  const [actualNumber, setActualNumber] = useState(1);
  const [debitData, setDebitData] = useState([]);

  const readDebitData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("debitData");
      const dataArray = jsonValue != null ? JSON.parse(jsonValue) : null; // Zamiana na tablicę obiektów
      const formattedData = dataArray.map((item) => {
        console.log(item); // Log each item here
        const date = new Date(item.date);
        return {
          x: date.toLocaleDateString(),
          y: parseFloat(item.value),
        };
      });

      setDebitData(formattedData);
    } catch (e) {
      console.error("Error retrieving array", e);
    }
  };

  useEffect(() => {
    readDebitData();
  }, []);

  const onPressHandler = () => {};

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
            <VictoryAxis
              // domain={[0, 12]} // Ustawienie zakresu wartości osi X
              tickCount={12} // Liczba etykiet na osi
            />
            <VictoryAxis
              domain={[0, 60000]} // Ustawienie zakresu wartości osi X
              tickCount={5} // Liczba etykiet na osi
              dependentAxis // oznacza oś Y
              tickFormat={[10000, 20000, 30000, 40000, 50000, 60000]}
            />
            <VictoryScatter
              data={debitData}
              style={{
                data: { fill: "#c43a31" }, // Kolor punktów
              }}
            />

            <VictoryLine
              data={debitData}
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc" },
              }}
              animate={{
                // duration: 1000,
                onLoad: { duration: 1000 },
              }}
              interpolation="natural"
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
