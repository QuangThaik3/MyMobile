import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import { StyleSheet } from 'react-native'
import vn from '../assets/images/vn.png'
import us from '../assets/images/us.png'
import slide1 from '../assets/images/BA.png'
import slide2 from '../assets/images/QT2.png'
import slide3 from '../assets/images/TR.png'
import logo from '../assets/images/0012445_Logo_ShopDunk.png'
import bct from '../assets/images/Bocongthuong.png'
import { img } from '../data/data'
import { loaisanpham } from '../data/data'
import { MaterialIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import no_user from '../assets/images/no-user.jpg'
import { logout } from '../redux/userRedux'
import { publicRequest, userRequest } from '../data/requestMethod'
import LoadingScreen from './LoadingScreen'
import { productData } from '../data/data';

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#454545",
        height: "auto",
        flexDirection: 'row',
        padding: 10,
        gap: 5
    },
    Img: {
        objectFit: 'fill',
        width: 148,
        height: 40
    },
    search: {
        display:'flex',
        flexDirection:'row',
        gap: 10,
    },
    menu: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5
    },
    side: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 5,
        backgroundColor: '#f7f7f7',
        position:'absolute',
        top: 0,
        width: '100%'
    },
    main: {
        paddingLeft: 10,
        paddingRight: 10
        
    },
    arrow: {
        position: 'relative'
    },
    header: {
        borderBlockColor: '#4f4f4f',
        borderBottomWidth: 1,
        position: 'relative'
    },
    image: {
        width: '100%',
        height: 400,
        objectFit: 'cover'
    },
    arrowRight: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: [{ translateY: 170 }],
        zIndex: 1,
    },
    arrowLeft: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: [{ translateY: 170 }],
        zIndex: 1
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 5,
        left: '35%'
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        backgroundColor: 'gray', 
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#454545', 
    }, 
    user: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        borderRadius: 5,
        marginLeft: 8,
        marginRight: 8,
        paddingTop: 7
    },
    Btn: {
      borderColor: 'rgb(225, 224, 224)',
      borderWidth: 0.5,
      borderRadius: 5,
      paddingTop: 15,
      paddingBottom: 10,
      position: 'relative',
      backgroundColor: 'white',
      width: '47.6%',
      
  },
  productContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    columnGap: 15,
  }
})

