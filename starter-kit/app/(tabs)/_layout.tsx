import { NativeRouter, Route, Link, Routes, useLocation } from "react-router-native";

import RouteStart from "./RouteStart";
import RouteUI from "./RouteUI";
import index from "./index";
import ARview from "./ARview";
import SettingsMenu from "./settings";
import { View } from "react-native";
import { Text } from "@rneui/base";
import { ThemedView } from "../../components/ThemedView";

import { StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";

import { ColorfulTabBar } from "react-navigation-tabbar-collection";
//<Icon.TabBarItem iconName="comments"/>

const TabBarEl = () => {
  return <View style={styles.tabBar}>
    <Link to="/" style={styles.tabItem} underlayColor="#f0f4f7">
      <Text>Home</Text>
    </Link>
    <Link to="/start" style={styles.tabItem} underlayColor="#f0f4f7">
      <Text>Start</Text>
    </Link>
    <Link to="/route" style={styles.tabItem} underlayColor="#f0f4f7">
      <Text>Route</Text>
    </Link>
    <Link to="/ar" style={styles.tabItem} underlayColor="#f0f4f7">
      <Text>AR View</Text>
    </Link>
    <Link to="/settings" style={styles.tabItem} underlayColor="#f0f4f7">
      <Text>Settings</Text>
    </Link>
  </View>
}

export default function App (){
    return (
        <NativeRouter>
          <Routes>
            <Route path="/" Component={index} />
            <Route path="/start" Component={RouteStart} />
            <Route path="/route" Component={RouteUI} />
            <Route path="/ar" Component={ARview} />
            <Route path="/settings" Component={SettingsMenu} />
          </Routes>
          <TabBarEl />
        </NativeRouter>
    );
  
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#eee',
    marginBottom: 0
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10
  }
});
