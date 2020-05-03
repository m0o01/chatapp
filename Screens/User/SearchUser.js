import React from "react";
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import uuid from "uuid";

import { search, deleteError } from "../../redux/actions/authActions";

class User extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.userResult}
        onPress={() =>
          this.props.navigation.navigate("ChatScreen", {
            username: this.props.user.username,
            socket: this.props.navigation.getParam("socket"),
            searchedForUser: true
          })
        }
      >
        <Image
          source={require("../../assets/user.png")}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{this.props.user.username}</Text>
      </TouchableOpacity>
    );
  }
}

class SearchUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchState: "",
      searchResults: [],
      searching: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Search User"
    };
  };

  componentDidUpdate(prevProps) {
    if (this.props.searching !== prevProps.searching) {
      if (this.props.searching) {
        this.setState({ searching: true });
      } else if (this.props.error) {
        this.setState({
          searchResults: [],
          searching: false,
          searchState: this.props.errorMessage
        });
        this.props.deleteError();
      } else {
        this.setState({ searchResults: this.props.results, searching: false });
      }
    }
  }

  searchUser = username => {
    if (username) {
      this.setState({ searching: true });
      this.props.search(username);
    } else {
      this.setState({
        searchResults: [],
        searching: false,
        searchState: "No users were found..."
      });
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.formInput}
          onChangeText={this.searchUser}
          placeholder="Type in the username here..."
        />
        {this.state.searchResults.length === 0 ? (
          this.state.searching ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ActivityIndicator size="large" color="#e3e3e3" />
              <Text style={styles.searchState}>Searching...</Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="emoji-sad" size={120} color="#e3e3e3" />
              <Text style={styles.searchState}>
                {this.state.searchState || "No users were found..."}
              </Text>
            </View>
          )
        ) : (
          <ScrollView>
            {this.state.searchResults.map(user => (
              <User
                user={user}
                navigation={this.props.navigation}
                key={uuid.v4()}
              />
            ))}
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    searching: state.auth.searching,
    results: state.auth.results,
    error: state.auth.error,
    errorMessage: state.auth.errorMessage
  };
};

export default connect(mapStateToProps, { search, deleteError })(SearchUser);

const styles = StyleSheet.create({
  formInput: {
    fontFamily: "Thasadith-Regular",
    height: 50,
    color: "#000000",
    fontSize: 16,
    backgroundColor: "#ededed"
  },
  userResult: {
    flex: 1,
    flexDirection: "row",
    height: 85,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e1e1e1",
    padding: 5
  },
  profileImage: {
    height: 70,
    width: 70,
    borderRadius: 50
  },
  username: {
    fontSize: 16,
    fontFamily: "Thasadith-Regular",
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10
  },
  searchState: {
    margin: 4,
    fontSize: 18,
    fontFamily: "Thasadith-Regular",
    textAlign: "center"
  }
});
