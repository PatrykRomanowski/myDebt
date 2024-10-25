import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

import colors from "../CONST/colors";

const Data = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [actualValue, setActualValue] = useState(0);
  const [dataType, setDataType] = useState(false);
  const [allData, setAllData] = useState([]);
  const [dataToggle, setDataToggle] = useState(false);
  const [allItems, setAllItems] = useState([]);

  const testNumber = useSelector((state) => state.testContext.testNmber);
  const toggleSite = useSelector(
    (state) => state.functionHandlerContext.siteToogle
  );

  const readData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("allData");
      const dataArray = jsonValue != null ? JSON.parse(jsonValue) : null; // Zamiana na tablicę obiektów
      console.log(dataArray);
      setAllData(dataArray);
      console.log(dataArray);
    } catch (e) {
      console.error("Error retrieving array", e);
    }
  };

  const deleteItem = (index) => {
    console.log("delete item");
    console.log(index);
  };

  useEffect(() => {
    readData();
  }, []);

  useEffect(() => {
    if (allData) {
      const mappedItem = allData.map((item, index) => {
        const newDate = new Date(item.date);
        const day = newDate.getUTCDate();
        const month = newDate.getUTCMonth() + 1; // getUTCMonth() returns month index (0-11), so add 1
        const year = newDate.getUTCFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return (
          <View key={index}>
            <View>
              <Text>{item.value}</Text>
            </View>
            <View>
              <Text>{formattedDate}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteItem(index)}>
              <Ionicons name="trash" color={"black"} size={12} />
            </TouchableOpacity>
          </View>
        );
      });
      setAllItems(mappedItem);
    }
  }, [allData]);

  useEffect(() => {
    readData();
  }, [dataToggle]);

  const addDataForAsyncStore = async () => {
    const newData = {
      date: date,
      value: actualValue,
    };
    console.log(allData);
    console.log(newData);
    setAllData((prevData) => {
      const updatedData =
        prevData === null ? [newData] : [...prevData, newData];

      // Save the updated data to AsyncStorage after state has been updated
      const saveData = async () => {
        try {
          // await AsyncStorage.removeItem("allData");
          const jsonValue = JSON.stringify(updatedData);
          await AsyncStorage.setItem("allData", jsonValue);
          console.log("Data saved:", updatedData);
        } catch (e) {
          console.error("Error saving data:", e);
        }
      };
      saveData();
      return updatedData; // Set the updated data as the new state
    });
    setActualValue(0);
    setDataToggle(!dataToggle);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // Keep the picker open for iOS
    setDate(currentDate); // Update the selected date
  };

  const showDatePicker = () => {
    setShow(true); // Show the date picker
  };

  const onSelectHandlerDebits = () => {
    setDataType(true);
  };

  const onSelectHandlerSavings = () => {
    setDataType(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        SELECTED DATA: {date.toLocaleDateString()}
      </Text>
      <View style={styles.kindOfMoney}>
        <TouchableOpacity
          style={[
            styles.selectedButton,
            dataType ? styles.buttonDataTextOn : styles.buttonDataTextOff,
          ]}
          onPress={onSelectHandlerDebits}
        >
          <Text style={styles.buttonText}>Debts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectedButton,
            !dataType ? styles.buttonDataTextOn : styles.buttonDataTextOff,
          ]}
          onPress={onSelectHandlerSavings}
        >
          <Text style={styles.buttonText}>Savings</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="actual Value"
        keyboardType="numeric"
        value={actualValue}
        textAlign="center"
        onChangeText={(value) => setActualValue(value)}
      />
      <TouchableOpacity
        style={[styles.button, styles.buttonSelectedDate]}
        onPress={showDatePicker}
      >
        <Text style={[styles.buttonText, styles.buttonDataText]}>
          SELECT DATE
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date" // Show only date
          display="default" // Can be "default", "spinner", or "calendar"
          onChange={onChange}
        />
      )}
      <TouchableOpacity
        onPress={addDataForAsyncStore}
        style={styles.addNewDataButton}
      >
        <Text style={styles.buttonText}>ADD NEW VALUE</Text>
      </TouchableOpacity>
      <View>{allItems}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // backgroundColor: colors.grayLight,
    width: "100vw",
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
    marginBottom: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  setNewDataDescription: {
    color: colors.secondary,
  },
  kindOfMoney: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  selectedButton: {
    width: "45%",
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  mainContainer: {
    backgroundColor: colors.secondary,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    paddingHorizontal: 10,
  },
  button: {
    width: "100vw",
    marginTop: 20,
    borderRadius: 7,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSelectedDate: {
    backgroundColor: "#D7C1CC",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 10,
    width: "100%",
    textAlign: "center",
  },
  addNewDataButton: {
    width: 500,
    marginTop: 40,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  buttonDataText: {
    padding: 12,
  },
  buttonDataTextOn: {
    backgroundColor: "#634050",
  },
  buttonDataTextOff: {
    backgroundColor: "#D7C1CC",
  },
});

export default Data;
