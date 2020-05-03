import React from "react";
import { connect } from "react-redux";
import { View, ActivityIndicator } from "react-native";

class AuthLoadScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.navigate(
      this.props.logged ? "UserScreens" : "GuestScreens"
    );
  }

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

const mapStatetoProps = state => {
  return {
    logged: state.auth.logged
  };
};

export default connect(mapStatetoProps, {})(AuthLoadScreen);
