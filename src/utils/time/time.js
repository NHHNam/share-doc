const commentPostedTime = (timeInMileSec) => {
    const seconds = Math.floor(timeInMileSec / 1000);
    const minutes = Math.floor(timeInMileSec / (1000 * 60));
    const hours = Math.floor(timeInMileSec / (1000 * 60 * 60));
    const days = Math.floor(timeInMileSec / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(timeInMileSec / (1000 * 60 * 60 * 24 * 7));
    const months = Math.floor(timeInMileSec / (1000 * 60 * 60 * 24 * 30)); // Approximate months
    const years = Math.floor(timeInMileSec / (1000 * 60 * 60 * 24 * 365)); // Approximate years

    if (seconds < 60) {
        return seconds + ' giây trước';
    } else if (minutes < 60) {
        return minutes + ' phút trước';
    } else if (hours < 24) {
        return hours + ' giờ trước';
    } else if (days < 7) {
        return days + ' ngày trước';
    } else if (weeks < 4) {
        return weeks + ' tuần trước';
    } else if (months < 12) {
        return months + ' tháng trước';
    } else {
        return years + ' năm trước';
    }
};

export default commentPostedTime;
