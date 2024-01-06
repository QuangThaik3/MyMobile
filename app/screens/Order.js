import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { userRequest } from '../data/requestMethod';
import { useSelector } from 'react-redux';
import moment from 'moment';
import LoadingScreen from './LoadingScreen';
import { useNavigation } from '@react-navigation/native';

const Order = ({ route }) => {
    const id = route.params.id; 
    const navigation = useNavigation();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDateTime = (dateTime) => {
        return moment(dateTime).format('MM/DD/YYYY HH:mm:ss');
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
 
    useEffect(() => {
        setLoading(true);
        const getOrder = async () => {
            try{
                const res = await userRequest.get(`/orders/find/${id}`);
                setOrders(res.data);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
        getOrder();
    }, [id]);  

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ fontSize: 17, fontWeight: 400, marginBottom:10, marginTop: 20 }}>Đơn đặt hàng của tôi</Text>
        </View>
        <View>
        {loading ? (
            <LoadingScreen />
        ) : (
        <View style={{ padding: 10 }}> 
        {orders.length == 0 ? (
          <View style={{ height:440, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#777', textAlign: 'center', fontSize: 13.5 }}>Không có lịch sử đặt hàng</Text>
          </View>
        ) : (
            <View style={{ flexDirection: 'column', gap: 10 }}>
                {orders.map((item, index) => (
                    <View key={index} style={{ padding: 15, backgroundColor: '#ffffff', borderRadius: 5 , position: 'relative'}}>
                        <View style={{ flexDirection: 'row', gap: 2, marginBottom: 5 }}>
                            <Text style={{ color: '#86868B', fontSize: 12 }}>Mã đơn hàng: </Text>
                            <Text style={{ color: '#1D1D1F', fontSize: 12.5, fontWeight: 400 }}>{item.orderID}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 2, marginBottom: 5 }}>
                            <Text style={{ color: '#86868B', fontSize: 12 }}>Ngày đặt hàng: </Text>
                            <Text style={{ color: '#1D1D1F', fontSize: 12.5, fontWeight: 400 }}>{formatDateTime(item.createdAt)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 2, marginBottom: 5 }}>
                            <Text style={{ color: '#86868B', fontSize: 12 }}>Tổng tiền: </Text>
                            <Text style={{ color: '#1D1D1F', fontSize: 12.5, fontWeight: 600 }}>{formatPrice(item.total)}đ</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 2, marginBottom: 5 }}>
                            <Text style={{ color: '#86868B', fontSize: 12 }}>Phương thức thanh toán: </Text>
                            <Text style={{ color: '#1D1D1F', fontSize: 12.5, fontWeight: 600 }}>Chuyển khoản ngân hàng</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('OrderHighlight', { id: item.orderID })}>
                            <Text style={{ color: '#0066CC', fontSize: 12.3 }}>Xem chi tiết</Text>
                        </TouchableOpacity>
                        <View style={{ position: 'absolute', top: 15, right: 15, backgroundColor: item.check === 'Thành công' ? '#22a335' : '#FEB700', padding: 5, borderRadius: 5 }}>
                            <Text style={{ fontSize: item.check === 'Thành công' ? 11.5 : 12 , color: '#ffffff', paddingTop: item.check === 'Thành công' ? 1 : 0, paddingBottom: item.check === 'Thành công' ? 1 : 0}}>{item.check}</Text>
                        </View>
                    </View>
                ))}
            </View>
        )}
        </View>
        )}
        </View>
    </ScrollView>    
  )
}

export default Order
