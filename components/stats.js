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
import { format } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const Stats = () => {
  const [allData, setAllData] = useState([]);
  const [toogleData, setToogleData] = useState(false);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [modalForEdit, setModalForEdit] = useState(false);
  const [editValue, setEditValue] = useState(null);
  const [itemForDelete, setItemForDelete] = useState(null);
  const [itemInfo, setItemInfo] = useState(null);
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

  const onCloseModalInfoHandler = () => {
    setOpenItemInfo(false);
  };

  const onCloseModalEditHandler = () => {
    setModalForEdit(false);
    setOpenItemInfo(true);
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
    setOpenItemInfo(false);
    setModalForDelete(true);
  };

  const editItemHandler = (indexForDelete) => {
    setOpenItemInfo(false);
    setModalForEdit(true);
    editItem(indexForDelete);
  };

  const editItem = async (indexForDelete) => {
    // const newArray = allData.filter((_, index) => index !== indexForDelete);
    // setAllData(newArray);
    console.log(indexForDelete);
  };

  const infoModal = async (indexForDelete, item) => {
    setItemForDelete(indexForDelete);
    setOpenItemInfo(true);
    setItemInfo(item);
    console.log(item);
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
      // setAllData(updatedData);
      readData();
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
          <TouchableOpacity onPress={() => infoModal(index, item)}>
            <View style={styles.containerForItem} key={index}>
              <View>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
              <View style={styles.containerForValueTrashEdit}>
                <View>
                  {/* <Text>{item.data}</Text> */}
                  <Text style={styles.valueText}>{item.value} PLN</Text>
                </View>
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
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.buttonCloseContainer}
            onPress={onCloseModalInfoHandler}
          >
            <Ionicons
              style={styles.buttonClose}
              name="close-circle-outline"
              color={"white"}
              size={28}
            ></Ionicons>
          </TouchableOpacity>
          {itemInfo === null ? (
            <View></View>
          ) : (
            <View style={styles.dataContainer}>
              <View style={styles.dataInfoContainer}>
                <Text style={styles.textInfo}>{itemInfo.name}</Text>
              </View>
              <View style={styles.dataInfoContainer}>
                <Text style={styles.textInfoDescription}>ACTUAL VALUE</Text>
                <Text style={styles.textInfo}>{itemInfo.value} PLN</Text>
              </View>
              <View style={styles.dataInfoContainer}>
                <Text style={styles.textInfoDescription}>DATE OF TAKING</Text>
                <Text style={styles.textInfo}>
                  {format(itemInfo.data, "yyyy-MM-dd")}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => editItemHandler(itemForDelete)}
            >
              <Ionicons name="create-outline" color={"white"} size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => deleteItem(itemForDelete)}
            >
              <Ionicons name="trash" color={"white"} size={22} />
            </TouchableOpacity>
          </View>
          <Text>XD</Text>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalForEdit}
        onRequestClose={() => setModalForEdit(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.buttonCloseContainer}
            onPress={onCloseModalEditHandler}
          >
            <Ionicons
              style={styles.buttonClose}
              name="close-circle-outline"
              color={"white"}
              size={28}
            ></Ionicons>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalForDelete}
        onRequestClose={() => setModalForDelete(false)}
      >
        <View style={styles.modalBackgroundForDelete}>
          <Text style={styles.buttonForDeleteText}>
            CZY NAPENO CHCESZ USUNĄĆ WARTOŚĆ?
          </Text>
          <View style={styles.butoonContainerForDelete}>
            <TouchableOpacity
              style={styles.buttonForDelete}
              onPress={() => {
                deleteItemAfterConfirmation();
              }}
            >
              <Text style={styles.buttonForDeleteText}>TAK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonForDelete}
              onPress={() => {
                setModalForDelete(false);
                setOpenItemInfo(true);
              }}
            >
              <Text style={styles.buttonForDeleteText}>NIE</Text>
            </TouchableOpacity>
          </View>
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
  icon: { width: screenWidth * 0.5, alignItems: "center" },
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
  buttonCloseContainer: {
    width: screenWidth,
  },
  buttonClose: {
    alignSelf: "flex-end",
    padding: 10,
  },
  buttonForDelete: {
    width: screenWidth * 0.4,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    padding: 10,
    margin: 10,
  },
  buttonForDeleteText: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  butoonContainerForDelete: {
    flexDirection: "row",
    marginTop: 20,
  },
  iconContainer: {
    flexDirection: "row",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  dataInfoContainer: {
    marginTop: 40,
  },

  modalBackgroundForDelete: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
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
  textInfo: {
    color: "white",
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
  },
  textInfoDescription: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: 9,
  },
  textDescription: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});

export default Stats;
