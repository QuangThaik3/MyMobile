import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { publicRequest } from '../data/requestMethod';
import Product from './Product';
import { CustomDesign } from './Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultUser from '../assets/images/default-user.jpg'
import moment from 'moment'

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
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    ratingBar: {
      height: 12.5,
      backgroundColor: '#FEB700',
      borderRadius: 5,
      zIndex: 2
    },
    ratingView: {
      height: 12.5,
      marginLeft: 5,
      borderRadius: 5,
      backgroundColor: '#e9ecef',
      width: 200
    }
})


const ProductList = ({ route }) => {
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [starRating, setStarRating] = useState(5);
  const [focusedInput, setFocusedInput] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const { title } = route.params;

  const [username, setUserName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewSent, setReviewSent] = useState(false);

  const [ten, setTen] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentSent, setCommentSent] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get(`/products?top=${title}`);
        setProducts(res.data); 
        setLoading(false);
      } catch (err) {
        console.error(err); 
        setLoading(false);
      }
    };
    getProduct();
  },[]);
  let cat;

  if(!loading) {
    const allCategories = products.map((item) => item.category);
    
    cat = [...new Set(allCategories)];
  }

  useEffect(() => {
    const getReviews = async () => {
      const existingReviews = await AsyncStorage.getItem('productReviews');
      const reviewData = existingReviews ? JSON.parse(existingReviews) : [];

      const filteredReviews = reviewData.filter(review => review.title.title === route.params.title); 

      setReviews(filteredReviews);

    }
    getReviews();
  },[title, reviewSent]);

  useEffect(() => {
    const getComments = async () => {
      const existingComments = await AsyncStorage.getItem('productComments');
      const commentData = existingComments ? JSON.parse(existingComments) : [];

      const filteredComments = commentData.filter(comment => comment.title.title === route.params.title);

      setComments(filteredComments);
    }
    getComments();
  }, [title, commentSent]);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const getBorderStyle = (inputName) => {
    return {
      borderColor: focusedInput === inputName ? '#244fcf' : '#EBEBEB',
      borderWidth: 1,
      padding: 10,
      width: '90%',
      borderRadius: 6,
      textAlign: 'left',
      fontSize: 11.5,
      lineHeight: 24,
      marginTop: 8,
      height: 37,
    };
  }; 

  const handlePress = (item) => {
        setSelectedItem(item); 
  };

  const handleReview = async () => {
    if(username.length == 0 && reviewText.length == 0) {
      return alert('Vui lòng nhập đầy đủ thông tin');
    }

    const reviewData = {
      title: route.params,
      username,
      reviewText,
      starRating,
      reviewDate: new Date().toISOString()
    }

    const existingReviews = await AsyncStorage.getItem('productReviews');
    const reviews = existingReviews ? JSON.parse(existingReviews) : [];

    reviews.push(reviewData);

    await AsyncStorage.setItem('productReviews', JSON.stringify(reviews));

    setUserName('');
    setReviewText('');
    setStarRating(5);
    setReviewSent((prevReviewSent) => !prevReviewSent);

    console.log(reviews);

  }

  const handleComment = async () => {
    if(ten.length == 0 && email.length == 0 && content.length == 0) {
      return alert('Vui lòng nhập đầy đủ thông tin');
    }

    if(emailError.length == 0) {
      const reviewData = {
        title: route.params,
        ten,
        content,
        reviewDate: new Date().toISOString()
      }

      const existingComments = await AsyncStorage.getItem('productComments');
      const comments = existingComments ? JSON.parse(existingComments) : [];

      comments.push(reviewData);

      await AsyncStorage.setItem('productComments', JSON.stringify(comments));

      setTen('');
      setContent('');
      setEmail('');
      setCommentSent((prevCommentSent) => !prevCommentSent);

      console.log(comments);
    }
  }

  const formatDateTime = (dateTime) => {
    return moment(dateTime).format('MM/DD/YYYY-HH:mm:ss');
  };
  
  const Sort = [
    { label: 'Giá cao đến thấp', value: '1' },
    { label: 'Mới nhất', value: '2' },
    { label: 'Tên: A đến Z', value: '3' },
    { label: 'Tên: Z đến A', value: '4'},
    { label: 'Giá thấp đến cao', value: '5'},
  ];

  const checkEmailOrPhone = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d+$/;

    if(emailRegex.test(input)) {
      return '';
    } else if(phoneRegex.test(input)) {
      return '';
    } else {
      return 'Vui lòng nhập địa chỉ email hoặc số điện thoại hợp lệ.';
    }
  };

  const handleEmailOrPhone = (input) => {
    setEmail(input);
    const error = checkEmailOrPhone(input);
    setEmailError(error);
  };

  const calculateRatingSummary = () => {
    const summary = {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0,
    };

    reviews.forEach((review) => {
      if (review.title.title === route.params.title) {
        summary[review.starRating.toString()] += 1;
      }
    });

    return summary;
  };

  const renderRatingBars = () => {
    const summary = calculateRatingSummary();

    const reversedKeys = Object.keys(summary).reverse();

    return reversedKeys.map((rating, index) => (
      <View key={index} style={styles.ratingContainer}>
        <Text style={{ fontWeight: 400, fontSize: 12.5, color: '#969696', marginTop: -2, paddingRight: 3 }}>{`${rating}`}</Text>
        <MaterialIcons 
        name={"star"}
        size={14.5}
        style={styles.starSelected}
        />
        <View style={styles.ratingView}>
          <View style={[styles.ratingBar, { width: reviews.length > 0 ? `${(summary[rating] / reviews.length) * 100}%` : '0%' }]} />
        </View>
      </View>
    ));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 30 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 17, fontWeight: 500 }}>{title}</Text>
        </View>

        <View style={{ padding: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginTop: 20 }}>
           <View style={{ flexDirection: 'row', marginBottom: 16 }}>
           <View style={{ flexDirection: 'row', gap: 10, height: 37}}>
           <TouchableOpacity
            onPress={() => handlePress(null)}
            style={{ backgroundColor: selectedItem === null ? '#244fcf' : '#EBEBEB', padding: 10, borderRadius: 5 }}
          >
            <Text style={{ color: selectedItem === null ? 'white' : 'black', fontSize: 12 }}>Tất cả</Text>
          </TouchableOpacity>
          {loading ? (
            <Text>Đang tải dữ liệu...</Text>
          ) : (
            cat.map((item) => (
              <TouchableOpacity
              key={item}
              onPress={() => handlePress(item)}
              style={{ backgroundColor: selectedItem === item ? '#244fcf' : '#EBEBEB', padding: 10, borderRadius: 5 }}
              >
              <Text style={{ color: selectedItem === item ? 'white' : 'black', fontSize: 12 }}>{item}</Text>
              </TouchableOpacity>
              ))
            )}
           </View>
           </View>
        </ScrollView>
        <View style={{paddingLeft: 10, width: '70%'}}>
            <CustomDesign 
            data={Sort}
            placeholder={'Thứ tự hiển thị'}
            onItemSelected={(item) => setSelectedSort(item)}
            defaultText={selectedSort}
            />
        </View>
        <Product title={title} item={selectedItem} selectedSort={selectedSort} />
        </View>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
           <Text style={{ fontSize: 17, fontWeight: 500 }}>Tổng quan đánh giá</Text>
          </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        {reviews && (
          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, paddingRight: 20 }}>
            <Text style={{ fontSize: 35, fontWeight: 700, color: '#1d1d1f' }}>{reviews.length}</Text>
            <Text style={{ color: '#515154', fontSize: 10 }}>Đánh Giá</Text>
          </View>
        )}
        <View style={{ flexDirection: 'column', paddingRight: 3 }}>
        {renderRatingBars()}
        </View>
        </View>
        </View>
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Đánh giá danh mục</Text>
            </View>
            <View>
                <Text style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 25 }}>Viết đánh giá của riêng bạn</Text>   
            <View style={{ flexDirection: 'row',marginBottom: 15 }}>
                <Text style={{ fontSize: 11.5, fontWeight: 600, paddingTop: 4 }}>Chất lượng: </Text>                
                <View style={styles.stars}>
                    <TouchableOpacity onPress={() => setStarRating(1)}>
                        <MaterialIcons 
                        name={starRating >= 1 ? "star" : "star-border"}
                        size={20}
                        style={starRating >= 1 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStarRating(2)}>
                    <MaterialIcons 
                        name={starRating >= 2 ? "star" : "star-border"}
                        size={20}
                        style={starRating >= 2 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStarRating(3)}>
                    <MaterialIcons 
                        name={starRating >= 3 ? "star" : "star-border"}
                        size={20}
                        style={starRating >= 3 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStarRating(4)}>
                    <MaterialIcons 
                        name={starRating >= 4 ? "star" : "star-border"}
                        size={20}
                        style={starRating >= 4 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStarRating(5)}>
                    <MaterialIcons 
                        name={starRating >= 5 ? "star" : "star-border"}
                        size={20}
                        style={starRating >= 5 ? styles.starSelected : styles.starUnSelected}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 10.8, fontWeight: 600 }}>Tên của bạn: </Text>
                <TextInput 
                style={getBorderStyle('maGioiThieu')}
                onFocus={() => handleFocus('maGioiThieu')}
                onBlur={handleBlur}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                onChangeText={setUserName}
                value={username}
                />
            </View>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 10.8, fontWeight: 600 }}>Đánh giá danh mục: </Text>
                <TextInput 
                style={getBorderStyle('danhgia')}
                onFocus={() => handleFocus('danhgia')}
                onBlur={handleBlur}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                onChangeText={setReviewText}
                value={reviewText}
                />
            </View>
            </View>
            <TouchableOpacity onPress={handleReview} style={{ height: 34, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent:  'center', alignItems: 'center', width: '30%', marginBottom: 5 }}>
                <Text style={{ fontSize: 12, color: 'white' }}>Gửi</Text>
            </TouchableOpacity>
        </View>
        <View>
          {reviews?.map((review, index) => (
            <View key={index} style={{ padding: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 7 }}>
              <Image 
              source={defaultUser}
              resizeMode='cover'
              style={{ width: 30 , height: 30, borderRadius: 50 }}
              />
              <Text style={{ fontSize: 13, fontWeight: 700, color: '#444444' }}>{review.username}</Text>
              <Text style={{ fontSize: 11.5, color: '#888888', paddingTop: 1 }}>{formatDateTime(review.reviewDate)}</Text>
              </View>
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
                <View style={{ borderBottomColor: '#EBEBEB', borderBottomWidth: 1, paddingBottom: 8, paddingTop: 4, paddingLeft: 2}}>
                  <Text style={{ fontSize: 12.5, color: '#1D1D1F', fontWeight: 400 }}>{review.reviewText}</Text>
                </View>
            </View>
          ))}
        </View>
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Bình luận</Text>
            </View>
            <View>
                <Text style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 25 }}>Viết bình luận của bạn</Text>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: 600 }}>Tên của bạn: </Text>
                    <TextInput 
                    style={getBorderStyle('ten')}
                    onFocus={() => handleFocus('ten')}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    onChangeText={setTen}
                    value={ten}
                    />
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: 600 }}>Email hoặc số điện thoại: </Text>
                    <TextInput 
                    style={getBorderStyle('emailorSoDienThoai')}
                    onFocus={() => handleFocus('emailorSoDienThoai')}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    onChangeText={handleEmailOrPhone}
                    value={email}
                    />
                    {emailError.length > 0 && (
                      <Text style={{ color: 'red', fontSize: 11.5 }}>{emailError}</Text>
                    )}
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: 600 }}>Nội dung bình luận: </Text>
                    <TextInput 
                    style={getBorderStyle('Binhluan')}
                    onFocus={() => handleFocus('Binhluan')}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    onChangeText={setContent}
                    value={content}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={handleComment} style={{ height: 34, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent:  'center', alignItems: 'center', width: '30%', marginBottom: 5 }}>
                <Text style={{ fontSize: 12, color: 'white' }}>Gửi</Text>
            </TouchableOpacity>
        </View>
        <View>
          {comments?.map((comment, index) => (
            <View key={index} style={{ padding: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 3 }}>
              <Image 
              source={defaultUser}
              resizeMode='cover'
              style={{ width: 30 , height: 30, borderRadius: 50 }}
              />
              <Text style={{ fontSize: 13, fontWeight: 700, color: '#444444' }}>{comment.ten}</Text>
              <Text style={{ fontSize: 11.5, color: '#888888', paddingTop: 1 }}>{formatDateTime(comment.reviewDate)}</Text>
              </View>
              <View style={{ borderBottomColor: '#EBEBEB', borderBottomWidth: 1, paddingBottom: 8}}>
                <Text style={{ fontSize: 13, paddingLeft: 39 }}>{comment.content}</Text>
              </View>
            </View>
          ))}
        </View>
        </View>
    </ScrollView>    

  )
}

export default ProductList
