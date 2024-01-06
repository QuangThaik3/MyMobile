import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { publicRequest } from '../data/requestMethod';


const Password = () => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [email, setEmail] = useState('');

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

  const handleSubmit =  async () => {
    try{
      const res = await publicRequest.post("/auth/check-email", { email });
      const { exists } = res.data;

      if (exists) {

        const forgotPasswordRes = await publicRequest.post("/auth/forgot-password", { email });

        if(forgotPasswordRes.data?.success) {  
          alert('Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư đến của bạn.');
        }else {
          alert('Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại sau.');
        }
      } else {
        alert('Email không tồn tại. Vui lòng kiểm tra lại.');
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ padding: 10 }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 400, marginBottom: 20 }}>Khôi phục mật khẩu</Text>
        </View>
        <View>
          <Text style={{ fontSize: 11, fontWeight: 400, marginBottom: 20 }}>Vui lòng nhập email bạn đã đăng ký với ShopDunk</Text>
        </View>
        <View>
          <Text>Email: </Text>
          <TextInput
            style={getBorderStyle('search')}
            onFocus={() => handleFocus('search')}
            onBlur={handleBlur}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={setEmail}
            value={email}
          />
        </View>
        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity
          style={{width: '42%', height: 38, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
          onPress={handleSubmit}
          >
          <Text style={{ color: 'white', fontSize: 12 }}>Khôi phục</Text>
        </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Password
