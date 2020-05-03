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

import { login, deleteError } from "../../redux/actions/authActions";

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: {
        username: "",
        vaild: false
      },
      password: {
        password: "",
        vaild: false
      },
      formVaild: false,
      modalVisible: false,
      loginState: "",
      icon: ""
    };
  }

  updateUsername = username => {
    if (username.lenght <= 0)
      this.setState({ username: { username: username, vaild: false } });
    else this.setState({ username: { username: username, vaild: true } });
  };

  updatePassword = password => {
    if (password.lenght <= 0)
      this.setState({ password: { password: password, vaild: false } });
    else this.setState({ password: { password: password, vaild: true } });
  };

  componentDidUpdate() {
    if (!this.state.formVaild) {
      if (this.state.username.vaild && this.state.password.vaild)
        this.setState({ formVaild: true });
    }

    if (this.props.logging !== prevProps.logging) {
      if (this.props.loggin) {
        this.setState({
          modalVisible: true,
          loginState: "Logging you in..."
        });
      } else if (this.props.error) {
        this.setState({ loginState: this.props.errorMessage, icon: "warning" });
        this.props.deleteError();
        setTimeout(() => {
          this.setState({ modalVisible: false, icon: "", loginState: "" });
        }, 3000);
      } else {
        this.setState({
          loginState: "Logged In\nSetting up everything for you... :)"
        });
        setTimeout(() => {
          this.setState({ modalVisible: false, icon: "", loginState: "" });
          this.props.navigation.navigate("AuthLoadScreen");
        }, 3000);
      }
    }
  }

  loginUser = async () => {
    this.props.login(
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
                <Icon name="warning" size={90} color="#f7ec79" />
              </View>
            )}
            <Text style={styles.popupText}>{this.state.loginState}</Text>
          </View>
        </Modal>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={styles.title}>Login Now!</Text>
        <KeyboardAvoidingView behavior="padding" enabled>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Username:</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.formInput}
              onChangeText={this.updateUsername}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.formInput}
              onChangeText={this.updatePassword}
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
          onPress={this.loginUser}
        >
          <Text style={styles.buttonsText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    logging: state.auth.logging,
    error: state.auth.error,
    errorMessage: state.auth.errorMessage
  };
};

export default connect(mapStateToProps, { login, deleteError })(LoginScreen);

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
