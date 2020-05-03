import React from "react";
import { View, Image, StyleSheet, AsyncStorage } from "react-native";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/FontAwesome";
import { HeaderBackButton } from "react-navigation";

export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: props.navigation.getParam("socket"),
      currentUserUsername: "",
      currentUserId: "",
      chatId: "",
      messages: []
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        height: 80,
        backgroundColor: "#2486ad"
      },
      title: navigation.getParam("username"),
      headerLeft: (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <HeaderBackButton
            onPress={() => navigation.goBack()}
            tintColor="#fff"
          />
          <Image
            source={require("../../assets/user.png")}
            style={{ height: 60, width: 60, borderRadius: 50, marginLeft: -5 }}
          />
        </View>
      )
    };
  };

  componentDidMount() {
    this.bootstrapChat();
  }

  bootstrapChat = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({
      currentUserId: userData.id,
      currentUserUsername: userData.username
    });
    this.setState({
      chatId: `${
        this.state.currentUserUsername
      }-${this.props.navigation.getParam("username")}`
    });
    this.getMessages();
  };

  getMessages = async () => {
    if (this.props.navigation.getParam("searchedForUser")) {
      const chats = JSON.parse(await AsyncStorage.getItem("chats"));
      const chat = chats.find(chat => chat.chatId === this.state.chatId);
      if (chat) this.setState({ messages: chat.messages });
    } else {
      this.setState({ messages: this.props.navigation.getParam("messages") });
    }
  };

  updateMessageStorage = async () => {
    const chats = JSON.parse(await AsyncStorage.getItem("chats"));
    const chatIndex = chats.findIndex(
      chat => chat.chatId === this.state.chatId
    );
    if (chatIndex > -1) chats.splice(chatIndex, 1);
    chats.unshift({ chatId: this.state.chatId, messages: this.state.messages });
    await AsyncStorage.setItem("chats", JSON.stringify(chats));
  };

  sendMessage = async (messages = []) => {
    messages.forEach(message => {
      this.setState({
        messages: GiftedChat.append(this.state.messages, message)
      });
      this.state.socket.emit("message", {
        message: message.text,
        chatId: this.state.chatId,
        userId: this.state.currentUserId,
        createdAt: new Date()
      });
    });
    this.updateMessageStorage();
  };

  renderSend = props => {
    return (
      <Send {...props} containerStyle={styles.sendButton_container}>
        <Icon name="send-o" size={20} color="#fff" />
      </Send>
    );
  };

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2486ad"
          }
        }}
      />
    );
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.sendMessage}
        onInputTextChanged={this.messageTyping}
        renderSend={this.renderSend}
        renderBubble={this.renderBubble}
        user={{
          _id: this.state.currentUserId,
          name: this.state.currentUserUsername
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  sendButton_container: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2486ad",
    borderRadius: 50,
    margin: 5
  }
});
