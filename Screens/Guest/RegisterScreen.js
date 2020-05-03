import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";

import { register, deleteError } from "../../redux/actions/authActions";

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: {
        username: "",
        vaild: false
      },
      password: {
        password: "",
        vaild: false
      },
      password_confirmation: {
        password_confirmation: "",
        vaild: false
      },
      usernameAlert: "",
      usernamePassAlert: "",
      passwordAlert: "",
      passwordPassAlert: "",
      confirmAlert: "",
      confirmPassAlert: "",
      modalVisible: false,
      formVaild: false,
      registerationState: "",
      icon: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.state.formVaild) {
      if (
        this.state.username.vaild &&
        this.state.password.vaild &&
        this.state.password_confirmation.vaild
      )
        this.setState({ formVaild: true });
    }

    if (this.props.registering !== prevProps.registering) {
      if (this.props.registering) {
        this.setState({
          modalVisible: true,
          registerationState: "Registering Your Account Now..."
        });
      } else if (this.props.error) {
        this.setState({
          registerationState: this.props.errorMessage,
          icon: "warning"
        });
        this.props.deleteError();
        setTimeout(() => {
          this.setState({ modalVisible: false, icon: "", registerStatus: "" });
        }, 3000);
      } else {
        this.setState({
          registerationState: "Successfully Registered! You Can Login Now",
          icon: "success"
        });
        setTimeout(() => {
          this.setState({ modalVisible: false, icon: "", registerStatus: "" });
          this.props.navigation.navigate("WelcomeScreen");
        }, 3500);
      }
    }
  }

  updateUsername = username => {
    if (username) {
      if (!isNaN(username[0]))
        this.setState({
          usernameAlert: "Username must start with alphabet",
          username: { username: username, vaild: false },
          usernamePassAlert: "",
          formVaild: false
        });
      else if (username.length < 6)
        this.setState({
          usernameAlert: "Username too short",
          username: { username: username, vaild: false },
          usernamePassAlert: "",
          formVaild: false
        });
      else
        this.setState({
          usernamePassAlert: "Looks Neat!",
          username: { username: username, vaild: true },
          usernameAlert: ""
        });
    } else {
      this.setState({ usernameAlert: "" });
    }
  };

  updatePassword = password => {
    if (password) {
      if (password.length < 5)
        this.setState({
          passwordAlert: "Password is too short",
          password: { password: password, vaild: false },
          passwordPassAlert: "",
          formVaild: false
        });
      else
        this.setState({
          passwordPassAlert: "Strong Enough :)",
          password: { password: password, vaild: true },
          passwordAlert: "",
          confirmPassAlert: ""
        });
    } else {
      this.setState({ passwordAlert: "" });
    }
  };

  updatePasswordConfirmation = password => {
    if (password) {
      if (password !== this.state.password.password)
        this.setState({
          confirmAlert: "Passwords don't match",
          password_confirmation: {
            password_confirmation: password,
            vaild: false
          },
          confirmPassAlert: "",
          formVaild: false
        });
      else
        this.setState({
          confirmPassAlert: "Passwords Match",
          password_confirmation: {
            password_confirmation: password,
            vaild: true
          },
          confirmAlert: ""
        });
    } else {
      this.setState({ confirmAlert: "" });
    }
  };

  registerUser = () => {
    this.props.register(
      this.state.username.username,
      this.state.password.password
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.popup}>
            {!this.state.icon ? (
              <ActivityIndicator size="large" color="#75d7ff" />
            ) : (
              <View style={styles.icon}>
                <Icon
                  name={
                    this.state.icon === "success" ? "check-square" : "warning"
                  }
                  size={90}
                  color={this.state.icon === "success" ? "#8cff75" : "#f7ec79"}
                />
              </View>
            )}
            <Text style={styles.popupText}>
              {this.state.registerationState}
            </Text>
          </View>
        </Modal>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={styles.title}>Register New Account</Text>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Username:</Text>
          <Text style={styles.alert}>{this.state.usernameAlert}</Text>
          <Text style={styles.passAlert}>{this.state.usernamePassAlert}</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.formInput}
            onChangeText={this.updateUsername}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Password:</Text>
          <Text style={styles.alert}>{this.state.passwordAlert}</Text>
          <Text style={styles.passAlert}>{this.state.passwordPassAlert}</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.formInput}
            onChangeText={this.updatePassword}
            secureTextEntry={true}
          />
        </View>
        <KeyboardAvoidingView behavior="padding" enabled>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Password Confirmation:</Text>
            <Text style={styles.alert}>{this.state.confirmAlert}</Text>
            <Text style={styles.passAlert}>{this.state.confirmPassAlert}</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.formInput}
              onChangeText={this.updatePasswordConfirmation}
              secureTextEntry={true}
            />
          </View>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={
            this.state.formVaild
              ? styles.buttons
              : { ...styles.buttons, backgroundColor: "#a3a3a3" }
          }
          disabled={!this.state.formVaild}
          onPress={this.registerUser}
        >
          <Text style={styles.buttonsText}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    registering: state.auth.registering,
    error: state.auth.error,
    errorMessage: state.auth.errorMessage
  };
};

export default connect(mapStateToProps, { register, deleteError })(
  RegisterScreen
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#146687"
  },
  logo: {
    width: 80,
    height: 80,
    margin: 10
  },
  title: {
    fontFamily: "Thasadith-Regular",
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    margin: 6
  },
  buttons: {
    width: 100,
    height: 50,
    backgroundColor: "#2486ad",
    borderRadius: 10,
    justifyContent: "center",
    margin: 10
  },
  buttonsText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Thasadith-Regular",
    fontSize: 18
  },
  formGroup: {
    margin: 4
  },
  formLabel: {
    color: "#fff",
    fontFamily: "Thasadith-Regular",
    textAlign: "left",
    fontSize: 16
  },
  formInput: {
    width: 300,
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 10,
    color: "#000000",
    fontSize: 18
  },
  alert: {
    color: "#f77676",
    fontFamily: "Thasadith-Regular",
    fontStyle: "italic",
    fontSize: 12,
    textAlign: "right",
    marginTop: -20
  },
  passAlert: {
    color: "#7eff70",
    fontStyle: "italic",
    fontSize: 12,
    textAlign: "right",
    marginTop: -15
  },
  popup: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(36, 134, 173, 0.9)"
  },
  popupText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    margin: 5
  },
  icon: {
    width: 100,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5
  }
});
