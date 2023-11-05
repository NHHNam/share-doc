import React, { useState, useEffect } from 'react';
import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Platform
} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { FlatList } from 'react-native-gesture-handler';
import Btn from '../components/Btn';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../axios/aixos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setListFilesOfUSer } from '../store/file.slice';
import { setComments, setFile, setListFile } from '../store/file.slice';
import Input from '../components/Input';
import baseURL from '../config/config';
import SelectDropdown from 'react-native-select-dropdown';
import {
    deleteDocument,
    getDocumentsByUserId,
    handleDeleteDocument,
    handleUpdateDocument
} from '../services/document.service';
import { getAllCategory } from '../services/category.service';
import { convert_name } from '../utils/convert_name';

function Files({ navigation }) {
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [nameDoc, setNameDoc] = useState('');
    const [nameFile, setNameFile] = useState('');
    const [fileChoose, setFileChoose] = useState('');
    const [descFile, setDescFile] = useState('');
    const [categoryFile, setCategoryFile] = useState(0);
    const [idDoc, setIdDoc] = useState(0);
    const [curUser, setCurUser] = useState({});
    const [typecDoc, setTypeDoc] = useState(0);
    const [isPrivate, setPrivate] = useState(false);
    const [category, setCategory] = useState([]);
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

    const getData = async () => {
        try {
            const userFind = await AsyncStorage.getItem('@account');
            const user = JSON.parse(userFind);
            const data = await getDocumentsByUserId(user.id);
            dispatch(setListFilesOfUSer(data));
            setData(data);
            const dataCate = await getAllCategory();
            setCategory(dataCate);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const getCurUser = async () => {
        try {
            const result = await AsyncStorage.getItem('@account');
            setCurUser(JSON.parse(result));
        } catch (err) {
            Alert.alert('Thông báo', err.message);
        }
    };
    useEffect(() => {
        getData();
        getCurUser();
    }, []);

    const uploadFile = () => {
        navigation.navigate('Upload');
    };

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    const uploadFileToUpdate = async () => {
        try {
            const f = await DocumentPicker.pickSingle({
                // Instruct the document picker to copy file to Documents directory
                copyTo:
                    Platform.OS === 'ios'
                        ? 'documentDirectory'
                        : 'cachesDirectory',
                allowMultiSelection: false,
                mode: 'open'
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
            setFileChoose(fileContent);
        } catch (error) {
            console.log(error);
        }
    };

    const updateDocument = async () => {
        try {
            if (
                nameDoc === '' ||
                descFile === '' ||
                categoryFile === 0 ||
                idDoc === 0
            ) {
                throw new Error('Thiếu thông tin update');
            }

            // await api.put(`/api/product/mobile/${idDoc}`, {
            //     name: nameDoc,
            //     description: descFile,
            //     userId: curUser.id,
            //     base64String: fileChoose,
            //     nameFile: nameFile,
            //     categoryId: typecDoc,
            //     isPrivate: isPrivate
            // });

            await handleUpdateDocument(idDoc, {
                name: nameDoc,
                description: descFile,
                userId: curUser.id,
                base64String: fileChoose,
                nameFile: nameFile,
                categoryId: typecDoc,
                isPrivate: isPrivate
            });
            setTimeout(() => {
                setLoading(false);
            }, 100);
            setTimeout(() => {
                Alert.alert('Thông báo', 'Cập nhật tài liệu thành công!');
            }, 100);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Thông báo', error.message);
            }, 500);
        }
    };

    const viewFile = async (idFile) => {
        try {
            const data = await api.get(`/api/product/${idFile}`);
            const dataResult = data.data;
            const blackList = await api.get(`/api/blacklist/${idFile}`);

            if (blackList.data?.metadata) {
                acceptDownload = false;
            } else {
                acceptDownload = true;
            }

            dispatch(
                setFile({
                    name: dataResult.name,
                    description: dataResult.description,
                    source: `${baseURL}/files/${encodeURI(dataResult.path)}`,
                    pathDownload: `${baseURL}/files/${encodeURI(
                        dataResult.pathDownload
                    )}`,
                    acceptDownload: acceptDownload,
                    comments: dataResult?.comments || [],
                    id: dataResult?.id
                })
            );
            dispatch(setComments(dataResult?.comments || []));
            navigation.navigate('FileView');
        } catch (error) {
            Alert.alert('Thông báo', error.message);
        }
    };

    const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
    const [docChoose, setDocChoose] = useState({});

    const deleteDoc = async (id) => {
        try {
            await handleDeleteDocument(id);

            Alert.alert('Thông báo', 'Xoá tài liệu thành công');
        } catch (error) {
            console.log(error.message);
            Alert.alert('Thông báo', 'Internal server');
        }
    };

    const Item = ({ item }) => {
        return (
            <View>
                <View style={style.item}>
                    <View>
                        <Text
                            style={{
                                flexShrink: 1,
                                fontSize: 18,
                                fontWeight: '700',
                                color: 'red'
                            }}
                            ellipsizeMode="tail"
                        >
                            {convert_name(item.name)}
                        </Text>
                        <Text
                            style={{
                                flexShrink: 1,
                                fontSize: 15,
                                marginTop: 10,
                                flexWrap: 'nowrap'
                            }}
                            ellipsizeMode="tail"
                        >
                            {convert_name(item.description)}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10
                        }}
                    >
                        <Btn
                            content={<Icon name="eye" />}
                            style={[
                                style.btn_add,
                                { height: 30, marginEnd: 10 }
                            ]}
                            onPress={() => viewFile(item.id)}
                        />
                        <Btn
                            content={<Icon name="edit" />}
                            style={[
                                style.btn_add,
                                { height: 30, marginEnd: 10 }
                            ]}
                            onPress={() => {
                                setNameDoc(item.name);
                                setDescFile(item.description);
                                setCategoryFile(item.categoryId);
                                setTypeDoc(item.categoryId);
                                setIdDoc(item.id);
                                setPrivate(item.isPrivate);
                                setModalVisible(true);
                            }}
                        />
                        <Btn
                            content={<Icon name="trash-o" />}
                            style={[style.btn_add, { height: 30 }]}
                            onPress={() => {
                                setDocChoose(item);
                                setModalVisibleDelete(true);
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        // Perform your refresh action here
        // For example, fetch new data from a server
        // After the refresh action is completed, setRefreshing(false)
        getData();
        setRefreshing(true);

        // Simulate a delay for demonstration purposes
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    function getCategoryNameById(categoryId) {
        const foundCategory = category.find((cat) => cat.id === categoryId);
        return foundCategory ? foundCategory.name : 'Chọn thể loại tài liệu'; // Return a default value if the category is not found
    }

    function getPrivateNameByValue(isPri) {
        const privateChoose = optionPrivate.find((pri) => pri.value === isPri);
        return privateChoose ? privateChoose.name : 'Chọn trạng thái cá nhân'; // Return a default value if the category is not found
    }

    return (
        <View style={style.container}>
            <Modal
                supportedOrientations={['portrait']}
                animationType="slide"
                transparent={true}
                visible={modalVisibleDelete}
                onRequestClose={() => {
                    setModalVisibleDelete(!modalVisibleDelete);
                }}
            >
                <SafeAreaView style={style.centeredView}>
                    <View style={{ height: 30 }}>
                        <TouchableOpacity
                            onPress={() => setModalVisibleDelete(false)}
                        >
                            <Text
                                style={{
                                    padding: 5,
                                    fontSize: 18,
                                    textAlign: 'right',
                                    marginEnd: 10
                                }}
                            >
                                <Icon name="close" size={30} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text style={style.title}>Xoá tài liệu</Text>

                        {docChoose && (
                            <Text>
                                DeleteFile <Icon name="file" /> :{' '}
                                {docChoose.name}
                            </Text>
                        )}

                        <Btn
                            content={'Delete'}
                            style={{
                                width: '100%',
                                margin: 0,
                                marginBottom: 10
                            }}
                            onPress={() => {
                                setModalVisibleDelete(false);
                                deleteDoc(docChoose.id);
                            }}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
            <Modal
                supportedOrientations={['portrait']}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <SafeAreaView style={style.centeredView}>
                    <View style={{ height: 30 }}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                        >
                            <Text
                                style={{
                                    padding: 5,
                                    fontSize: 18,
                                    textAlign: 'right',
                                    marginEnd: 10
                                }}
                            >
                                <Icon name="close" size={30} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text style={style.title}>Cập nhật tài liệu</Text>
                        <Input
                            placeholder={'Nhập vào tên File'}
                            style={{
                                width: '100%',
                                margin: 0,
                                marginBottom: 10
                            }}
                            text={nameDoc}
                            fn={(text) => setNameDoc(text)}
                        />

                        <Input
                            placeholder={'Nhập vào mô tả File'}
                            style={{
                                width: '100%',
                                margin: 0,
                                marginBottom: 10
                            }}
                            text={descFile}
                            fn={(text) => setDescFile(text)}
                        />

                        <SelectDropdown
                            data={category}
                            onSelect={handleDropdownSelect}
                            buttonTextAfterSelection={renderButtonText}
                            rowTextForSelection={renderDropdownRow}
                            defaultButtonText={getCategoryNameById(
                                categoryFile
                            )}
                            dropdownIconPosition={'right'}
                            buttonStyle={style.dropdown}
                            buttonTextStyle={{ fontSize: 13 }}
                        />

                        <SelectDropdown
                            data={optionPrivate}
                            onSelect={handleDropdownSelectPrivate}
                            buttonTextAfterSelection={renderButtonTextPrivate}
                            rowTextForSelection={renderDropdownRowPrivate}
                            defaultButtonText={getPrivateNameByValue(isPrivate)}
                            dropdownIconPosition={'right'}
                            buttonStyle={style.dropdown}
                            buttonTextStyle={{ fontSize: 13 }}
                        />

                        <Btn
                            content={
                                <Icon
                                    name="cloud-upload"
                                    size={18}
                                    color="#fff"
                                />
                            }
                            onPress={uploadFileToUpdate}
                            style={{ width: '100%' }}
                        />

                        {nameFile && (
                            <Text>
                                File đã chọn <Icon name="file" /> : {nameFile}
                            </Text>
                        )}

                        <Btn
                            content={'Cập nhật'}
                            style={{
                                width: '100%',
                                margin: 0,
                                marginBottom: 10
                            }}
                            onPress={() => {
                                setModalVisible(false);
                                setLoading(true);
                                updateDocument();
                            }}
                        />
                    </View>
                </SafeAreaView>
            </Modal>

            <Modal
                supportedOrientations={['portrait']}
                animationType="slide"
                transparent={true}
                visible={loading}
                onRequestClose={() => {
                    setLoading(!loading);
                }}
            >
                <SafeAreaView style={[style.centeredView, { opacity: 0.5 }]}>
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

            <View style={style.header}>
                <Btn
                    content={<Icon name="plus" />}
                    style={style.btn_add}
                    onPress={uploadFile}
                />
            </View>
            <View style={style.body}>
                {/* <Text style={style.title}>Danh sách file đã upload</Text> */}
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    data={data}
                    renderItem={({ item }) => <Item item={item} />}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    );
}

export default Files;

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    body: {
        flex: 8
    },
    btn_add: {
        width: 50
    },
    item: {
        flexDirection: 'column',
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'space-between',
        maxWidth: '100%'
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 30
    },
    reloadView: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    centeredView: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    },
    dropdown: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
        marginBottom: 10,
        marginTop: 10,
        padding: 10
    }
});
