import React from 'react'
import { View,TouchableOpacity, Text, Image, TouchableWithoutFeedback, Button } from 'react-native'
import { StyleSheet } from 'react-native'
import { useEffect } from 'react';
import { useState } from 'react';
import { publicRequest } from '../data/requestMethod';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { productData } from '../data/data';
import LoadingScreen from './LoadingScreen';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10
    },
    btnContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
        columnGap: 15,

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
        
    }
})

const findProductData = (title) => {
  return productData.find((data) => data.title === title);
}

const Product = ({ title, item, selectedSort, productSearch}) => {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]); 
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const navigation = useNavigation();

    useEffect(() => {
      setLoading(true);

      const getProduct = async () => {
        try {
          const res = await publicRequest.get(item ? `/products/category?top=${title}&cat=${item}` : `/products/category?top=${title}`);
          setProducts(res.data);
          setLoading(false);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      getProduct();
      setCurrentPage(1);
    }, [item, title]);
  
    useEffect(() => {
      if (!loading) {
        let sortedProducts;

        if (!productSearch) {
          productSearch = [];
        }

        if (productSearch.length === 0) {
          sortedProducts = [...products];
        } else {
          sortedProducts = [...productSearch];
        }
  
        if (selectedSort) { 
          switch (selectedSort?.value) {
            case '1':
              sortedProducts.sort((a, b) => b.price[0] - a.price[0]);
              break;
            case '2':
              sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            case '3':
              sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case '4':
              sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
              break;
            case '5':
              sortedProducts.sort((a, b) => a.price[0] - b.price[0]);
              break;
            default:
              break;                
          }
        }
  
        setSortedProducts(sortedProducts);
        setDisplayedProducts(sortedProducts.slice(startIndex, endIndex));
      }
    }, [selectedSort, loading, startIndex, endIndex]);

    const formatPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
  
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.btnContainer}>
            {loading ? (
              <LoadingScreen />
            ) : (
              displayedProducts.map((product, index) => {
                const randomIndex = 0;
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
                            style={{ width: 120, height: 120 }}
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
              })
            )}
          </View>
        </View>
        {!loading && products && products.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 6 }}>
            {currentPage !== 1 && (
              <TouchableOpacity
                style={{ width: 30, height: 30, backgroundColor: '#fff', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
              >
                <MaterialIcons name='keyboard-arrow-left' size={24} color="#EBEBEB" />
              </TouchableOpacity>
            )}
            {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
            <TouchableOpacity
              key={index + 1}
              style={{
                width: 30,
                height: 30,
                backgroundColor: currentPage === index + 1 ? '#0066CC' : '#fff', 
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setCurrentPage(index + 1)}
            >
              <Text style={{ color: currentPage === index + 1 ? '#fff' : '#000', fontSize: 12 }}>{index + 1}</Text>
            </TouchableOpacity>
            ))}
            {currentPage !== Math.ceil(products.length / productsPerPage) && (
              <TouchableOpacity
                style={{ width: 30, height: 30, backgroundColor: '#fff', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(products.length / productsPerPage)))}
              >
                <MaterialIcons name='keyboard-arrow-right' size={24} color="#EBEBEB" />
              </TouchableOpacity>
            )}
          </View>
        )}
        {!loading && productSearch && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 6, marginBottom: 30 }}>
            {currentPage !== 1 && (
              <TouchableOpacity
                style={{ width: 30, height: 30, backgroundColor: '#fff', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
              >
                <MaterialIcons name='keyboard-arrow-left' size={24} color="#EBEBEB" />
              </TouchableOpacity>
            )}
            {Array.from({ length: Math.ceil(productSearch.length / productsPerPage) }, (_, index) => (
            <TouchableOpacity
              key={index + 1}
              style={{
                width: 30,
                height: 30,
                backgroundColor: currentPage === index + 1 ? '#0066CC' : '#fff', 
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setCurrentPage(index + 1)}
            >
              <Text style={{ color: currentPage === index + 1 ? '#fff' : '#000', fontSize: 12 }}>{index + 1}</Text>
            </TouchableOpacity>
            ))}
            {currentPage !== Math.ceil(productSearch.length / productsPerPage) && (
              <TouchableOpacity
                style={{ width: 30, height: 30, backgroundColor: '#fff', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(productSearch.length / productsPerPage)))}
              >
                <MaterialIcons name='keyboard-arrow-right' size={24} color="#EBEBEB" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
};
  

export default Product
