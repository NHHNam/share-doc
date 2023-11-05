export const convert_name = (name) => {
    if (name.length > 40) {
        return name.substring(0, 40) + '...';
    } else {
        return name;
    }
};
