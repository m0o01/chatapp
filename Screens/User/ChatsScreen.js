import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { NavigationEvents } from "react-navigation";
import io from "socket.io-client";
import uuid from "uuid";

class Chat extends React.Component {
  render() {
    const time = new Date(this.props.messages[0].createdAt);
    return (
      <TouchableOpacity
        style={styles.conversation}
        onPress={() =>
          this.props.navigation.navigate("ChatScreen", {
            messages: this.props.messages,
            username: this.props.chatId.split("-")[1],
            socket: this.props.socket
          })
        }
      >
        <Image
          source={require("../../assets/user.png")}
          style={styles.profileImage}
        />
        <View style={styles.container}>
          <Text style={styles.conversationTitle}>
            {this.props.chatId.split("-")[1]}
          </Text>
          <Text style={styles.conversationLastMessage}>
            {this.props.messages[0].user.name === this.props.username ? (
              <Text>You: </Text>
            ) : (
              <Text>{this.props.messages[0].user.name}: </Text>
            )}
            {this.props.messages[0].text}
          </Text>
        </View>
        <Text style={styles.conversationLastMessageTime}>
          {time.getHours()}:{time.getMinutes()}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default class ChatsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      chats: [],
      socket: ""
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam("searchUser")}>
          <Icon
            name="ios-add"
            size={45}
            color="#fff"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon
            name="ios-menu"
            size={30}
            color="#fff"
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    this.bootstrapApp();
    this.props.navigation.setParams({ searchUser: this.searchUser });
  }

  bootstrapApp = async () => {
    await this.getChats();
    await this.getData();
    const socket = io.connect("http://192.168.43.133:3000");
    socket.on("connect", () => {
      socket.emit("register", { username: this.state.username });
    });
    this.setState({ socket });
    this.socketListeners();
  };

  socketListeners = async () => {
    this.state.socket.on("message", async data => {
      const msg = {
        _id: uuid.v4(),
        text: data.message,
        createdAt: new Date(data.createdAt),
        user: {
          _id: data.userId,
          name: data.chatId.split("-")[1],
          avatar: require("../../assets/user.png")
        }
      };
      const { chatId } = data;
      await this.updateAsyncStorageMessages(msg, chatId);
      this.getChats();
    });

    this.state.socket.on("messages", messages => {
      messages.map(async message => {
        const msg = {
          _id: uuid.v4(),
          text: message.message,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.userId,
            name: message.chatId.split("-")[1],
            avatar: require("../../assets/user.png")
          }
        };
        const { chatId } = message;
        await this.updateAsyncStorageMessages(msg, chatId);
        this.getChats();
      });
    });
  };

  updateAsyncStorageMessages = async (msg, chatId) => {
    let chats = JSON.parse(await AsyncStorage.getItem("chats"));
    const chatIndex = chats.findIndex(chat => chat.chatId === chatId);
    if (chatIndex > -1) {
      const chat = chats[chatIndex];
      chats.splice(chatIndex, 1);
      chats.unshift({ chatId, messages: [msg, ...chat.messages] });
    } else {
      chats.unshift({ chatId, messages: [msg] });
    }
    AsyncStorage.setItem("chats", JSON.stringify(chats));
  };

  componentWillUnmount() {
    this.state.socket.close();
  }

  getChats = async () => {
    const chats = JSON.parse(await AsyncStorage.getItem("chats"));
    this.setState({ chats });
  };

  getData = async () => {
    const { username } = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ username });
  };

  searchUser = () => {
    this.props.navigation.navigate("SearchUser", { socket: this.state.socket });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            this.getChats();
          }}
        />
        {this.state.chats.length > 0 ? (
          <ScrollView style={{ flex: 1 }}>
            {this.state.chats.map(chat => {
              return (
                <Chat
                  chatId={chat.chatId}
                  username={this.state.username}
                  messages={chat.messages}
                  key={uuid.v4()}
                  navigation={this.props.navigation}
                  socket={this.state.socket}
                />
              );
            })}
          </ScrollView>
        ) : (
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => this.searchUser()}
          >
            <Icon name="ios-person-add" size={120} color="#e3e3e3" />
            <Text style={styles.chatState}>
              {"No chats Yet...\nStart Adding People Now!"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  conversation: {
    flex: 1,
    height: 85,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e1e1e1",
    padding: 5
  },
  profileImage: {
    height: 70,
    width: 70,
    borderRadius: 50
  },
  container: {
    flex: 4,
    paddingLeft: 10
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10
  },
  conversationLastMessage: {
    fontFamily: "Thasadith-Regular",
    fontSize: 14,
    marginTop: 3,
    textAlign: "left"
  },
  conversationLastMessageTime: {
    flex: 1,
    fontSize: 12
  },
  chatState: {
    margin: 4,
    fontSize: 18,
    fontFamily: "Thasadith-Regular",
    textAlign: "center"
  }
});
