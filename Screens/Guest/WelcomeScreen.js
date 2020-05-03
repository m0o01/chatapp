import React from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default class WelcomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={styles.welcome}>Welcome to ChatApp!</Text>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => this.props.navigation.navigate("LoginScreen")}
        >
          <Text style={styles.buttonsText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => this.props.navigation.navigate("RegisterScreen")}
        >
          <Text style={styles.buttonsText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#146687"
  },
  logo: {
    width: 180,
    height: 180,
    margin: 10
  },
  welcome: {
    fontFamily: "Thasadith-Regular",
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    margin: 8
  },
  buttons: {
    width: 300,
    height: 60,
    backgroundColor: "#2486ad",
    borderRadius: 10,
    justifyContent: "center",
    margin: 4
  },
  buttonsText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Thasadith-Regular",
    fontSize: 22
  }
});
