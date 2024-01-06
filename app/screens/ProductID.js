import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import v from '../assets/images/tich.jpg';
import { publicRequest } from '../data/requestMethod';
import ok from '../assets/images/ok.jpg';
import { productData } from '../data/data';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultUser from '../assets/images/default-user.jpg'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { addProduct } from '../redux/cartRedux';

const styles = StyleSheet.create({
    color: {
        width: 29,
        height: 29,
        borderRadius: 50,
        position: 'relative'
    },
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

const ProductID = ({ route }) => {
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const { productId, randomIndex } = route.params;
  const [starRating, setStarRating] = useState(5);
  const [focusedInput, setFocusedInput] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null); 
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);

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

  const user = useSelector((state) => state.user?.currentUser?._id);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart?.carts);
  console.log(cart[user]?.products);

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

  const handleCapacityClick = (capacity) => {
    setSelectedCapacity(capacity);
  };

  const handleColorClick = (index, color) => {
    setSelectedColorIndex(index);
    setSelectedColor(color);

  };

  const shouldShowBorderColor = (color) => {
    return selectedColor === color;
  };

  useEffect(() => {
    setLoading(true);

    const getProduct = async () => {
        try{
            const res = await publicRequest.get(`/products/find/${productId}`);
            setProduct(res.data);
            setLoading(false);
        }
        catch (err) {
            console.error(err);
            setLoading(false);
        }
    };
    getProduct();

  },[productId, randomIndex]);

  useEffect(() => {
      if (!loading) {
        setSelectedCapacity(product.size);
        setSelectedColor(product.color[randomIndex]);
      }
  }, [loading, randomIndex, selectedCapacity]);

  useEffect(() => {
    if (selectedCapacity != product.size) {

      const selectedType = productType.find((type) => type.size === selectedCapacity);
  
      if (selectedType) {
        const newProductId = selectedType._id;
  
        const ProductDetails = async () => {
          setLoading(true);
          try {
            const res = await publicRequest.get(`/products/find/${newProductId}`);
            setProduct(res.data);
            setLoading(false);
          } catch (err) {
            console.error(err);
            setLoading(false);
          }
        };
  
        ProductDetails();
        setSelectedColorIndex(null);
      }
    }
  }, [selectedCapacity]); 

  useEffect(() => {
    
        const getProducts = async () => {
            try{
                const res = await publicRequest.get(`/products/getProductsByType/${productId}`);
                setProductType(res.data);
            }
            catch (err) {
                console.error(err);
            }
        }
        getProducts();
  }, [productId]); 

  const getProductImg = (title) => {
    const productInfo = productData.find((data) => data.title === title);
    return productInfo ? productInfo.img : [];
  }

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    const getReviews = async () => {
      const existingReviews = await AsyncStorage.getItem('productReviewId');
      const reviewData = existingReviews ? JSON.parse(existingReviews) : [];

      const filteredReviews = reviewData.filter(review => review.productID === product?._id); 

      setReviews(filteredReviews);

    }
    getReviews();
  },[product._id, reviewSent]);

  useEffect(() => {
    const getComments = async () => {
      const existingComments = await AsyncStorage.getItem('productCommentId');
      const commentData = existingComments ? JSON.parse(existingComments) : [];

      const filteredComments = commentData.filter(comment => comment.productID === product?._id);

      setComments(filteredComments);
    }
    getComments();
  }, [product._id, commentSent]);

  const handleReview = async () => {
    if(username.length == 0 && reviewText.length == 0) {
      return alert('Vui lòng nhập đầy đủ thông tin');
    }

    const reviewData = {
      productID: product?._id,
      productTitle: product?.title,
      userID: user,
      username,
      reviewText,
      starRating,
      reviewDate: new Date().toISOString()
    }

    const existingReviews = await AsyncStorage.getItem('productReviewId');
    const reviews = existingReviews ? JSON.parse(existingReviews) : [];

    reviews.push(reviewData);

    await AsyncStorage.setItem('productReviewId', JSON.stringify(reviews));

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
        productID: product?._id,
        userID: user,
        ten,
        content,
        reviewDate: new Date().toISOString()
      }

      const existingComments = await AsyncStorage.getItem('productCommentId');
      const comments = existingComments ? JSON.parse(existingComments) : [];

      comments.push(reviewData);

      await AsyncStorage.setItem('productCommentId', JSON.stringify(comments));

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
      if (review.productID === product?._id) {
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

  const handleAddToCart = () => {

    const productToAdd = {
      id: product._id,
      title: product.title,
      price: selectedColorIndex !== null ? product.price[selectedColorIndex] : product.price[randomIndex],
      image: selectedColorIndex == null ? randomIndex : selectedColorIndex,
      color: product && product.color ? (selectedColorIndex == null ? product.img[randomIndex] : product.img[selectedColorIndex]) : null,
      size: product && product.size ? product.size : null 
    };

    if (user !== undefined || user !== null) {
      dispatch(addProduct({ userId: user, productToAdd }));
    } else {
      dispatch(addProduct({ productToAdd }));
    }

    Alert.alert('Thêm thành công vào giỏ hàng');

  }

  const calculateAverageRating = () => {
    let totalRating = 0;
  
    reviews.forEach((review) => {
      totalRating += review.starRating;
    });
  
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return averageRating.toFixed(1);
  };  
  
  
return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View>
        {loading ? (
            <LoadingScreen />
        ) : (
        <View>   
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 30, marginBottom: 30, borderBottomColor: '#EBEBEB', borderBottomWidth: 1, paddingBottom: 20, backgroundColor: '#fff' }}>
        {selectedColorIndex == null ? (
        <Image 
            source={getProductImg(product.title)[randomIndex]}
            resizeMode='cover'
            style={{ width: 220, height: 220 }}
        />
        ) : (
        <Image 
            source={getProductImg(product.title)[selectedColorIndex]}
            resizeMode='cover'
            style={{ width: 220, height: 220 }}
        />
        )}
        </View>
        <View style={{ padding: 10}}>
        <View>
        <Text style={{ fontSize: 17, fontWeight: 700 }}>{product.title}</Text>
        <View style={{ flexDirection: 'row', gap: 2, marginBottom: 8, marginTop: 8 }}>
          {[1, 2, 3, 4, 5].map((index) => (
            <MaterialIcons
              key={index}
              name={index <= calculateAverageRating() ? 'star' : 'star-border'}
              size={18}
              color="#ffb300"
            />
          ))}
          <Text style={{ color: '#244fcf', fontSize: 11.8, paddingTop: 1, paddingLeft: 5 }}>
            Đánh giá ({reviews.length} đánh giá)
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end', marginBottom: 8 }}>
        {selectedColorIndex == null ? (
            <Text style={{ fontSize: 16, fontWeight: 700, color: 'rgb(37, 87, 196)' }}>{formatPrice(product.price[randomIndex])}đ</Text>
        ) : (
            <Text style={{ fontSize: 16, fontWeight: 700, color: 'rgb(37, 87, 196)' }}>{formatPrice(product.price[selectedColorIndex])}đ</Text>
        )}
        <Text style={{ fontSize: 14, fontWeight: 700, color: 'gray', textDecorationLine: 'line-through', paddingBottom: 1.5 }}>{formatPrice(product.discount)}đ</Text>
        </View>
        <View>
            {product.size && product.type && (
              product.title.includes('Watch') ? (
                <Text style={{ fontSize: 11.5 }}>Loại dây</Text>
              ) : (
                <Text style={{ fontSize: 11.5 }}>Dung lượng </Text>
              )
            )}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 8}}>
        {product.size && product.type && productType.map((type) => (
        <TouchableOpacity
            key = {type.size}
            style={{
                borderColor: selectedCapacity === type.size ? '#242fcf' : '#EBEBEB',
                borderWidth: 0.8,
                padding: 5,
                borderRadius: 6,
                height: 31
            }}
            onPress={() => handleCapacityClick(type.size)}
        >
        <Text style={{ fontSize: 12 }}>{type.size}</Text>
        </TouchableOpacity>
        ))}
        </View>
        </View>
        <View>
            {product.color.length > 0 && (
                <Text style={{ fontSize: 11.5, marginBottom: 8 }}>Màu sắc</Text>
            )}
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-start'}}>
          {product.color?.map((color, index) => (
            <TouchableOpacity
              key = {index}
              style={[
                  styles.color,
                  { borderColor: shouldShowBorderColor(color) ? '#242fcf' : '',  borderWidth: shouldShowBorderColor(color) ? 1 : 0 }
                ]}
                onPress={() => handleColorClick(index, color)}
            >
            <View style={{ backgroundColor: color, height: 24, borderRadius: 50, width: 24, position: 'absolute', bottom: 1.6, left: 1.4 }} />
          </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View >
        <Image 
        source={ok}
        resizeMode='cover'
        style={{ objectFit: 'fill', height: 200, width: '100%', marginTop: 20 }}
        />
      </View>
      <TouchableOpacity onPress={handleAddToCart} style={{ height: 38, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent:  'center', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
        <Text style={{ color: 'white', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Mua ngay</Text>
      </TouchableOpacity>
      </View>
      </View>
    )}
      <View style={{ margin: 10 }}>
        <View style={{ padding: 10, borderColor: '#EBEBEB', borderWidth: 1, borderRadius: 6}}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8,}}>
            <Image 
            source={v}
            resizeMode='cover'
            style={{ height: 22, width: 22 }}
            />
            <Text style={{ fontSize: 11.5, paddingTop: 2}}>Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8}}>
            <Image 
            source={v}
            resizeMode='cover'
            style={{ height: 22, width: 22 }}
            />
            <Text style={{ fontSize: 12, paddingTop: 2}}>Bảo hành chính hãng 1 năm</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8}}>
            <Image 
            source={v}
            resizeMode='cover'
            style={{ height: 22, width: 22 }}
            />
            <Text style={{ fontSize: 12, paddingTop: 2}}>Giao hàng nhanh toàn quốc</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8}}>
            <Image 
            source={v}
            resizeMode='cover'
            style={{ height: 22, width: 22 }}
            />
            <Text style={{ fontSize: 12, paddingTop: 2}}>Hoàn thuế cho người nước ngoài </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8}}>
            <Image 
            source={v}
            resizeMode='cover'
            style={{ height: 22, width: 22 }}
            />
            <Text style={{ fontSize: 12, paddingTop: 2}}>Gọi đặt mua <Text>1900.6626</Text> (7:30 - 22:00)</Text>
        </View>
        </View>
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
                  <Text style={{ fontSize: 12.5, color: '#1D1D1F', fontWeight: 400  }}>{review.reviewText}</Text>
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
  );
};

export default ProductID;