const Home = ({ navigation }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [menuUser, setMenuUser] = useState(true);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user?.currentUser);  

    const title = ['iPhone', 'iPad', 'Mac', 'Watch', 'Âm thanh', 'Phụ kiện'];

    useEffect(() => {
      setLoading(true);

      const getProduct = async () => {
        try {
          const productData = [];

          for (const categoryTitle of title) {
            const res = await publicRequest.get(`/products/category?top=${categoryTitle}`);
            const categoryProducts = res.data.slice(0, 4); 
            productData.push(...categoryProducts);
          }

          setProducts(productData);
          setLoading(false);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      getProduct();
    }, []);

    const formatPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const findProductData = (title) => {
      return productData.find((data) => data.title === title);
    }
    
    const handlePress = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleRight = () => {
        setCurrentSlide((prevSlide) => (prevSlide === img.length - 1 ? 0 : prevSlide + 1));
    };
    
    const handleLeft = () => {
        setCurrentSlide((prevSlide) => (prevSlide === 0 ? img.length - 1 : prevSlide - 1));
    };

    const handleTopicPress = (title) => {
        navigation.navigate('ProductList', { title })
    }
    const handleMenuPress = async () => {
        setMenuUser(!menuUser);
    }    

    return (
    
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
            <View>
            <View style={styles.container}>
            {isMenuOpen ? (
              <TouchableOpacity onPress={handlePress}>
              {user !== null ? (
                !user.img ? (
                  <Image
                    source={no_user}
                    resizeMode='cover'
                    style={{ width: 30, height: 30, borderRadius: 30 }}
                  />
                ) : (
                  <Image
                    source={{ uri: 'data:image/jpeg;base64,' + user.img }}
                    resizeMode='cover'
                    style={{ width: 30, height: 30 }}
                    onError={(error) => console.log("Error loading image: ", error.nativeEvent.error)}
                  />
                )
              ) : (
                <MaterialIcons name='menu' size={25} color='white' />
              )}
              </TouchableOpacity>
              ) : (
              <TouchableOpacity onPress={handlePress}>
              {user !== null ? (
                !user.img ? (
                  <Image
                    source={no_user}
                    resizeMode='cover'
                    style={{ width: 30, height: 30, borderRadius: 30 }}
                  />
                ) : (
                  <Image
                    source={{ uri: 'data:image/jpeg;base64,' + user.img }}
                    resizeMode='cover'
                    style={{ width: 30, height: 30 }}
                  />
                )
              ) : (
                <MaterialIcons name='close' size={25} color='white' />
              )}
              </TouchableOpacity>
            )}
            <Image 
              source={vn}
              resizeMode='cover'
            />
            <Image
              source={require('../assets/images/us.png')}
              resizeMode='cover'
            />
            <TouchableOpacity>
                  <Image 
                  source={logo}
                  style= {styles.Img}
                  />
              </TouchableOpacity>
              <TouchableOpacity style={styles.search}>     
                  <TouchableOpacity onPress={() => (navigation.navigate('Search'))} >
                      <MaterialIcons name='search' size={25} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => (navigation.navigate('Cart'))}>
                  <MaterialIcons name='shop' size={25} color="white" />
                  </TouchableOpacity>
              </TouchableOpacity>
            </View>

            <View style={styles.arrow}>
            <View style={styles.menu}>
            {loaisanpham.map((item) => (
              <TouchableOpacity key={item.title} onPress={() => handleTopicPress(item.title)}>
                  <Text style={{ fontSize: 12 }}>{item.title}</Text>
              </TouchableOpacity>
            ))}
            </View>

            {!isMenuOpen && (
            <View style={styles.side}>
            {user ? (
                <>
                    <TouchableOpacity style={styles.main} onPress={() => dispatch(logout())}>
                    <Text style={{ fontSize: 12, paddingBottom: 13, paddingTop: 13 }}>Đăng xuất</Text>
                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.main} onPress={handleMenuPress}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>        
                    <Text style={{ fontSize: 12, paddingBottom: 13 }}>Tài khoản của tôi</Text>
                    <MaterialIcons name='keyboard-arrow-down' size={24} color="#d3d0d0" />
                    </View>
                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }} />
                    </TouchableOpacity>
                    {!menuUser && (
                    <View>
                        <TouchableOpacity style={styles.user} onPress={() => navigation.navigate('User', { id: user._id })}>
                            <Text style={{ fontSize: 12, paddingBottom: 8, color: '#0066CC' }}>Thông tin tài khoản</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.main} onPress={() => navigation.navigate('Order', { id: user._id })}>
                            <Text style={{ fontSize: 12, paddingBottom: 13, paddingTop: 7, paddingLeft: 10 }}>Đơn đặt hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.main} onPress={() => navigation.navigate('ResetPass', { id: user._id })}>
                            <Text style={{ fontSize: 12, paddingBottom: 13, paddingTop: 7, paddingLeft: 10 }}>Đổi mật khẩu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.main} onPress={() => navigation.navigate('ImageUpload', user._id )}>
                            <Text style={{ fontSize: 12, paddingBottom: 13, paddingTop: 7, paddingLeft: 10 }}>Ảnh đại diện</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.main} onPress={() => navigation.navigate('History', user._id )}>
                            <Text style={{ fontSize: 12, paddingBottom: 13, paddingTop: 7, paddingLeft: 10 }}>Lịch sử đánh giá sản phẩm</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                </>
            ) : (
                <>
                    <TouchableOpacity style={styles.main} onPress={() => navigation.navigate('Register')}>
                    <Text style={{ fontSize: 12, paddingBottom: 13, paddingTop: 13 }}>Tạo tài khoản ngay</Text>
                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.main} onPress={() => navigation.navigate('Login')}>
                    <Text style={{ fontSize: 12, paddingBottom: 13 }}>Đăng nhập</Text>
                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }} />
                    </TouchableOpacity>
                </>
            )}
            </View>
            )}
          </View>
          </View>
         
          <View style={{ position: 'relative', width: '100%' }}>
          <View>
          <TouchableOpacity style={styles.arrowRight} onPress={handleRight}>
          <MaterialIcons name='keyboard-arrow-right' size={25} color="#EBEBEB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowLeft} onPress={handleLeft}>
          <MaterialIcons name='keyboard-arrow-left' size={25} color="#EBEBEB" />
          </TouchableOpacity>
          </View>
          <View style={styles.header}>
              <Image 
              style={styles.image}
              source={img[currentSlide].slide}
              resizeMode='cover'
              />
          </View>

          <View style={styles.pagination}>
          {img.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.dot, index === currentSlide ? styles.activeDot : null]}
              onPress={() => setCurrentSlide(index)}
            />
          ))}
          </View>
          </View>

          <View style={{ flexDirection: 'column', marginTop: 40, marginBottom: 40, alignItems: 'center'  }}>
          <Image 
          source={slide1}
          resizeMode='cover'
          style={{ width: '90%', height: 150, marginBottom: 15 }}
          />
          <Image 
          source={slide2}
          resizeMode='cover'
          style={{ width: '90%', height: 150, marginBottom: 15 }}
          />
          <Image 
          source={slide3}
          resizeMode='cover'
          style={{ width: '90%', height: 150 }}
          />
          </View>

          <View>
            {loading ? (
              <LoadingScreen />
            ) : (
            <View>
            <View>
              {title.map(categoryTitle => (
                <View key={categoryTitle} style={{ padding: 15 }}>
                  <Text style={{ textAlign: 'center', color: '#1D1D1F', fontWeight: 700, fontSize: 17.5, marginBottom: 15  }}>{categoryTitle}</Text>
                  <View style={styles.productContainer}>
                    {products?.filter(product => product.topic === categoryTitle).map((product, index) => {
                      const randomIndex = Math.floor(Math.random() * product.price.length);
                      const productData = findProductData(product.title);
      
                      return (
                        <View key={index} style={styles.Btn}>
                          {productData.new && (
                            <Image
                              source={productData.new}
                              resizeMode='cover'
                              style={{ width: 35, height: 16, objectFit: 'fill', position: 'absolute', top: 5, right: 5 }}
                            />
                          )}
                          <TouchableOpacity style={{ padding: 5, paddingTop: 15 }} onPress={() => navigation.navigate('ProductID', { productId: product._id, randomIndex })}>
                          <TouchableWithoutFeedback onPress={() => navigation.navigate('ProductID', { productId: product._id, randomIndex })}>
                              <View>
                              <TouchableOpacity onPress={() => navigation.navigate('ProductID', { productId: product._id, randomIndex })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
                                  <Image
                                  source={productData.img[randomIndex]} 
                                  resizeMode='cover'
                                  style={{ width: 120, height: 120, objectFit: 'fill' }}
                                  />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => navigation.navigate('ProductID', { productId: product._id, randomIndex })} style={{ height: 40, overflow: 'hidden', paddingLeft: 8 }}>
                                  <Text style={{ fontSize: 11.5, fontWeight: 700, marginTop: 10 }} numberOfLines={2} ellipsizeMode='tail'>{product.title}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => navigation.navigate('ProductID', { productId: product._id, randomIndex })} style={{ marginTop: 5, paddingLeft: 8 }}>
                                  <Text style={{ fontSize: 11.3, fontWeight: 700, color: 'rgb(37, 87, 196)', marginTop: 5 }}>{formatPrice(product.price[randomIndex])}đ</Text>
                                  <Text style={{ fontSize: 11.3, fontWeight: 400, color: 'gray', marginTop: 6 }}><Text style={{ fontSize: 10.5, fontWeight: 400, color: 'gray', textDecorationLine: 'line-through', marginTop: 6 }}>{formatPrice(product.discount)}đ</Text>  {`${Math.round(((product.discount - product.price[randomIndex]) / product.discount) * 100)}%`}</Text>
                              </TouchableOpacity>
                              </View>
                          </TouchableWithoutFeedback>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('ProductList', { title: categoryTitle })} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 1.7, padding: 10, marginTop: 15 }}>
                    <Text style={{ color: '#0066CC', fontSize: 13.5 }}>Xem tất cả {categoryTitle}</Text>
                    <MaterialIcons name='keyboard-arrow-right' size={22} color="#0066CC" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            </View>
            )}
          </View>

          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.89)', padding: 15 }}>
          <TouchableOpacity>
          <Image
          source={logo}
          resizeMode='cover'
          style={{ objectFit: 'fill', width: 148, height: 40, marginBottom: 20 }}
          />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 12.8, marginBottom: 30 }}>Năm 2020, ShopDunk trở thành đại lý ủy quyền của Apple. Chúng tôi phát triển chuỗi cửa hàng tiêu chuẩn và Apple Mono Store nhằm mang đến trải nghiệm tốt nhất về sản phẩm và dịch vụ của Apple cho người dùng Việt Nam.</Text>
          <View>
          <Text style={{ color: 'gray', fontSize: 11 }}>© 2016 Công ty Cổ Phần HESMAN Việt Nam GPDKKD: 0107465657 do Sở KH & ĐT TP. Hà Nội cấp ngày 08/06/2016.</Text>
          <Text style={{ color: 'gray', fontSize: 11 }} >Địa chỉ: Số 76 Thái Hà, phường Trung Liệt, quận Đống Đa, thành phố Hà Nội, Việt Nam</Text>
          <Text style={{ color: 'gray', fontSize: 11 }}>Đại diện pháp luật: PHẠM MẠNH HÒA | ĐT: 0247.305.9999 | Email: lienhe@shopdunk.com</Text>
          </View>
          <Image source={bct} resizeMode='cover' style={{ width: 113, height: 35, objectFit: 'fill', marginTop: 15}}/>
          </View>
          
        </View>
      </ScrollView>
    )
}

export default Home
