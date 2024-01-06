import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { userRequest } from '../data/requestMethod';


const ResetPass = ({ route }) => {
  const [focusedInput, setFocusedInput] = useState(null);
  
  const [passOld, setPassOld] = useState('');
  const [pass, setPass] = useState('');
  const [password, setPassword] = useState('');
 
  const [passOldError, setPassOldError] = useState('');
  const [passError, setPassError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const id = route.params.id;

  const checkAllErrors = () => {
    checkPass();
    checkPassword();
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
    checkAllErrors();
  };

  const getBorderStyle = (inputName) => {
    return {
      borderColor: focusedInput === inputName ? '#244fcf' : '#EBEBEB',
      borderWidth: 1,
      padding: 10,
      width: '100%',
      borderRadius: 6,
      textAlign: 'left',
      fontSize: 11.5,
      lineHeight: 24,
      marginTop: 8,
      height: 36.5,
      marginBottom: 3
    };
  }; 

  const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        color: "#353536",
    }
  });



  const checkPass = () => {
    const regex = /^(?=.*[#?!@$%^&*-]).{8,}$/;
    const isValid = regex.test(pass);
    setPassError(isValid ? '' : 'Phải có ít nhất 8 ký tự trong đó có đặc biệt (ví dụ: #?!@$%^&*-)');
  };

  const checkPassword = () => {
    const isValid = password === pass;
    setPasswordError(isValid ? '' : 'Mật khẩu và mật khẩu xác nhận không khớp');
  };


  const handleSubmit = async () => {
    if(pass.length > 0 && password.length > 0 && passOld.length > 0  && passError.length == 0 && passwordError.length == 0) {
      try {
        await userRequest.put(`/auth/${id}`, {
            oldPassword: passOld,
            newPassword: password
        })
        Alert.alert('Cập nhập mật khẩu thành công');
        setPass('');
        setPassword('');
        setPassOld('');
        setPassOldError(''); 
      }
      catch (err) {
        if(err.response?.data?.error) {
          const errorMessage = err.response.data.error;
          switch (errorMessage) {
            case 'Wrong password':
          setPassOldError('Mật khẩu cũ không khớp');
          break;
        default:
          console.error('Unhandled error:', errorMessage);
          }
        } else {
          console.log(err);
        }
      }
    }
  }

  return (
  <ScrollView showsVerticalScrollIndicator={false}>  
  <View style={{ padding: 13, marginBottom: 30 }}>  
    <View>
      <Text style={{ fontSize: 20, fontWeight: 400, marginBottom:20, marginTop: 20 }}>Đổi mật khẩu</Text>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Mật khẩu cũ: </Text>
        <TextInput 
        style={getBorderStyle('matkhaucu')}
        onFocus={() => handleFocus('matkhaucu')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        secureTextEntry={true}
        onChangeText={setPassOld}
        value={passOld}
        />
        {passOldError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{passOldError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Mật khẩu mới: </Text>
        <TextInput 
        style={getBorderStyle('matkhau')}
        onFocus={() => handleFocus('matkhau')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        secureTextEntry={true}
        onChangeText={setPass}
        value={pass}
        />
        {passError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{passError}</Text>
        )}
      </View>
      <View style={{ backgroundColor: '#EBEBEB', borderRadius: 10, padding: 5, marginBottom: 15 }}>
        <Text style={{ fontSize: 9 }}>Lưu ý: Mật khẩu phải có tối thiểu 8 ký tự bao gồm chữ, số và các ký tự đặc biệt</Text>
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Xác nhận mật khẩu mới: </Text>
        <TextInput 
        style={getBorderStyle('xacnhan')}
        onFocus={() => handleFocus('xacnhan')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        />
        {passwordError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{passwordError}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => (handleSubmit())} style={{ height: 38, borderRadius: 6, backgroundColor: '#244fcf', flexDirection: 'row', justifyContent:  'center', alignItems: 'center'}}>
        <Text style={{ color: 'white', fontSize: 12 }}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  </View>  
  </ScrollView>
  );
};

export default ResetPass;
