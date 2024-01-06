import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialIcons } from '@expo/vector-icons'

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
      borderTopColor: '#EBEBEB',
      borderTopWidth: 0.5,
      marginTop: 30
  },
  stars: {
      display: 'flex',
      flexDirection: 'row'
  },
  starUnSelected: {
      color: '#aaa'
  },
  starSelected: {
      color: '#ffb300'
  },
})

const History = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const user = useSelector((state) => state.user?.currentUser?._id);

  useEffect(() => {
    const getReviews = async () => {
      const existingReviews = await AsyncStorage.getItem('productReviewId');
      const reviewData = existingReviews ? JSON.parse(existingReviews) : [];

      const filteredReviews = reviewData.filter(review => review.userID === user);

      setReviews(filteredReviews);
    }
    getReviews();
  }, [user]);

  const formatDateTime = (dateTime) => {
    return moment(dateTime).format('MM/DD/YYYY HH:mm:ss');
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ fontSize: 20, fontWeight: 400, marginBottom:10, marginTop: 20 }}>Lịch sử đánh giá sản phẩm</Text>
      </View>
      {reviews?.length == 0 ? (
        <View style={{ height:500, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#777', textAlign: 'center', fontSize: 13.5 }}>Chưa có lịch sử đánh giá sản phẩm nào!</Text>
        </View>
      ) : (
        reviews?.map((review, index) => (
          <View key={index} style={{ padding: 12 }}>
          <View style={{ padding: 14, backgroundColor: '#ffffff', borderRadius: 5 }}>
            <View>
              <Text style={{ color: '#1d1d1f', fontSize: 12.5, paddingLeft: 3, marginBottom: 10 }}>{review.reviewText}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 13, marginBottom: 10 }}>
            <View style={styles.stars}>
                    <TouchableOpacity>
                        <MaterialIcons 
                        name={review.starRating >= 1 ? "star" : "star-border"}
                        size={18}
                        style={review.starRating >= 1 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <MaterialIcons 
                        name={review.starRating >= 2 ? "star" : "star-border"}
                        size={18}
                        style={review.starRating >= 2 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <MaterialIcons 
                        name={review.starRating >= 3 ? "star" : "star-border"}
                        size={18}
                        style={review.starRating >= 3 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <MaterialIcons 
                        name={review.starRating >= 4 ? "star" : "star-border"}
                        size={18}
                        style={review.starRating >= 4 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <MaterialIcons 
                        name={review.starRating >= 5 ? "star" : "star-border"}
                        size={18}
                        style={review.starRating >= 5 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: '#888888', paddingTop: 1 }}>{formatDateTime(review.reviewDate)}</Text>
                </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
                  <Text style={{ fontSize: 11.8, color: '#888888', paddingLeft: 3 }}>Đánh giá sản phẩm: </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('ProductID', { productId: review.productID, randomIndex: 0 })}>
                    <Text style={{ color: '#0066cc', fontWeight: 700, fontSize: 12.5, marginTop: -1 }}>{review.productTitle}</Text>
                  </TouchableOpacity>
                </View>
          </View>
          </View>
        ))
      )}
    </View>
  )
}

export default History
