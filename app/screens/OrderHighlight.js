import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView} from 'react-native'
import { userRequest } from '../data/requestMethod';
import LoadingScreen from './LoadingScreen';
import moment from 'moment';

const OrderHighlight = ({route}) => {
  const [orders, setOrders] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = route.params.id;

  const formatDateTime = (dateTime) => {
    return moment(dateTime).format('MM/DD/YYYY');
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    setLoading(true);

    const getOrder = async () => {
      try{
        const res =  await userRequest.get(`/orders/details/${id}`);
        setOrders(res.data);
        setProducts(res.data.product);
        setLoading(false);
      }
      catch (err) {
        console.log(err);
        setLoading(false);
      } 
    }
    getOrder();
  },[id]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ fontSize: 17, fontWeight: 400, marginBottom:15, marginTop: 15 }}>Chi tiết đơn hàng</Text>
      </View>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View>
          <View style={{ backgroundColor: '#ffffff', borderRadius: 5, padding: 15, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#ddd', borderBottomWidth: 0.5, paddingBottom: 10 }}>
              <Text style={{ color: '#86868B', fontSize: 12.2 }}>Mã đơn hàng: </Text>
              <Text style={{ color: '#1D1D1F', fontSize: 12.5, fontWeight: 500 }}>#{orders.orderID}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#ddd', borderBottomWidth: 0.5, paddingBottom: 10, paddingTop: 10 }}>
              <Text style={{ color: '#86868B', fontSize: 12.2 }}>Ngày đặt hàng: </Text>
              <Text style={{ color: '#1D1D1F', fontSize: 12.5 }}>{formatDateTime(orders.createdAt)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingTop: 10 }}>
              <Text style={{ color: '#86868B', fontSize: 12.2 }}>Tình trạng: </Text>
              <View style={{ backgroundColor: '#22a335', padding: 5, borderRadius: 5 }}>
              <Text style={{fontSize: orders.check === 'Thành công' ? 12.2 : 12.5 , color: '#ffffff', paddingTop: orders.check === 'Thành công' ? 1 : 0, paddingBottom: orders.check === 'Thành công' ? 1 : 0}}>{orders.check}</Text>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: '#ffffff', borderRadius: 5, padding: 15 }}>
          <View>
            <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
              <Text style={{ color: '#86868B', fontSize: 12.2 }}>Tên khách hàng: </Text>
              <Text style={{ color: '#1D1D1F', fontSize: 12.5, fontWeight: 500 }}>{orders.ten}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5, paddingTop: 5 }}>
              <Text style={{ color: '#86868B', fontSize: 12.2 }}>Điện thoại: </Text>
              <Text style={{ color: '#1D1D1F', fontSize: 12.5 }}>{formatDateTime(orders.createdAt)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, paddingTop: 5 }}>
              <Text style={{ color: '#86868B', fontSize: 12.2 }}>Email: </Text>
              <Text style={{ color: '#1D1D1F', fontSize: 12.5 }}>{orders.email}</Text>
            </View>
            </View>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, paddingTop: 15, borderBottomColor: '#ddd', borderBottomWidth: 0.5 }}>
                <Text style={{ color: '#86868B', fontSize: 12.2 }}>Địa chỉ nhận hàng: </Text>
                <View>
                  <Text style={{ color: '#1D1D1F', fontSize: 12.5, textAlign: 'right' }}>{orders.house}</Text>
                  <Text style={{ color: '#1D1D1F', fontSize: 12.5, textAlign: 'right' }}>{orders.address}</Text>
                </View>
              </View>
            </View>    
            <View>
              <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5, paddingTop: 15, paddingBottom: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                <Text style={{ color: '#86868B', fontSize: 12.2 }}>Phương thức thanh toán: </Text>
                <Text style={{ color: '#1D1D1F', fontSize: 12.5 }}>Chuyển khoản ngân hàng</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5, paddingTop: 5 }}>
                <Text style={{ color: '#86868B', fontSize: 12.2 }}>Tình trạng thanh toán: </Text>
                {orders.check === 'Thành công' ? (
                  <Text style={{ color: '#339901', fontSize: 12.5 }}>Thanh toán thành công</Text>
                ) : (
                  <Text style={{ color: '#339901', fontSize: 12.5 }}>Đang chờ xử lý</Text>
                )}
              </View>
              </View>
            </View>     
          </View>
          <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5, marginBottom: 20 }}>
          <View>
            <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400, marginBottom: 10, marginTop: 15 }}>Sản phẩm:</Text>
            {products.map((product, index) => (
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
          <Text style={{ color: '#86868B', fontSize: 12.5, fontWeight: 400 }}>Tổng số tiền đã đặt hàng: </Text>
          <Text style={{ color: '#0066CC', fontSize: 17, fontWeight: 700 }}>{formatPrice(orders.total)}đ</Text>
          </View>
        </View>
        </View>
      )}
    </View>
    </ScrollView>
  )
}

export default OrderHighlight
