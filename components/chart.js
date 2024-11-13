import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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

import SelectionOfScopeButton from "./UI/selectionOfSCopeButton";

import transformData from "../functions/transformData";
import fillingInTheBlanksHandler from "../functions/fillingInTheBlanks";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Chart = () => {
  const [debitData, setDebitData] = useState([]);
  const [savingData, setSavingData] = useState([]);
  const [sortDebitData, setSortDebitData] = useState([]);
  const [sortSavingData, setSortSavingData] = useState([]);
  const [chartDescription, setChartDescription] = useState([
    10000, 20000, 30000, 40000, 50000, 60000,
  ]);
  const [chartDescriptionForSaving, setChartDescriptionForSaving] = useState([
    10000, 20000, 30000, 40000, 50000, 60000,
  ]);
  const [actualLine, setActualLine] = useState([]);
  const [actualLineForSaving, setActualLineForSaving] = useState([]);
  const [prevLine, setPrevLine] = useState([]);
  const [prevLineForSaving, setPrevLineForSaving] = useState([]);
  const [prev2YearLine, setPrec2YearLine] = useState([]);
  const [prev2YearLineForSaving, setPrec2YearLineForSaving] = useState([]);
  const [allYearLine, setAllYearLine] = useState([]);
  const [allYearLineForSaving, setAllYearLineForSaving] = useState([]);
  const [allYearData, setAllYearData] = useState([]);
  const [allYearDataForSaving, setAllYearDataForSaving] = useState([]);
  const [toogleButtonForDebt, setToogleButtonForDebt] = useState(true);
  const [toogleButtonForSaving, setToggleButtonForSaving] = useState(true);

  const [actualYear, setActualYear] = useState();

  const refresh = useSelector(
    (state) => state.functionHandlerContext.refreshData
  );

  const readDebitData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("debitData");
      const dataArray = jsonValue != null ? JSON.parse(jsonValue) : null; // Zamiana na tablicę obiektów
      const formattedData = dataArray.map((item) => {
        // console.log(item); // Log each item here
        const date = new Date(item.date);
        return {
          x: date,
          y: parseFloat(item.value),
        };
      });

      setDebitData(formattedData);
    } catch (e) {
      console.error("Error retrieving array", e);
    }
  };

  const readSavingData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("savingData");
      const dataArray = jsonValue != null ? JSON.parse(jsonValue) : null; // Zamiana na tablicę obiektów
      const formattedData = dataArray.map((item) => {
        // console.log(item); // Log each item here
        const date = new Date(item.date);
        return {
          x: date,
          y: parseFloat(item.value),
        };
      });

      setSavingData(formattedData);
    } catch (e) {
      console.error("Error retrieving array", e);
    }
  };

  useEffect(() => {
    readDebitData();
    readSavingData();
  }, []);

  useEffect(() => {
    readDebitData();
    readSavingData();
  }, [refresh]);

  useEffect(() => {
    const valueMax = debitData.reduce(
      (max, item) => (item.y > max ? item.y : max),
      0
    );
    const valueMaxLength = valueMax.toString().length;
    const base = 10 ** (valueMaxLength - 1);
    const roundedUp = Math.ceil(valueMax / base) * base;
    const valueMin = roundedUp / 6;
    const valueMinLength = Math.round(valueMin).toString().length;
    const baseForMin = 10 ** (valueMinLength - 1);
    const roundedUpForMin = Math.ceil(valueMin / baseForMin) * baseForMin;

    setChartDescription([
      roundedUpForMin,
      roundedUpForMin * 2,
      roundedUpForMin * 3,
      roundedUpForMin * 4,
      roundedUpForMin * 5,
      roundedUpForMin * 6,
    ]);
  }, [debitData]);

  useEffect(() => {
    const valueMax = savingData.reduce(
      (max, item) => (item.y > max ? item.y : max),
      0
    );
    const valueMaxLength = valueMax.toString().length;
    const base = 10 ** (valueMaxLength - 1);
    const roundedUp = Math.ceil(valueMax / base) * base;
    const valueMin = roundedUp / 6;
    const valueMinLength = Math.round(valueMin).toString().length;
    const baseForMin = 10 ** (valueMinLength - 1);
    const roundedUpForMin = Math.ceil(valueMin / baseForMin) * baseForMin;

    setChartDescriptionForSaving([
      roundedUpForMin,
      roundedUpForMin * 2,
      roundedUpForMin * 3,
      roundedUpForMin * 4,
      roundedUpForMin * 5,
      roundedUpForMin * 6,
    ]);
  }, [savingData]);

  useEffect(() => {
    const sortedData = debitData
      .slice() // Creates a shallow copy of the array to avoid mutating the original array
      .sort((a, b) => new Date(a.x) - new Date(b.x));
    // console.log(sortedData);
    const sortedDataV2 = sortedData.map((item) => ({
      x: item.x.toLocaleDateString(),
      y: item.y,
    }));
    setSortDebitData(sortedDataV2);
  }, [debitData]); // Triggers the sorting every time `debitData` changes

  useEffect(() => {
    const sortedData = savingData
      .slice() // Creates a shallow copy of the array to avoid mutating the original array
      .sort((a, b) => new Date(a.x) - new Date(b.x));
    // console.log(sortedData);
    const sortedDataV2 = sortedData.map((item) => ({
      x: item.x.toLocaleDateString(),
      y: item.y,
    }));
    setSortSavingData(sortedDataV2);
  }, [savingData]); // Triggers the sorting every time `debitData` changes

  useEffect(() => {
    const nowYear = new Date().getFullYear();
    // console.log(nowYear);
    setActualYear(nowYear);

    const nowYearData = Array.from({ length: 12 }, () => ({
      value: 0,
      counter: 0,
    }));
    const prevYearData = Array.from({ length: 12 }, () => ({
      value: 0,
      counter: 0,
    }));
    const prev2YearData = Array.from({ length: 12 }, () => ({
      value: 0,
      counter: 0,
    }));
    const allYearData = Array.from({ length: 10 }, () => ({
      value: 0,
      counter: 0,
    }));
    console.log(debitData);

    debitData.forEach((item) => {
      console.log(item.x.getFullYear());
      allYearData[actualYear - item.x.getFullYear()].value += item.y;
      allYearData[actualYear - item.x.getFullYear()].counter += 1;
    });

    console.log(allYearData);
    setAllYearData(allYearData.reverse());
    console.log(allYearData);

    debitData.forEach((item) => {
      const month = item.x.getMonth();
      if (item.x.getFullYear() === nowYear) {
        nowYearData[month].value += item.y;
        nowYearData[month].counter += 1;
      } else if (item.x.getFullYear() === nowYear - 1) {
        prevYearData[month].value += item.y;
        prevYearData[month].counter += 1;
      } else if (item.x.getFullYear() === nowYear - 2) {
        prev2YearData[month].value += item.y;
        prev2YearData[month].counter += 1;
      }
    });
    setActualLine(fillingInTheBlanksHandler(transformData(nowYearData)));
    setPrevLine(fillingInTheBlanksHandler(transformData(prevYearData)));
    setPrec2YearLine(fillingInTheBlanksHandler(transformData(prev2YearData)));
  }, [sortDebitData]);

  useEffect(() => {
    const nowYear = new Date().getFullYear();
    // console.log(nowYear);
    setActualYear(nowYear);

    const nowYearData = Array.from({ length: 12 }, () => ({
      value: 0,
      counter: 0,
    }));
    const prevYearData = Array.from({ length: 12 }, () => ({
      value: 0,
      counter: 0,
    }));
    const prev2YearData = Array.from({ length: 12 }, () => ({
      value: 0,
      counter: 0,
    }));
    const allYearData = Array.from({ length: 10 }, () => ({
      value: 0,
      counter: 0,
    }));
    console.log(debitData);

    savingData.forEach((item) => {
      console.log(item.x.getFullYear());
      allYearData[actualYear - item.x.getFullYear()].value += item.y;
      allYearData[actualYear - item.x.getFullYear()].counter += 1;
    });

    console.log(allYearDataForSaving);
    setAllYearDataForSaving([...allYearData].reverse());
    console.log(allYearDataForSaving);

    savingData.forEach((item) => {
      const month = item.x.getMonth();
      if (item.x.getFullYear() === nowYear) {
        nowYearData[month].value += item.y;
        nowYearData[month].counter += 1;
      } else if (item.x.getFullYear() === nowYear - 1) {
        prevYearData[month].value += item.y;
        prevYearData[month].counter += 1;
      } else if (item.x.getFullYear() === nowYear - 2) {
        prev2YearData[month].value += item.y;
        prev2YearData[month].counter += 1;
      }
    });
    setActualLineForSaving(
      fillingInTheBlanksHandler(transformData(nowYearData))
    );
    setPrevLineForSaving(
      fillingInTheBlanksHandler(transformData(prevYearData))
    );
    setPrec2YearLineForSaving(
      fillingInTheBlanksHandler(transformData(prev2YearData))
    );
  }, [sortSavingData]);

  useEffect(() => {
    setAllYearLine(fillingInTheBlanksHandler(transformData(allYearData)));
    console.log(allYearLine);
  }, [allYearData]);

  useEffect(() => {
    const processedData = fillingInTheBlanksHandler(
      transformData(allYearDataForSaving)
    );
    console.log("Processed Data for allYearDataForSaving:", processedData);
    setAllYearLineForSaving(processedData);
  }, [allYearDataForSaving]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {toogleButtonForDebt ? (
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              padding={{ top: 30, bottom: 50, left: 60, right: 40 }} // Increase left padding as needed
            >
              <VictoryLabel
                text="Montly Debit Chart" // Title text
                x={225} // Center x-axis (adjust based on chart width)
                y={100} // Position above the chart
                textAnchor="middle"
                style={{ fontSize: 20, fontWeight: "bold" }}
              />
              <VictoryLegend
                x={Dimensions.get("window").width / 4} // Center the legend
                orientation="horizontal"
                gutter={20}
                data={[
                  { name: actualYear - 2, symbol: { fill: "#c43a31" } },
                  { name: actualYear - 1, symbol: { fill: "#ad2" } },
                  { name: actualYear, symbol: { fill: "#2d2" } },
                ]}
              />
              <VictoryAxis
                tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]} // Represent months as numbers
                tickCount={12} // Show 12 ticks for 12 months
                tickFormat={(t) => {
                  const months = [
                    "JAN",
                    "FEB",
                    "MAR",
                    "APR",
                    "MAY",
                    "JUN",
                    "JUL",
                    "AUG",
                    "SEP",
                    "OCT",
                    "NOV",
                    "DEC",
                  ];
                  return months[t]; // Convert the number to the corresponding month
                }}
              />
              <VictoryAxis
                domain={[0, chartDescription[5]]} // Ustawienie zakresu wartości osi X
                tickCount={5} // Liczba etykiet na osi
                dependentAxis // oznacza oś Y
                tickFormat={chartDescription}
              />
              <VictoryScatter
                data={actualLine}
                style={{
                  data: { fill: "#2d2" }, // Kolor punktów
                }}
              />

              <VictoryLine
                data={actualLine}
                style={{
                  data: { stroke: "#2d2" },
                  parent: { border: "1px solid #ccc" },
                }}
                animate={{
                  // duration: 1000,
                  onLoad: { duration: 1000 },
                }}
                interpolation="natural"
              />
              <VictoryScatter
                data={prevLine}
                style={{
                  data: { fill: "#ad2" }, // Kolor punktów
                }}
              />
              <VictoryLine
                data={prevLine}
                style={{
                  data: { stroke: "#ad2" },
                  parent: { border: "1px solid #ccc" },
                }}
                animate={{
                  // duration: 1000,
                  onLoad: { duration: 1000 },
                }}
                interpolation="natural"
              />
              <VictoryScatter
                data={prev2YearLine}
                style={{
                  data: { fill: "#c43a31" }, // Kolor punktów
                }}
              />
              <VictoryLine
                data={prev2YearLine}
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
        ) : (
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              padding={{ top: 30, bottom: 50, left: 60, right: 40 }} // Increase left padding as needed
            >
              <VictoryLabel
                text="Annual Debit Chart" // Title text
                x={225} // Center x-axis (adjust based on chart width)
                y={100} // Position above the chart
                textAnchor="middle"
                style={{ fontSize: 20, fontWeight: "bold" }}
              />
              <VictoryLegend
                x={Dimensions.get("window").width / 3} // Center the legend
                orientation="horizontal"
                gutter={20}
                data={[{ name: "LAST 10 YEARS ", symbol: { fill: "#2d2" } }]}
              />
              <VictoryAxis
                tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} // Represent months as numbers
                tickCount={10}
                tickFormat={(t) => {
                  const months = [
                    actualYear - 9,
                    actualYear - 8,
                    actualYear - 7,
                    actualYear - 6,
                    actualYear - 5,
                    actualYear - 4,
                    actualYear - 3,
                    actualYear - 2,
                    actualYear - 1,
                    actualYear,
                  ];
                  return months[t]; // Convert the number to the corresponding month
                }}
              />
              <VictoryAxis
                domain={[0, chartDescription[5]]} // Ustawienie zakresu wartości osi X
                tickCount={5} // Liczba etykiet na osi
                dependentAxis // oznacza oś Y
                tickFormat={chartDescription}
              />
              <VictoryScatter
                data={allYearLine}
                style={{
                  data: { fill: "#2d2" }, // Kolor punktów
                }}
              />

              <VictoryLine
                data={allYearLine}
                style={{
                  data: { stroke: "#2d2" },
                  parent: { border: "1px solid #ccc" },
                }}
                // animate={{
                //   duration: 1000,
                //   onLoad: { duration: 1000 },
                // }}
                interpolation="natural"
              />
            </VictoryChart>
          </View>
        )}

        <SelectionOfScopeButton
          toogleButton={toogleButtonForDebt}
          setToogleButton={setToogleButtonForDebt}
        />

        {toogleButtonForSaving ? (
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              padding={{ top: 30, bottom: 50, left: 60, right: 40 }} // Increase left padding as needed
            >
              <VictoryLabel
                text="Montly Savings Chart" // Title text
                x={225} // Center x-axis (adjust based on chart width)
                y={100} // Position above the chart
                textAnchor="middle"
                style={{ fontSize: 20, fontWeight: "bold" }}
              />
              <VictoryLegend
                x={Dimensions.get("window").width / 4} // Center the legend
                orientation="horizontal"
                gutter={20}
                data={[
                  { name: actualYear - 2, symbol: { fill: "#c43a31" } },
                  { name: actualYear - 1, symbol: { fill: "#ad2" } },
                  { name: actualYear, symbol: { fill: "#2d2" } },
                ]}
              />
              <VictoryAxis
                tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]} // Represent months as numbers
                tickCount={12} // Show 12 ticks for 12 months
                tickFormat={(t) => {
                  const months = [
                    "JAN",
                    "FEB",
                    "MAR",
                    "APR",
                    "MAY",
                    "JUN",
                    "JUL",
                    "AUG",
                    "SEP",
                    "OCT",
                    "NOV",
                    "DEC",
                  ];
                  return months[t]; // Convert the number to the corresponding month
                }}
              />
              <VictoryAxis
                domain={[0, chartDescriptionForSaving[5]]} // Ustawienie zakresu wartości osi X
                tickCount={5} // Liczba etykiet na osi
                dependentAxis // oznacza oś Y
                tickFormat={chartDescriptionForSaving}
              />
              <VictoryScatter
                data={actualLineForSaving}
                style={{
                  data: { fill: "#2d2" }, // Kolor punktów
                }}
              />

              <VictoryLine
                data={actualLineForSaving}
                style={{
                  data: { stroke: "#2d2" },
                  parent: { border: "1px solid #ccc" },
                }}
                animate={{
                  // duration: 1000,
                  onLoad: { duration: 1000 },
                }}
                interpolation="natural"
              />
              <VictoryScatter
                data={prevLineForSaving}
                style={{
                  data: { fill: "#ad2" }, // Kolor punktów
                }}
              />
              <VictoryLine
                data={prevLineForSaving}
                style={{
                  data: { stroke: "#ad2" },
                  parent: { border: "1px solid #ccc" },
                }}
                animate={{
                  // duration: 1000,
                  onLoad: { duration: 1000 },
                }}
                interpolation="natural"
              />
              <VictoryScatter
                data={prev2YearLineForSaving}
                style={{
                  data: { fill: "#c43a31" }, // Kolor punktów
                }}
              />
              <VictoryLine
                data={prev2YearLineForSaving}
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
        ) : (
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              padding={{ top: 30, bottom: 50, left: 60, right: 40 }} // Increase left padding as needed
            >
              <VictoryLabel
                text="Annual Savings Chart" // Title text
                x={225} // Center x-axis (adjust based on chart width)
                y={100} // Position above the chart
                textAnchor="middle"
                style={{ fontSize: 20, fontWeight: "bold" }}
              />
              <VictoryLegend
                x={Dimensions.get("window").width / 3} // Center the legend
                orientation="horizontal"
                gutter={20}
                data={[{ name: "LAST 10 YEARS ", symbol: { fill: "#2d2" } }]}
              />
              <VictoryAxis
                tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} // Represent months as numbers
                tickCount={10}
                tickFormat={(t) => {
                  const months = [
                    actualYear - 9,
                    actualYear - 8,
                    actualYear - 7,
                    actualYear - 6,
                    actualYear - 5,
                    actualYear - 4,
                    actualYear - 3,
                    actualYear - 2,
                    actualYear - 1,
                    actualYear,
                  ];
                  return months[t]; // Convert the number to the corresponding month
                }}
              />
              <VictoryAxis
                domain={[0, chartDescriptionForSaving[5]]} // Ustawienie zakresu wartości osi X
                tickCount={5} // Liczba etykiet na osi
                dependentAxis // oznacza oś Y
                tickFormat={chartDescriptionForSaving}
              />
              <VictoryScatter
                data={allYearLineForSaving}
                style={{
                  data: { fill: "#2d2" }, // Kolor punktów
                }}
              />

              <VictoryLine
                data={allYearLineForSaving}
                style={{
                  data: { stroke: "#2d2" },
                  parent: { border: "1px solid #ccc" },
                }}
                // animate={{
                //   duration: 1000,
                //   onLoad: { duration: 1000 },
                // }}
                interpolation="natural"
              />
            </VictoryChart>
          </View>
        )}

        <SelectionOfScopeButton
          toogleButton={toogleButtonForSaving}
          setToogleButton={setToggleButtonForSaving}
        />
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
  chartContainer: {
    marginTop: 40,
  },
});

export default Chart;
