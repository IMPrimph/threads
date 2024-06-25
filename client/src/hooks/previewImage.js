/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import showToast from './showToast';

export const previewImage = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const toast = showToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file && file.type.startsWith('image')) {
            reader.onloadend = () => {
                setImgUrl(reader.result);
            }
            reader.readAsDataURL(file);
        } else {
            toast('Invalid file type', 'Please select an image file', 'error');
            setImgUrl(null);
        }
    };
    return { handleImageChange, imgUrl, setImgUrl }
}
