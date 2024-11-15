import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;

const Stats = () => {
  const [allData, setAllData] = useState([]);
  const [toogleData, setToogleData] = useState(false);
  const readData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("statsDataForDebit");
      let dataArray = [];

      if (jsonValue) {
        // Try parsing the stored data
        dataArray = JSON.parse(jsonValue);

        // Ensure the parsed value is an array
        if (!Array.isArray(dataArray)) {
          console.warn("Data in storage is not an array. Resetting.");
          dataArray = [];
        }
      }

      setAllData(dataArray);
    } catch (e) {
      console.error("Error retrieving data:", e.message || e);
      setAllData([]); // Fallback to an empty array on error
    }
  };

  const deleteItem = async (indexForDelete) => {
    const newArray = allData.filter((_, index) => index !== indexForDelete);
    setAllData(newArray);
    console.log(indexForDelete);
    setToogleData(!toogleData);

    const saveData = async () => {
      try {
        const jsonValue = JSON.stringify(newArray);
        await AsyncStorage.setItem("statsDataForDebit", jsonValue);
      } catch (e) {
        console.error("Error saving data:", e);
      }
    };
    saveData();
  };

  const editItem = async (indexForDelete) => {
    // const newArray = allData.filter((_, index) => index !== indexForDelete);
    // setAllData(newArray);
    console.log(indexForDelete);
  };

  const addDataForAsyncStore = async () => {
    const newData = {
      data: new Date(),
      name: "nowy dług2",
      value: 10000,
    };

    try {
      // Ensure allData is an array
      const updatedData = Array.isArray(allData)
        ? [...allData, newData]
        : [newData];
      const jsonValue = JSON.stringify(updatedData);

      await AsyncStorage.setItem("statsDataForDebit", jsonValue);
      setAllData(updatedData);
      console.log("Data saved successfully:", updatedData);
    } catch (e) {
      console.error("Error saving data:", e.message || e);
    }
  };

  useEffect(() => {
    readData().catch((e) =>
      console.error("Error in readData effect:", e.message || e)
    );
  }, []);

  useEffect(() => {
    readData().catch((e) =>
      console.error("Error in readData effect:", e.message || e)
    );
  }, [toogleData]);

  return (
    <View style={styles.containerForAllData}>
      <Text>Saved Data:</Text>
      {allData.length > 0 ? (
        allData.map((item, index) => (
          <View style={styles.containerForItem} key={index}>
            <View>
              <Text>{item.name}</Text>
            </View>
            <View>
              {/* <Text>{item.data}</Text> */}
              <Text>{item.value}</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => deleteItem(index)}>
                <Ionicons name="create-outline" color={"black"} size={22} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem(index)}>
                <Ionicons name="trash" color={"black"} size={22} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No data available</Text>
      )}
      <TouchableOpacity onPress={addDataForAsyncStore}>
        <Text>Add New Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerForAllData: {
    width: screenWidth * 0.9,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  containerForItem: {},
});

export default Stats;
