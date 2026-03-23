import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './AddImage.module.scss';
import {RootState} from "../../../../../../redux/store";
import {setImagePreview} from "../../../../../../redux/cakeConstructorSlice";

const PhotoPrintControls = () => {
    const dispatch = useDispatch();
    const imagePreview = useSelector((state: RootState) => state.cakeConstructor.imagePreview);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch(setImagePreview(reader.result as string)); // Отправляем в Redux
            };
            reader.readAsDataURL(file);
        } else {
            dispatch(setImagePreview(null)); // Сбрасываем в Redux
        }
    };

    const handleDeleteImage = () => {
        dispatch(setImagePreview(null)); // Сбрасываем в Redux
    };

    return (
        <section className={styles.addImage}>
            <h2 className={styles.addImage_title}>Фотопечать + 650 руб</h2>
            <div className={styles.addImage_container}>
                <label htmlFor="addFile" className={styles.addImage_icon}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="42px"
                        width="42px"
                        viewBox="0 0 32 32"
                        enableBackground="new 0 0 32 32"
                        id="svg2"
                        version="1.1"
                    >
                        <g id="background">
                            <rect fill="none" height="32" width="32" />
                        </g>
                        <g id="image_x5F_add">
                            <path d="M28,8h-4l-4-4h-8.001L8,8H4c0,0-4,0-4,4v12c0,4,4,4,4,4s5.662,0,11.518,0c1.614,2.411,4.361,3.999,7.482,4 c3.875-0.002,7.167-2.454,8.436-5.888C31.995,25.076,32,24,32,24s0-8,0-12S28,8,28,8z M14.033,23.66C11.686,22.847,10,20.626,10,18 c0-3.312,2.684-6,6-6c1.914,0,3.607,0.908,4.706,2.306C16.848,15.321,14,18.822,14,23C14,23.223,14.018,23.441,14.033,23.66z M23,29.883c-3.801-0.009-6.876-3.084-6.885-6.883c0.009-3.801,3.084-6.876,6.885-6.885c3.799,0.009,6.874,3.084,6.883,6.885 C29.874,26.799,26.799,29.874,23,29.883z" />
                            <g>
                                <polygon points="28,22 24.002,22 24.002,18 22,18 22,22 18,22 18,24 22,24 22,28 24.002,28 24.002,24 28,24" />
                            </g>
                        </g>
                    </svg>
                </label>
                <input
                    className={styles.addImage_input}
                    id="addFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {imagePreview && (
                    <div className={styles.addImage_imageBox}>
                        <img
                            src={imagePreview}
                            alt="Превью изображения"
                            className={styles.addImage_preview}
                        />
                        <div className={styles.addImage_delete} onClick={handleDeleteImage}>
                            х
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PhotoPrintControls;