import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { publicRequest } from '../data/requestMethod';

export const CustomDesign = ({ data, placeholder, onItemSelected, defaultText }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    const handlePress = () => {
      setIsVisible(!isVisible);
    };
  
    const handleItemPress = (item) => {
      onItemSelected(item);
      setIsVisible(false);
    };
  
    const styles = StyleSheet.create({
      container: {
        borderColor: '#EBEBEB',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        paddingLeft: 95,
        marginBottom: 10,
        width: '200',
        height: 36.5,
        marginTop: 8, 
        position: 'relative'
      },
      placeholder: {
        color: '#9E9E9E',
        fontSize: 11.5,
        position: 'absolute',
        top: 9,
        left: 9
      },
      icon: {
        position: 'absolute',
        top: 6,
        right: 0,
      },
      item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
      },
      dropdown: {
        flex: 1,
        overflowY: 'auto',
      }
    });
  
    return (
      <View>
        <TouchableOpacity onPress={handlePress} style={styles.container}>
          {defaultText ? (
            <Text style={{ fontSize: 11.5, position: 'absolute', top: 9, left: 9}}>
              {defaultText.label}
            </Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
          <MaterialIcons
            name={isVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color="#d3d0d0"
            style={styles.icon}
          />
        </TouchableOpacity>
        {isVisible && (
          <ScrollView style={styles.dropdown}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={`${item.id}_${index}`}
                onPress={() => handleItemPress(item)}
                style={styles.item}
              >
                <Text style={{ fontSize: 11.5 }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

const Register = ({ navigation }) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [selectedGT, setSelectedGT] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [pass, setPass] = useState('');
  const [password, setPassword] = useState('');
  const [ten, setTen] = useState('');
  const [user, setUser] = useState('');

  const [emailError, setEmailError] = useState('');
  const [telError, setTelError] = useState('');
  const [passError, setPassError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [tenError, setTenError] = useState('');
  const [userError, setUserError] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` }));
  const years = Array.from({ length: 37 }, (_, i) => ({ value: `${2023 - i}`, label: `${2023 - i}` }));

  const months = [
    { label: 'Tháng Giêng', value: '1' },
    { label: 'Tháng Hai', value: '2' },
    { label: 'Tháng Ba', value: '3' },
    { label: 'Tháng Tư', value: '4' },
    { label: 'Tháng Năm', value: '5' },
    { label: 'Tháng Sáu', value: '6' },
    { label: 'Tháng Bảy', value: '7' },
    { label: 'Tháng Tám', value: '8' },
    { label: 'Tháng Chín', value: '9' },
    { label: 'Tháng Mười', value: '10' },
    { label: 'Tháng Mười Một', value: '11' },
    { label: 'Tháng Mười Hai', value: '12' }
  ];

  const gioitinh = [
    { label: 'Nam', value: 'Nam' },
    { label: 'Nữ', value: 'Nu' },
    { label: 'Khác', value: 'Khac' },
  ]

  const checkAllErrors = () => {
    checkEmail();
    checkTel();
    checkPass();
    checkPassword();
    checkTen();
    checkUser();
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


  const checkEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? '' : 'Email không hợp lệ');
  };

  const checkTel = () => {
    const regex = /^0\d{9}$/;
    const isValid = regex.test(tel);
    setTelError(isValid ? '' : 'Số điện thoại không hợp lệ');
  };

  const checkPass = () => {
    const regex = /^(?=.*[#?!@$%^&*-]).{8,}$/;
    const isValid = regex.test(pass);
    setPassError(isValid ? '' : 'Phải có ít nhất 8 ký tự trong đó có đặc biệt (ví dụ: #?!@$%^&*-)');
  };

  const checkPassword = () => {
    const isValid = password === pass;
    setPasswordError(isValid ? '' : 'Mật khẩu và mật khẩu xác nhận không khớp');
  };

  const checkTen = () => {
    const isValid = ten.length > 0;
    setTenError(isValid ? '' : 'Vui lòng nhập tên');
  };

  const checkUser = () => {
    const isValid = user.length >= 5;
    setUserError(isValid ? '' : 'Username phải có ít nhất 5 ký tự');
  };

  useEffect(() => {
    checkEmail();
  },[email])

  useEffect(() => {
    checkPassword();
  },[password])

  useEffect(() => {
    checkPass();
  },[pass])
  
  useEffect(() => {
    checkTel();
  },[tel])

  useEffect(() => {
    checkUser();
  },[user])

  useEffect(() => {
    checkTen();
  },[ten])



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      setEmail('');
      setTel('');
      setPass('');
      setPassword('');
      setTen('');
      setUser('');
      setEmailError('');
      setTelError('');
      setPassError('');
      setPasswordError('');
      setTenError('');
      setUserError('');
    });
  
    return unsubscribe;
  }, [navigation]);

  const handleSubmit = async () => {
    if(email.length > 0 && tel.length > 0 && user.length > 0 && pass.length > 0 && ten.length > 0 && password.length > 0 && emailError.length == 0 && telError.length == 0 && tenError.length == 0 && passError.length == 0 && passwordError.length == 0 && userError.length == 0) {
      try {
        await publicRequest.post("/auth/register", {
          ten,
          email,
          dienThoai: tel,
          username: user,
          password
        });
        navigation.navigate('Login');

      }
      catch (err) {
        if(err.response?.data?.error) {
          const errorMessage = err.response.data.error;
          switch (errorMessage) {
            case 'Username đã tồn tại':
          setUserError('Username đã tồn tại');
          break;
        case 'Email đã tồn tại':
          setEmailError('Email đã tồn tại');
          break;
        case 'Số điện thoại đã tồn tại':
          setTelError('Số điện thoại đã tồn tại');
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
      <Text style={{ fontSize: 20, fontWeight: 400, marginBottom:20, marginTop: 20 }}>Đăng ký</Text>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Tên, Họ: </Text>
        <TextInput
          style={getBorderStyle('tenHo')}
          onFocus={() => handleFocus('tenHo')}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          onChangeText={setTen}
          value={ten}
        />
        {tenError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{tenError}</Text>
        )}
      </View>
      <View>
        <Text style={styles.text}>Giới tính: </Text>
        <CustomDesign 
            data={gioitinh}
            placeholder="Chọn"
            onItemSelected={(item) => setSelectedGT(item)}
            defaultText={selectedGT}
            />
      </View>
      <View>
        <Text style={styles.text}>Ngày sinh: </Text>
        <View style={{ flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'space-between'}}>
            <CustomDesign 
            data={days}
            placeholder="Ngày"
            onItemSelected={(item) => setSelectedDay(item)}
            defaultText={selectedDay}
            style={{ width: '30%' }}
            />
            <CustomDesign 
            data={months}
            placeholder="Tháng"
            onItemSelected={(item) => setSelectedMonth(item)}
            defaultText={selectedMonth}
            style={{ width: '30%' }}
            />
            <CustomDesign 
            data={years}
            placeholder="Năm"
            onItemSelected={(item) => setSelectedYear(item)}
            defaultText={selectedYear}
            style={{ width: '30%' }}
            />
        </View>
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>E-mail: </Text>
        <TextInput 
        style={getBorderStyle('email')}
        onFocus={() => handleFocus('email')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        onChangeText={setEmail}
        value={email}
        />
        {emailError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{emailError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Điện Thoại: </Text>
        <TextInput 
        style={getBorderStyle('dienthoai')}
        onFocus={() => handleFocus('dienthoai')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        onChangeText={setTel}
        value={tel}
        />
        {telError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{telError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Username: </Text>
        <TextInput 
        style={getBorderStyle('username')}
        onFocus={() => handleFocus('username')}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        onChangeText={setUser}
        value={user}
        />
        {userError.length > 0 && (
            <Text style={{ color: 'red', fontSize: 11.5 }}>{userError}</Text>
        )}
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.text}>Mật khẩu: </Text>
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
        <Text style={styles.text}>Xác nhận mật khẩu: </Text>
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
        <Text style={{ color: 'white', fontSize: 12 }}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
    <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
        <Text style={{ fontSize: 12 }}>Bạn Đã Có Tài Khoản?</Text>
        <TouchableOpacity onPress={() => (navigation.navigate('Login'))} >
            <Text style={{ fontSize: 12.3, color: '#244fcf'}}>Đăng Nhập Ngay</Text>
        </TouchableOpacity>
    </View>
  </View>  
  </ScrollView>
  );
};

export default Register;
