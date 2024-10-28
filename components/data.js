import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

import colors from "../CONST/colors";

const screenWidth = Dimensions.get("window").width;

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
      if (dataType === true) {
        const jsonValue = await AsyncStorage.getItem("debitData");
        const dataArray = jsonValue != null ? JSON.parse(jsonValue) : null; // Zamiana na tablicę obiektów
        console.log(dataArray);
        setAllData(dataArray);
        console.log(dataArray);
      } else {
        const jsonValue = await AsyncStorage.getItem("savingData");
        const dataArray = jsonValue != null ? JSON.parse(jsonValue) : null; // Zamiana na tablicę obiektów
        console.log(dataArray);
        setAllData(dataArray);
        console.log(dataArray);
      }
    } catch (e) {
      console.error("Error retrieving array", e);
    }
  };

  const deleteItem = (indexOfDelete) => {
    const newArray = allData.filter((_, index) => index !== indexOfDelete);
    setAllData(newArray);

    console.log("delete item");
    // console.log(index);
    setDataToggle(!dataToggle);

    const saveData = async () => {
      try {
        // await AsyncStorage.removeItem("allData");
        if (dataType === true) {
          const jsonValue = JSON.stringify(newArray);
          await AsyncStorage.setItem("debitData", jsonValue);
          console.log("Data saved:", newArray);
        } else {
          const jsonValue = JSON.stringify(newArray);
          await AsyncStorage.setItem("savingData", jsonValue);
          console.log("Data saved:", newArray);
        }
      } catch (e) {
        console.error("Error saving data:", e);
      }
    };
    saveData();
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
          <View style={styles.itemContainer} key={index}>
            <View style={styles.dataContainer}>
              <Text style={styles.valueTextDescription}>Data list:</Text>
              <Text style={styles.textData}>{formattedDate}</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueTextDescription}>Actual value:</Text>
              <Text style={styles.textValue}>{item.value}</Text>
            </View>
            <TouchableOpacity
              style={styles.trashIconContainer}
              onPress={() => deleteItem(index)}
            >
              <Ionicons name="trash" color={"black"} size={22} />
            </TouchableOpacity>
          </View>
        );
      });
      setAllItems(mappedItem);
    }
  }, [allData]);

  useEffect(() => {
    readData();
  }, [dataToggle, dataType]);

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
          if (dataType === true) {
            const jsonValue = JSON.stringify(updatedData);
            await AsyncStorage.setItem("debitData", jsonValue);
            console.log("Data saved:", updatedData);
          } else {
            const jsonValue = JSON.stringify(updatedData);
            await AsyncStorage.setItem("savingData", jsonValue);
            console.log("Data saved:", updatedData);
          }
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
    // setDataToggle(!dataToggle);
  };

  const onSelectHandlerSavings = () => {
    setDataType(false);
    // setDataToggle(!dataToggle);
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
      <ScrollView
        style={styles.scrollViewForAllItems}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.allItemContainer}>{allItems}</View>
      </ScrollView>
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
    width: screenWidth * 1,
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
  allItemContainer: {
    marginTop: 40,
  },
  dataContainer: {},
  itemContainer: {
    // width: screenWidth * 0.99,
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    borderColor: "gray",
    borderWidth: 1,
    padding: 2,
    marginTop: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  valueContainer: {},
  textValue: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  textData: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  valueTextDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  trashIconContainer: {
    alignSelf: "center",
    marginRight: 10,
  },
  scrollViewForAllItems: {
    width: screenWidth * 0.99,
  },
});

export default Data;
