import React from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";

import ChatApp from "./Screens/App";
import store from "./redux/store";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ChatApp />
      </Provider>
    );
  }
}
