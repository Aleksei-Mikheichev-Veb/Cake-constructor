import React, { useState } from 'react';
import styles from './ReferenceUpload.module.scss';

type Props = {
    comment: string;
    onCommentChange: (value: string) => void;
    images: { id: string; preview: string }[];
    onAddImages: (files: File[]) => void;
    onRemoveImage: (id: string) => void;
    maxImages?: number;
};

export const ReferenceControls = ({
                                    comment,
                                    onCommentChange,
                                    images,
                                    onAddImages,
                                    onRemoveImage,
                                    maxImages = 3,
                                }: Props) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (validFiles.length > 0) {
            onAddImages(validFiles);
        }
    };

    const canAddMore = images.length < maxImages;

    return (
        <div className={styles.referenceBlock}>
            <h3 className={styles.title}>Референсное фото</h3>
            <p className={styles.hint}>
                Прикрепите пример торта, который вам нравится (до {maxImages} шт.)
            </p>

            {canAddMore && (
                <div
                    className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleFiles(e.dataTransfer.files);
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFiles(e.target.files)}
                        className={styles.hiddenInput}
                        id="ref-upload"
                    />
                    <label htmlFor="ref-upload" className={styles.uploadButton}>
                        Выбрать фото или перетащить сюда
                    </label>
                </div>
            )}

            {images.length > 0 && (
                <div className={styles.previews}>
                    {images.map((img) => (
                        <div key={img.id} className={styles.previewItem}>
                            <img src={img.preview} alt="референс" className={styles.previewImage} />
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => onRemoveImage(img.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.commentArea}>
                <label className={styles.commentLabel}>Комментарий / пожелания</label>
                <textarea
                    className={styles.textarea}
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder="Например: хочу примерно такой же, но в голубом цвете и без макаронсов"
                    rows={4}
                    maxLength={500}
                />
                <div className={styles.charCount}>
                    {comment.length} / 500
                </div>
            </div>
        </div>
    );
};

export default ReferenceControls;