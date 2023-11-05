import UUIDGenerator from 'react-native-uuid';

const generateUUID = () => {
    return UUIDGenerator.v4();
};

export { generateUUID };
