import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { productData, rawData } from '../data/data'
import remove from '../assets/images/remove.png'
import { updateQuantity, removeProduct, updateCart, removeCart } from '../redux/cartRedux'
import { createSelector } from 'reselect'
import { CustomDesign } from './Register'
import { userRequest } from '../data/requestMethod'

const selectUser = (state) => state.user?.currentUser?._id;
const selectCarts = (state) => state.cart?.carts;
const User = (state) => state.user?.currentUser;

const cartProductsSelector = createSelector(
  [selectUser, selectCarts],
  (user, carts) => {
    if (user && carts?.[user]) {
      return carts[user].products;
    } else if (!user && carts?.undefined) {
      return carts.undefined.products;
    }
    return [];
  }
);

const Cart = ({ navigation }) => {
  const user = useSelector(selectUser);
  const USER = useSelector(User); 
  // const carts = useSelector(selectCarts);
  const total = useSelector((state) => state.cart?.carts?.[user]?.total);
  const [focusedInput, setFocusedInput] = useState(null);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [ten, setTen] = useState('');
  const [selectedTinh, setSelectedTinh] = useState(null);
  const [selectedHuyen, setSelectedHuyen] = useState(null);
  const [filteredHuyen, setFilteredHuyen] = useState([]);
  const [diaChi, setDiaChi] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [telError, setTelError] = useState('');
  const [tenError, setTenError] = useState('');

  const cartProducts = useSelector(cartProductsSelector);

  const [quantityInputs, setQuantityInputs] = useState(
    cartProducts.map((product) => (product.quantity ? product.quantity.toString() : '0'))
  );

  const handleDecreaseQuantity = (productId, productColor) => {
    if (user) {
      dispatch(updateQuantity({ userId: user, productId, newQuantity: -1, productColor }));
    } else {
      dispatch(updateQuantity({ productId, newQuantity: -1, productColor }));
    }
  };
  
  const handleIncreaseQuantity = (productId, productColor) => {
    if (user) {
      dispatch(updateQuantity({ userId: user, productId, newQuantity: 1, productColor }));
    } else {
      dispatch(updateQuantity({ productId, newQuantity: 1, productColor }));
    }
  };
  
  const handleRemoveProduct = (productId) => {
    console.log('Removing product:', productId);
    if (user) {
      dispatch(removeProduct({ userId: user, productId }));
    } else {
      dispatch(removeProduct({ productId }));
    }
  };

  const handleUpdateCart = () => {
    // Kiểm tra và cập nhật giỏ hàng dựa trên giá trị mới trong quantityInputs
    const updatedCartProducts = cartProducts.map((product, index) => {
      const newQuantity = parseInt(quantityInputs[index]);
      return {
        ...product,
        quantity: isNaN(newQuantity) ? product.quantity : newQuantity,
      };
    });
  
    if (user) {
      dispatch(updateCart({ userId: user, updatedCartProducts }));
    } else {
      dispatch(updateCart({ updatedCartProducts }));
    }
  };  
  
  useEffect(() => {
    if(USER) {
      setTel(USER.dienThoai);
      setEmail(USER.email);
      setTen(USER.ten);
    }
  }, [USER])

  useEffect(() => {
    setQuantityInputs(cartProducts.map((product) => (product.quantity ? product.quantity.toString() : '0')));
  }, [total]);
  

  const checkAllErrors = () => {
    checkEmail();
    checkTel();
    checkTen();
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
    checkAllErrors();
  };

  const getBorderStyle = (inputName) => {
    return {
      borderColor: focusedInput === inputName ? '#244fcf' : '#EBEBEB',
      borderWidth: 1,
      padding: 10,
      width: '100%',
      borderRadius: 6,
      textAlign: 'left',
      fontSize: 11.5,
      lineHeight: 24,
      marginTop: 8,
      height: 36.5,
      marginBottom: 3
    };
  }; 

  const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        color: "#353536",
    }
  });

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getProductImg = (title) => {
    const productInfo = productData.find((data) => data.title === title);
    return productInfo ? productInfo.img : [];
  }

  const checkEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? '' : 'Email không hợp lệ');
  };

  const checkTel = () => {
    const regex = /^0\d{9}$/;
    const isValid = regex.test(tel);
    setTelError(isValid ? '' : 'Số điện thoại không hợp lệ');
  };

  const checkTen = () => {
    const isValid = ten.length > 0;
    setTenError(isValid ? '' : 'Vui lòng nhập tên');
  };

  const lines = rawData.split('\n');
  const Tinh = [];
  const Huyen = [];

  lines.forEach((line, index) => {
    const [code, name] = line.split('-');

    if (name && code) {
      const trimmedName = name.trim();
      const trimmedCode = code.trim();

      if (trimmedName.includes('Tỉnh')) {
        const currentTinh = { label: trimmedName, value: trimmedCode, key: `tinh_${index}` };
        Tinh.push(currentTinh);
      } else {
        const tinhValue = trimmedCode.substring(trimmedCode.length - 3);
        const currentHuyen = { label: trimmedName, value: trimmedCode, key: `huyen_${index}` };
        Huyen.push(currentHuyen);
      }
    }
  });

  const handleTinhSelection = (item) => {
    setSelectedTinh(item);
    const filteredHuyen = Huyen.filter(huyen => huyen.value === item.value);
    setFilteredHuyen(filteredHuyen);
    setSelectedHuyen(null);
  };
    
  const handleOrder = async () => {
     if( ten.length > 0 && email.length > 0 && tel.length > 0 && tenError.length == 0 && emailError.length == 0 && telError.length == 0 && selectedHuyen !== null && selectedHuyen !== null && diaChi.length > 0) {
      const orderID = Date.now().toString().substring(9, 4) + Math.random().toString(36).substring(2, 8);
      if(user) {
        try{
          await userRequest.post("/orders", {
            orderID,
            userId: user,
            ten,
            email,
            tel,
            address: `${selectedHuyen.label}, ${selectedTinh.label}`,
            house: diaChi,
            check: 'Đang xử lý',
            product: cartProducts.map(product => ({
              productId: product.id,
              title: product.title,
              ...(product.color && { color: product.color }),
              quantity: product.quantity,
              price: product.price,
              ...(product.size && { size: product.size }),
            })),
            total,
          });    
        }  catch (err) {
          console.log(err);
        }
      }
        
        const orderDetails = {
          orderID,
          ten,
          email,
          tel,
          total,
          selectedTinh,
          selectedHuyen,
          diaChi,
          products: cartProducts,
        };
        
        navigation.navigate('OrderDetails', { orderDetails });

        const userId = user || 'undefined';
        dispatch(removeCart({ userId }));

     } else {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
     }
  }
  

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ fontSize: 17, fontWeight: 400, marginBottom:10, marginTop: 20 }}>Giỏ hàng của tôi</Text>
      </View>
      {cartProducts.length == 0 ? (
        <View style={{ height:500, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#777', textAlign: 'center', fontSize: 13.5 }}>Giỏ hàng của bạn đang trống!</Text>
        </View>
      ) : (
      <View style={{ padding: 10, flexDirection: 'column', gap: 12 }}>
      {cartProducts.map((product, index) => (
        <View key={product.id + product.color} style={{ backgroundColor: '#ffffff', padding: 15, borderRadius: 5, flexDirection: 'row', gap: 12 }}>
          <View>
          <Image 
            source={getProductImg(product.title)[product.image]}
            resizeMode='cover'
            style={{ width: 89, height: 89 }}
          />
          </View>
          <View style={{ flexDirection: 'column', gap: 3 }}>
          <Text style={{ fontSize: 12.5, width: 205, color: '#444', fontWeight: 700 }}>{product.title}</Text>
          {product.color && (
            <Text style={{ color: '#86868B', fontSize: 13 }}>Màu sắc: {product.color}</Text>
          )}
          {product.size && (
              product.title.includes('Watch') ? (
                <Text style={{ color: '#86868B', fontWeight: 400, fontSize: 13 }}>Loại dây: {product.size}</Text>
              ) : (
                <Text style={{ color: '#86868B', fontWeight: 400, fontSize: 13 }}>Dung lượng: {product.size}</Text>
                )
            )}
          <Text style={{ color: '#0066cc', fontWeight: 700, fontSize: 13.3 }}>Giá bán: {formatPrice(product.price)}đ</Text>
          <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'flex-end', alignItems: 'center', marginLeft: -45,  width: '100%', marginTop: 15 }}>
          <View style={{ backgroundColor: '#f5f5f7', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', width: 80}}>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(product.id, product.color)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 25 }}>
              <Text style={{ fontSize: 23, color: '#0066cc' }}>-</Text>
            </TouchableOpacity>
            <TextInput
              key={product.id + product.color}
              style={{ width: 30, textAlign: 'center', fontSize: 12.5, color: '#444' }}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onBlur={handleBlur}
              keyboardType='numeric'
              value={quantityInputs[index]}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  const newInputs = [...quantityInputs];
                  newInputs[index] = text;
                  setQuantityInputs(newInputs);
                }
              }}
              />
            <TouchableOpacity onPress={() => handleIncreaseQuantity(product.id, product.color)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 25}}>
              <Text style={{ fontSize: 15, color: '#0066cc' }}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleRemoveProduct(product.id)}>
            <Image 
            source={remove}
            resizeMode='cover'
            style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          </View>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={handleUpdateCart} style={{ backgroundColor: '#ffffff', borderColor: '#0066CC', borderWidth: 0.5, borderRadius: 5, padding: 12 }}>
        <Text style={{ fontSize: 12.2, color: '#0066CC', textAlign: 'center' }}>Cập nhập giỏ hàng</Text>
      </TouchableOpacity>
      <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 17, fontWeight: 600, marginBottom:15, marginTop: 20 }}>Thông tin thanh toán</Text>
      </View>
      <View style={{ backgroundColor: '#ffffff', padding: 10, borderRadius: 5, marginBottom: 5 }}>
      <View style={{ marginBottom: 5 }}>
        <TextInput
          style={getBorderStyle('tenHo')}
          onFocus={() => handleFocus('tenHo')}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          onChangeText={setTen}
          value={ten}
          placeholder='Tên'

        />
        {tenError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5, paddingLeft: 2 }}>{tenError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 5 }}>
        <TextInput 
        style={getBorderStyle('email')}
        onFocus={() => handleFocus('email')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        onChangeText={setEmail}
        value={email}
        placeholder='Email'
        />
        {emailError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5, paddingLeft: 2 }}>{emailError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 15 }}>
        <TextInput 
        style={getBorderStyle('dienthoai')}
        onFocus={() => handleFocus('dienthoai')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        onChangeText={setTel}
        value={tel}
        placeholder='Số điện thoại'
        />
        {telError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5, paddingLeft: 2 }}>{telError}</Text>
        )}
        <Text style={{ fontSize: 12.6, fontWeight: 600, marginTop: 10, marginBottom: 10 }}>Địa chỉ nhận hàng</Text>
        <View style={{ marginBottom: 5 }}>
        <Text style={styles.text}>Tỉnh, thành phố: </Text>
        <CustomDesign
          data={Tinh}
          placeholder="Chọn tỉnh, thành phố: "
          onItemSelected={handleTinhSelection}
          defaultText={selectedTinh}
        />
        </View>
        <View style={{ marginBottom: 5 }}>
        <Text style={styles.text}>Huyện: </Text>
        <CustomDesign
          data={filteredHuyen}
          placeholder="Chọn huyện: "
          onItemSelected={(item) => setSelectedHuyen(item)}
          defaultText={selectedHuyen}
        />
        </View>
        <View style={{ marginBottom: 5 }}>
          <Text style={styles.text}>Địa chỉ cụ thể: </Text>
          <TextInput 
            style={getBorderStyle('diachi')}
            onFocus={() => handleFocus('diachi')}
            onBlur={handleBlur}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={setDiaChi}
            value={diaChi}
          />
        </View>
      </View>
    </View>
      </View>
      <View style={{ backgroundColor: '#ffffff', borderRadius: 5, marginBottom: 10 }}>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
            <TextInput 
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onBlur={handleBlur}
            placeholder='Mã giảm giá'
            style={{ width: 200, borderColor:'#EBEBEB', borderWidth: 0.5, padding: 10, height: 35, fontSize: 12, borderTopLeftRadius: 5, borderBottomLeftRadius: 5  }}
            />
            <TouchableOpacity style={{ backgroundColor: '#aaa', marginLeft: 0, borderBottomEndRadius: 5, borderTopRightRadius:5,padding: 10, width: 120, height: 35 }}>
              <Text style={{ fontSize: 12, textAlign: 'center', color: '#ffffff' }}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between',  marginBottom: 15 }}>
            <Text style={{ fontSize: 12, color: '#86868B' }}>Tổng phụ:</Text>
            <Text style={{ fontSize: 12.2, fontWeight: 500 }}>{formatPrice(total)}đ</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomColor: '#EBEBEB', borderBottomWidth: 0.8, paddingBottom: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: 500 }}>Tổng cộng:</Text>
            <Text style={{ fontSize: 12.2, fontWeight: 700, color: '#0066CC' }}>{formatPrice(total)}đ</Text>
          </View>
          <TouchableOpacity onPress={handleOrder} style={{ height: 38, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent:  'center', alignItems: 'center'}}>
          <Text style={{ color: 'white', fontSize: 12 }}>Tiến hành đặt hàng</Text>
          </TouchableOpacity>
          <View>
            <Text style={{ color: '#e4434b', fontSize: 12, marginTop: 10, textAlign: 'left' }} >(*) Phí phụ thu sẽ được tính khi bạn tiến hành thanh toán.</Text>
          </View>
        </View>
      </View>
      </View>
      )}
    </View>
    </ScrollView>
  );
}

export default Cart;
