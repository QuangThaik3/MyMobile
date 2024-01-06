import { useState, useEffect } from "react"
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native"
import { publicRequest } from "../data/requestMethod";
import { CustomDesign } from "./Register";
import Product from "./Product";

const Search = () => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productSearch, setProductSearch] = useState([]);
  const [selectedSort, setSelectedSort] = useState(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  

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
      marginBottom: 10,
      width: '100%',
      borderRadius: 6,
      textAlign: 'left',
      fontSize: 11.5,
      lineHeight: 24,
      marginBottom: 20,
      marginTop: 8,
      height: 36.5,
    };
  };

  const handleSearch = async () => {
      if(searchTerm.length < 3) {
        setError('Độ dài tối thiểu của cụm từ tìm kiếm là 3 ký tự');
        setShow(false);
        setHasSearched(false);
      }
      else {
      try {
        setProductSearch([]);
        const res = await publicRequest.post('/products/search', { searchTerm });
        setProductSearch(res.data);
        setShow(true);
        setError(null);
        setSelectedSort(null);
        setHasSearched(true);
      }
      catch (err) {
        console.log(err);
      }
      }
  };

  const handleChangeSearchTerm = (text) => {
    setSearchTerm(text);
    if (hasSearched) {
      setHasSearched(false);
    }
  };

  const Sort = [
    { label: 'Giá cao đến thấp', value: '1' },
    { label: 'Mới nhất', value: '2' },
    { label: 'Tên: A đến Z', value: '3' },
    { label: 'Tên: Z đến A', value: '4'},
    { label: 'Giá thấp đến cao', value: '5'},
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 400, marginBottom: 20 }}>Tìm kiếm</Text>
        </View>
        <View>
          <Text>Tìm từ khóa: </Text>
          <TextInput
            style={getBorderStyle('search')}
            onFocus={() => handleFocus('search')}
            onBlur={handleBlur}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={handleChangeSearchTerm}
            value={searchTerm}
          />
        </View>
        <TouchableOpacity
          style={{ height: 38, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
          onPress={handleSearch}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
    {error && (
    <View style={{ height:300, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#777', textAlign: 'center', fontSize: 13 }}>{error}</Text>
    </View>
    )}
    {show && (
    <View style={{ padding: 10}}>
      <View>
        {productSearch.length > 0 ? (
          <View>
          <View style={{ width: '70%'}}>
          <CustomDesign 
          data={Sort}
          placeholder={'Thứ tự hiển thị'}
          onItemSelected={(item) => setSelectedSort(item)}
          defaultText={selectedSort}
          />
          </View>
           <Product productSearch={productSearch} selectedSort={selectedSort} /> 
        </View>
        ) : (
          <View style={{ height:300, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#777', textAlign: 'center', fontSize: 13 }}>Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn!</Text>
          </View>
        ) 
      }
      </View>
    </View>
    )}
    </View>
    </ScrollView>
  );
};

export default Search
