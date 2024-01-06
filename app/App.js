import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Home from './screens/Home';
import ProductList from './screens/ProductList';
import ProductID from "./screens/ProductID";
import Product from "./screens/Product";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Search from "./screens/Search";
import Password from "./screens/Password";


import { Provider } from "react-redux";
import { store, persistor } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react";
import User from "./screens/User";
import ResetPass from "./screens/ResetPass";
import ImageUploadScreen from "./screens/Image";
import History from "./screens/History";
import Cart from "./screens/Cart";
import OrderDetails from "./screens/OrderDetails";
import Order from "./screens/Order";
import OrderHighlight from "./screens/OrderHighlight";

const Stack = createStackNavigator();

const App = () => {
  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="ProductList" component={ProductList}/>
          <Stack.Screen name="Product" component={Product} />
          <Stack.Screen name="ProductID" component={ProductID} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Password" component={Password} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="ResetPass" component={ResetPass} />
          <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="Order" component={Order} />
          <Stack.Screen name="OrderHighlight" component={OrderHighlight} />
        </Stack.Navigator>
      </NavigationContainer>
    </PersistGate>
  </Provider>
  )
}

export default App