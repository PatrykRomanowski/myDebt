import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;

const Stats = () => {
  const [allData, setAllData] = useState([]);
  const [toogleData, setToogleData] = useState(false);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [itemForDelete, setItemForDelete] = useState(null);
  const [openItemInfo, setOpenItemInfo] = useState(false);

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

  const deleteItemAfterConfirmation = () => {
    const newArray = allData.filter((_, index) => index !== itemForDelete);
    setAllData(newArray);
    // console.log(indexForDelete);
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
    setModalForDelete(false);
  };

  const deleteItem = async (indexForDelete) => {
    setModalForDelete(true);
  };

  const editItem = async (indexForDelete) => {
    // const newArray = allData.filter((_, index) => index !== indexForDelete);
    // setAllData(newArray);
    console.log(indexForDelete);
  };

  const infoModal = async (indexForDelete) => {
    setItemForDelete(indexForDelete);
    setOpenItemInfo(true);
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
      <View>
        <Text style={styles.textDescription}>ALL DEBITS</Text>
      </View>
      <TouchableOpacity onPress={addDataForAsyncStore}>
        <Text>Add New Data</Text>
      </TouchableOpacity>
      {allData.length > 0 ? (
        allData.map((item, index) => (
          <TouchableOpacity onPress={() => infoModal(index)}>
            <View style={styles.containerForItem} key={index}>
              <View>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
              <View style={styles.containerForValueTrashEdit}>
                <View>
                  {/* <Text>{item.data}</Text> */}
                  <Text style={styles.valueText}>{item.value} PLN</Text>
                </View>
                {/* <View>
                <TouchableOpacity onPress={() => deleteItem(index)}>
                <Ionicons name="create-outline" color={"black"} size={22} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(index)}>
                <Ionicons name="trash" color={"black"} size={22} />
                </TouchableOpacity>
                </View> */}
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No data available</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={openItemInfo}
        onRequestClose={() => setOpenItemInfo(false)}
      >
        <Text>XD</Text>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalForDelete}
        onRequestClose={() => setModalForDelete(false)}
      >
        <View style={styles.modalBackground}>
          <Text>CZY NAPENO CHCESZ USUNĄĆ WARTOŚĆ?</Text>
          <TouchableOpacity
            onPress={() => {
              deleteItemAfterConfirmation();
            }}
          >
            <Text>TAK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalForDelete(false);
            }}
          >
            <Text>NIE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerForAllData: {
    // width: screenWidth * 0.9,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  containerForItem: {
    width: screenWidth * 0.95,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  containerForValueTrashEdit: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  valueText: {
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    marginRight: 20,
  },
  nameText: {
    fontFamily: "Inter_400Regular",
    marginLeft: 20,
    textTransform: "uppercase",
  },
  textDescription: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});

export default Stats;
