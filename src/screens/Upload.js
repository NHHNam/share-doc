import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Alert,
    Modal,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import Btn from '../components/Btn';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Input from '../components/Input';
import SelectDropdown from 'react-native-select-dropdown';
import api from '../axios/aixos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setListFilesOfUSer } from '../store/file.slice';
import axios from 'axios';
import baseURL from '../config/config';
import { getAllCategory } from '../services/category.service';
import { createDocument } from '../services/document.service';
function Upload({ navigation }) {
    const [nameFile, setNameFile] = useState('');
    const [file, setFile] = useState('');
    const [nameDoc, setNameDoc] = useState('');
    const [descDoc, setDescDoc] = useState('');
    const [typecDoc, setTypeDoc] = useState(0);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [curUser, setCurUser] = useState({});
    const [isPrivate, setPrivate] = useState(false);
    const dispatch = useDispatch();

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    const uploadFile = async () => {
        try {
            const f = await DocumentPicker.pickSingle({
                // Instruct the document picker to copy file to Documents directory
                copyTo:
                    Platform.OS === 'ios'
                        ? 'documentDirectory'
                        : 'cachesDirectory'
                // allowMultiSelection: false,
                // mode: 'open'
            });

            if (hasWhiteSpace(f.name)) {
                Alert.alert(
                    'Ancouncement',
                    'Please change your filename have no whitespace'
                );
                throw new Error(
                    'Please change your filename have no whitespace'
                );
            }
            const { dirs } = RNFetchBlob.fs;

            const dirToSave =
                Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;

            setNameFile(f.name.replace(/\s/g, '_').replace('-', ''));
            const fileContent = await RNFS.readFile(
                f.fileCopyUri || `${dirToSave}/${f.name}`,
                'base64'
            );
            // const fileContent = await RNFS.readFile(f.fileCopyUri, 'base64');
            setFile(fileContent);
        } catch (error) {
            console.log(error);
        }
    };

    const goBack = async () => {
        navigation.goBack();
    };

    const optionPrivate = [
        {
            name: 'False',
            value: false
        },
        {
            name: 'True',
            value: true
        }
    ];

    const getCategory = async () => {
        try {
            const data = await getAllCategory();
            setCategory(data);
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const getCurUser = async () => {
        try {
            const result = await AsyncStorage.getItem('@account');
            setCurUser(JSON.parse(result));
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    useEffect(() => {
        getCategory();
        getCurUser();
    }, []);

    const renderDropdownRow = (item) => {
        return item.name; // Return the 'name' property to represent the item in the dropdown
    };

    const renderButtonText = (selectedItem) => {
        return selectedItem.name; // Return the 'name' property to render after an item is selected
    };

    const handleDropdownSelect = (selectedItem, index) => {
        // console.log(selectedItem.id);
        setTypeDoc(selectedItem.id);
    };

    const renderDropdownRowPrivate = (item) => {
        return item.name; // Return the 'name' property to represent the item in the dropdown
    };

    const renderButtonTextPrivate = (selectedItem) => {
        return selectedItem.name; // Return the 'name' property to render after an item is selected
    };

    const handleDropdownSelectPrivate = (selectedItem, index) => {
        // console.log(selectedItem.id);
        setPrivate(selectedItem.value);
    };

    const upload = async () => {
        try {
            if (
                (nameDoc === '' || descDoc === '' || file === '',
                nameFile === '')
            ) {
                Alert.alert('Thông báo', 'Làm ơn điền đầy đủ thông tin file');
            } else {
                await createDocument({
                    name: nameDoc,
                    description: descDoc,
                    userId: curUser.id,
                    base64String: file,
                    nameFile: nameFile,
                    categoryId: typecDoc,
                    isPrivate: isPrivate
                });
                setLoading(false);
                setTimeout(() => {
                    setNameDoc(''), setDescDoc(''), setTypeDoc(0);
                    setFile('');
                    setNameFile('');
                    Alert.alert('Thông báo', 'Upload tài liệu thành công');
                }, 100);
            }
        } catch (err) {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Thông báo', err.message);
            }, 500);
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                supportedOrientations={['portrait']}
                animationType="slide"
                transparent={true}
                visible={loading}
                onRequestClose={() => {
                    setLoading(!loading);
                }}
            >
                <SafeAreaView style={[styles.centeredView, { opacity: 0.5 }]}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </SafeAreaView>
            </Modal>
            <View style={styles.viewPage}>
                <Input
                    placeholder={'Nhập vào tên của tài liệu'}
                    text={nameDoc}
                    fn={(text) => setNameDoc(text)}
                    style={{ width: '100%', margin: 0, marginBottom: 10 }}
                />

                <Input
                    placeholder={'Nhập vào mô tả của tài liệu'}
                    text={descDoc}
                    fn={(text) => setDescDoc(text)}
                    style={{ width: '100%', margin: 0, marginBottom: 10 }}
                />

                <Text>
                    Lưu ý: Người dùng phải chọn file và đổi tên không được có
                    khoảng trắng trong tên file
                </Text>

                {nameFile && (
                    <Text>
                        File đã chọn <Icon name="file" /> : {nameFile}
                    </Text>
                )}

                <Btn
                    content={
                        <Icon name="cloud-upload" size={18} color="#fff" />
                    }
                    onPress={uploadFile}
                    style={{ width: '100%' }}
                />

                <SelectDropdown
                    data={category}
                    onSelect={handleDropdownSelect}
                    buttonTextAfterSelection={renderButtonText}
                    rowTextForSelection={renderDropdownRow}
                    defaultButtonText={'Chọn thể loại của tài liệu'}
                    dropdownIconPosition={'right'}
                    buttonStyle={styles.dropdown}
                    buttonTextStyle={{ fontSize: 13 }}
                />

                <SelectDropdown
                    data={optionPrivate}
                    onSelect={handleDropdownSelectPrivate}
                    buttonTextAfterSelection={renderButtonTextPrivate}
                    rowTextForSelection={renderDropdownRowPrivate}
                    defaultButtonText={'Trạng thái cá nhân'}
                    dropdownIconPosition={'right'}
                    buttonStyle={styles.dropdown}
                    buttonTextStyle={{ fontSize: 13 }}
                />

                <Btn
                    content={[<Icon name="plus" />, ' Add']}
                    style={{ width: '100%' }}
                    onPress={() => {
                        setLoading(true);
                        upload();
                    }}
                />
            </View>
        </View>
    );
}

export default Upload;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden'
    },
    header: {
        backgroundColor: '#fff',
        // elevation: 2, // Add elevation for shadow on Android devices
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 5,
        width: '100%',
        padding: 10,
        height: 100,
        flex: 1
    },
    viewPage: {
        flex: 10,
        width: '90%'
    },
    dropdown: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
        marginBottom: 10,
        marginTop: 10,
        padding: 10
    },
    centeredView: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    }
});
