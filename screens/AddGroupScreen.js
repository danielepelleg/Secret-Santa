import React, { useContext, useState } from "react";
import { Text, ScrollView, Image, StyleSheet } from "react-native";
import FormButton from "../components/FormButton";
import { Input } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../navigation/AuthProvider";

import { firebase } from "../config/firebase";

const AddGroupScreen = () => {
  const { user } = useContext(AuthContext);

  // Input Value
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [theme, setTheme] = useState("");

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // Input Error
  const [errorName, setErrorName] = useState(null);
  const [errorBudget, setErrorBudget] = useState(null);
  const [errorTheme, setErrorTheme] = useState(null);

  const showDatePicker = () => {
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const handleConfirm = (value) => {
    hideDatePicker();
    setDate(value);
  };

  const createGroup = async () => {
    if (!isInvalid) {
      const groupsRef = firebase.database().ref("groups");
      const uid = firebase.auth().currentUser.uid;
      const userGroupsListRef = firebase
        .database()
        .ref("users/" + uid + "/groups");

      let newGroupRef = groupsRef.push();

      // New Group ID
      const newGroupId = newGroupRef.key;

      // Add the Group to Firebase
      newGroupRef
        .set({
          name: name,
          budget: parseInt(budget, 10),
          theme: theme,
          date:
            date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
          host: user.uid,
          members: {
            [user.uid]: true,
          },
        })
        .then(function () {
          console.log("New Group added");
        })
        .catch(function (error) {
          console.error("error adding a new group", error);
        });

      // Rewrite the user's groups list adding the new one
      userGroupsListRef.once("value", (snapshot) => {
        const groupsList = snapshot.val();
        if (groupsList) {
          groupsList[newGroupId] = true;
          userGroupsListRef
            .set(groupsList)
            .then(function () {
              console.log("rewriting user's groups list");
            })
            .catch(function (error) {
              console.error("error rewriting user's groups list", error);
            });
        } else
          userGroupsListRef
            .set({ [newGroupId]: true })
            .then(function () {
              console.log("create user's groups list");
            })
            .catch(function (error) {
              console.error("error creating user's groups list", error);
            });
      });

      // reset error messages
      setErrorName(null);
      setErrorBudget(null);
      setErrorTheme(null);

    } else {
      if (name === "") setErrorName("INSERT A NAME");
      if (budget === "") setErrorBudget("INSERT A VALID BUDGET");
      if (theme === "") setErrorTheme("INSERT A VALID THEME");
    }
  };

  // Check if given inputs are valid
  const isInvalid =
    name === "" || budget === "" || parseInt({ budget }, 10) || theme === "";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../assets/gift-box.png")} style={styles.image} />
      <Text style={styles.title}>Create a Group</Text>

      <Input
        placeholder="GROUP NAME"
        leftIcon={<Ionicons name="pencil-outline" size={24} color="black" />}
        onChangeText={(text) => setName(text)}
        value={name}
        errorStyle={{ color: "red" }}
        errorMessage={errorName}
      />

      <Input
        placeholder="BUDGET"
        leftIcon={<Ionicons name="cash" size={24} color="green" />}
        onChangeText={(text) => setBudget(text)}
        value={budget}
        errorStyle={{ color: "red" }}
        errorMessage={errorBudget}
        keyboardType="number-pad"
      />

      <Input
        placeholder="THEME"
        leftIcon={<Ionicons name="pricetag-outline" size={24} color="orange" />}
        onChangeText={(text) => setTheme(text)}
        value={theme}
        errorStyle={{ color: "red" }}
        errorMessage={errorTheme}
      />

      <Ionicons
        name="calendar-outline"
        size={24}
        color="blue"
        onPress={showDatePicker}
        style={styles.dateIcon}
      />

      <DateTimePickerModal
        isVisible={show}
        mode="date"
        date={date}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <FormButton buttonTitle="CREATE" onPress={() => createGroup()} />
    </ScrollView>
  );
};

export default AddGroupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafd",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: "cover",
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    color: "#333333",
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: "#051d5f",
  },
  datePickerStyle: {
    width: 150,
    margin: 20,
  },
  calendarContainer: {
    flex: 1,
  },
  dateIcon: {
    marginBottom: 10,
  },
});
