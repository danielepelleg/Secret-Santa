import React, {useContext} from "react";
import { SafeAreaView } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { AuthContext } from '../navigation/AuthProvider';

import SocialButton from "../components/SocialButton";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddGroupScreen from "../screens/AddGroupScreen";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const {logout} = useContext(AuthContext);
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        label={() => (
          <SocialButton buttonTitle="Logout" btnType="log-out-outline"
          color="#18171c"
          backgroundColor="#d3dbed"
          // android renders the button over the item
          onPress={() => logout()}
          />
        )}
        // ios renders the item over the button
        onPress={() => logout()}
      />
    </SafeAreaView>
  );
}

const AppStack = () => {
  return (
    <Drawer.Navigator
      headerMode="none"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HOME" component={HomeScreen} />
      <Drawer.Screen name="PROFILE" component={ProfileScreen} />
      <Drawer.Screen name="CREATE GROUP" component={AddGroupScreen} />
      {/*<Drawer.Screen name="Join Group" component={Home} />
        <Drawer.Screen name="My Secrets" component={Home} />*/}
    </Drawer.Navigator>
  );
};

export default AppStack;
