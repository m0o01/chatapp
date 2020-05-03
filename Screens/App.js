import React from "react";
import { View, ScrollView, Image, Text, Dimensions } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Ionicons";

import { restoreToken } from "../redux/actions/authActions";

import WelcomeScreen from "./Guest/WelcomeScreen";
import RegisterScreen from "./Guest/RegisterScreen";
import LoginScreen from "./Guest/LoginScreen";
import ChatsScreen from "./User/ChatsScreen";
import SearchUser from "./User/SearchUser";
import ChatScreen from "./User/ChatScreen";
import LogOutScreen from "./User/LogOutScreen";
import SettingsScreen from "./User/SettingsScreen";
import AuthLoadScreen from "./AuthLoadScreen";

const { width } = Dimensions.get("window");

let username = "Test";

const customDrawer = props => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10
        }}
      >
        <Image
          source={require("../assets/user.png")}
          style={{ height: 120, width: 120, borderRadius: 60, margin: 10 }}
        />
        <Text style={{ fontFamily: "Thasadith-Regular", fontSize: 20 }}>
          {username}
        </Text>
      </View>
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    </View>
  );
};

const Guest = createStackNavigator();

const GuestNavigator = () => {
  return (
    <Guest.Navigator initialRouteName="WelcomeScreen">
      <Guest.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Guest.Screen name="RegisterScreen" component={RegisterScreen} />
      <Guest.Screen name="LoginScreen" component={LoginScreen} />
    </Guest.Navigator>
  );
};

const User = createStackNavigator();

const UserNavigator = () => {
  return (
    <User.Navigator initialRouteName="ChatsScreen">
      <User.Screen name="ChatsScreen" component={ChatsScreen} />
      <User.Screen name="ChatScreen" component={ChatScreen} />
      <User.Screen name="SearchUser" component={SearchUser} />
    </User.Navigator>
  );
};

const UserNavigatorOptions = {
  initialRouteName: "Chats",
  defaultNavigationOptions: {
    headerTintColor: "#fff",
    title: "ChatApp",
    headerStyle: {
      backgroundColor: "#2486ad"
    },
    headerTitleStyle: {
      textAlign: "center",
      justifyContent: "center",
      flex: 1,
      color: "#fff",
      fontFamily: "Thasadith-Regular",
      fontWeight: undefined
    },
    headerRight: <View></View>
  },
  navigationOptions: {
    drawerIcon: ({ tintColor }) => (
      <Icon name="md-chatboxes" size={24} color={tintColor} />
    ),
    drawerLabel: "Chats"
  }
};

const Settings = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Settings.Navigator initialRouteName="SettingsScreen">
      <Settings.Screen name="SettingsScreen" component={SettingsScreen} />
    </Settings.Navigator>
  );
};

const SettingsNavigatorOptions = {
  initialRouteName: "MainScreen",
  defaultNavigationOptions: {
    headerTintColor: "#fff",
    title: "Settings",
    headerStyle: {
      backgroundColor: "#2486ad"
    },
    headerTitleStyle: {
      textAlign: "center",
      justifyContent: "center",
      flex: 1,
      color: "#fff",
      fontFamily: "Thasadith-Regular",
      fontWeight: undefined
    },
    headerRight: <View></View>
  },
  navigationOptions: {
    drawerIcon: ({ tintColor }) => (
      <Icon name="ios-settings" size={24} color={tintColor} />
    ),
    drawerLabel: "Settings"
  }
};

const UserDrawer = createDrawerNavigator();

const UserDrawerNavigator = () => {
  return (
    <UserDrawer.Navigator initialRouteName="Chats">
      <UserDrawer.Screen name="Chats" component={UserNavigator} />
      <UserDrawer.Screen name="Settings" component={SettingsNavigator} />
      <UserDrawer.Screen name="LogOut" component={LogOutScreen} />
    </UserDrawer.Navigator>
  );
};

const UserDrawerNavigatorOptions = {
  initialRouteName: "Chats",
  contentComponent: customDrawer,
  drawerWidth: (width * 3) / 4
};

const AppNavigator = createStackNavigator();

class ChatApp extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.restoreToken();
  }

  render() {
    if (this.props.logged === null) return <AuthLoadScreen />;

    return (
      <NavigationContainer>
        <AppNavigator.Navigator>
          {this.props.logged ? (
            <AppNavigator.Screen
              name="UserScreens"
              component={UserDrawerNavigator}
            />
          ) : (
            <AppNavigator.Screen
              name="GuestScreens"
              component={GuestNavigator}
            />
          )}
        </AppNavigator.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStatetoProps = state => {
  return {
    logged: state.auth.logged
  };
};

export default connect(mapStatetoProps, { restoreToken })(ChatApp);
