import React, { useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

import colors from "../../CONST/colors";

const SelectionOfScopeButton = ({ toogleButton, setToogleButton }) => {
  const pressIn3Years = () => {
    setToogleButton(true);
  };

  const pressInAll = () => {
    setToogleButton(false);
  };

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[
          styles.button,
          !toogleButton ? styles.buttonDataTextOff : styles.buttonDataTextOn,
        ]}
        onPress={pressIn3Years}
      >
        <Text style={styles.buttonText}>Prev3Years </Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          toogleButton ? styles.buttonDataTextOff : styles.buttonDataTextOn,
        ]}
        onPress={pressInAll}
      >
        <Text style={styles.buttonText}>All history</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    width: "100vw",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.buttonOn,
    width: "45%",
    borderRadius: 7,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 10,
    width: "100%",
    textAlign: "center",
  },
  buttonDataTextOn: {
    backgroundColor: "#634050",
  },
  buttonDataTextOff: {
    backgroundColor: "#D7C1CC",
  },
});

export default SelectionOfScopeButton;
