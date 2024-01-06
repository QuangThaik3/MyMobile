import React from 'react'
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { userRequest } from '../data/requestMethod';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


const OrderDetails = ({ route }) => {
  const user = useSelector((state) => state.user?.currentUser);  
  const navigation = useNavigation();

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  const getCurrentDate = () => {
    const currentDate = new Date();
  
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = currentDate.getFullYear();
  
    const formattedDate = `${day}/${month}/${year}`;
  
    return formattedDate;
  };

  const { orderDetails } = route.params;
  
  const handleOrderDetails = async () => {
    if(user) {
      try {
        await userRequest.put(`/orders/update/${orderDetails.orderID}`, {
          check: 'Thành công',
        });
      } catch (err) {
        console.log(err);
      }
    }

    Alert.alert(
      'Thanh toán thành công',
      '',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Home');
          },
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{ padding: 10 }}>
      <View style={{ backgroundColor: '#ffffff',borderRadius: 5, padding: 12 }}>
      <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5, marginBottom: 15 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ fontSize: 17, fontWeight: 500, marginBottom:15, marginTop: 10 }}>Chi tiết đơn hàng</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Mã đơn hàng: </Text>
        <Text style={{ color: '#1D1D1F', fontSize: 12.7, fontWeight: 600 }}>#{orderDetails.orderID}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Ngày đặt hàng: </Text>
        <Text style={{ color: '#1D1D1F', fontSize: 12.7, fontWeight: 600 }}>{getCurrentDate()}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Tình trạng: </Text>
        <Text style={{ color: '#339901', fontSize: 12.5, fontWeight: 700 }}>Đang xử lý</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Tên khách hàng: </Text>
        <Text style={{ color: '#1D1D1F', fontSize: 12.7, fontWeight: 600 }}>{orderDetails.ten}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Số điện thoại: </Text>
        <Text style={{ color: '#1D1D1F', fontSize: 12.7, fontWeight: 600 }}>{orderDetails.tel}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Email: </Text>
        <Text style={{ color: '#1D1D1F', fontSize: 12.7, fontWeight: 600 }}>{orderDetails.email}</Text>
      </View>
      </View>
      <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5, marginBottom: 15 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Phương thức thanh toán: </Text>
        <Text style={{ color: '#1D1D1F', fontSize: 12.7, fontWeight: 600 }}>Chuyển khoản ngân hàng</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Tình trạng thanh toán: </Text>
        <Text style={{ color: '#339901', fontSize: 12.7, fontWeight: 700 }}>Đang chờ xử lý</Text>
      </View>
      </View>
      <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5, marginBottom: 20 }}>
      <View>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400, marginBottom: 10 }}>Sản phẩm:</Text>
        {orderDetails.products.map((product, index) => (
          <View key={index} style={{ borderColor: '#ddd', borderWidth: 0.5, borderRadius: 5, padding: 10, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
          <Text style={{ fontSize: 13, color: '#1D1D1F', fontWeight: 700, marginBottom: 10, width: 260 }}>{product.title}<Text style={{ fontWeight: 600 }}> - {formatPrice(product.price)}đ</Text></Text>
          {product.color && (
            <Text style={{ color: '#86868B', fontWeight: 400, fontSize: 12.5 }}>Màu sắc: {product.color}</Text>
            )}
            {product.size && (
              product.title.includes('Watch') ? (
                <Text style={{ color: '#86868B', fontWeight: 400, fontSize: 12.5 }}>Loại dây: {product.size}</Text>
              ) : (
                <Text style={{ color: '#86868B', fontWeight: 400, fontSize: 12.5 }}>Dung lượng: {product.size}</Text>
                )
            )}
          </View>
          <Text style={{ color: '#86868B', fontWeight: 400, fontSize: 12.5 }}>SL: {product.quantity}</Text>
        </View>
        ))}
      </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Tổng số tiền đã đặt hàng: </Text>
        <Text style={{ color: '#0066CC', fontSize: 17, fontWeight: 700 }}>{formatPrice(orderDetails.total)}đ</Text>
      </View>
      <TouchableOpacity onPress={handleOrderDetails} style={{ height: 38, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent:  'center', alignItems: 'center', marginBottom: 10}}>
        <Text style={{ color: 'white', fontSize: 12 }}>Thanh toán</Text>
      </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  )
}

export default OrderDetails
