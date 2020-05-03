import React from "react";
import { ActivityIndicator, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

import { logout } from "../../redux/actions/authActions";

class LogOutScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerIcon: ({ tintColor }) => (
        <Icon name="ios-log-out" size={24} color={tintColor} />
      ),
      drawerLabel: "Log Out"
    };
  };
  componentDidMount = () => {
    this.props.logout();
    this.this.props.navigation.navigate("GuestScreens");
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#146687",
          justifyContent: "center"
        }}
      >
        <ActivityIndicator size="large" color="#75d7ff" />
      </View>
    );
  }
}

export default connect(() => {}, { logout })(LogOutScreen);
