import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Modal, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';
import { GlobalContext } from '../../store/GlobalProvider';
import { postEditChuKyBaoDuong } from '../../api/Api_CongViec';
import { getValidString, getValidNumber } from '../../common/CommonFunction';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const ChuKyBaoDuongModal = ({ visible, onClose, id, duphong, baoduong, chuky }) => {

    const base_url = useContext(GlobalContext).url;
    const [isLoading, setIsLoading] = useState(false); 
    const richText1 = useRef(null);
    const richText2 = useRef(null);
    const richText3 = useRef(null);

    const [formState, setFormState] = useState({
        id: id,
        duphong: duphong,
        baoduong:  baoduong,
        chuky: chuky
    });

    const handleChange = (name, value) => {
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        setFormState({ id, duphong, baoduong, chuky });
    }, [id, duphong, baoduong, chuky]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append('id', getValidNumber(formState.id));
            formData.append('duphong', getValidString(formState.duphong));
            formData.append('baoduong', getValidString(formState.baoduong));
            formData.append('chuky', getValidString(formState.chuky));

            const response = await postEditChuKyBaoDuong(base_url, formData);
            if (response?.resultCode) {            
                onClose();
            } else {
                console.log("Form data:", formData);
                console.log("Response:", response);
                Alert.alert("Error", "Lỗi trong khi cập nhật dữ liệu");
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderRichEditorBaoDuong = (value, fieldName) => (
        <View style={styles.richTextContainer}>
            <RichEditor
                ref={richText1}
                onChange={(content) => handleChange(fieldName, content)}
                maxLength={200}
                editorStyle={styles.richEditor}
                placeholder=""
                initialContentHTML={value}
                androidHardwareAccelerationDisabled={true}
                style={styles.richTextEditorStyle}
            />
            <RichToolbar
                editor={richText1}
                selectedIconTint="#873c1e"
                iconTint="#312921"
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.setStrikethrough,
                    actions.setUnderline,
                ]}
                style={styles.richTextToolbarStyle}
            />
        </View>
    );

    const renderRichEditorChuKy = (value, fieldName) => (
        <View style={styles.richTextContainer}>
            <RichEditor
                ref={richText2}
                onChange={(content) => handleChange(fieldName, content)}
                maxLength={200}
                editorStyle={styles.richEditor}
                placeholder=""
                initialContentHTML={value}
                androidHardwareAccelerationDisabled={true}
                style={styles.richTextEditorStyle}
            />
            <RichToolbar
                editor={richText2}
                selectedIconTint="#873c1e"
                iconTint="#312921"
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.setStrikethrough,
                    actions.setUnderline,
                ]}
                style={styles.richTextToolbarStyle}
            />
        </View>
    );
    const renderRichEditorDuPhong = (value, fieldName) => (
        <View style={styles.richTextContainer}>
            <RichEditor
                ref={richText3}
                onChange={(content) => handleChange(fieldName, content)}
                maxLength={200}
                editorStyle={styles.richEditor}
                placeholder=""
                initialContentHTML={value}
                androidHardwareAccelerationDisabled={true}
                style={styles.richTextEditorStyle}
            />
            <RichToolbar
                editor={richText3}
                selectedIconTint="#873c1e"
                iconTint="#312921"
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.setStrikethrough,
                    actions.setUnderline,
                ]}
                style={styles.richTextToolbarStyle}
            />
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}>
            <View style={styles.container_modal}>
                <View style={styles.container_popup}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text>Loading...</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.buttonContainer}>
                                <Icon name='close' size={20} onPress={onClose} style={styles.closeButton} />
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Bảo dưỡng:</Text>
                                </View>
                                {renderRichEditorBaoDuong(formState.baoduong, 'baoduong')}
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Chu kỳ:</Text>
                                </View>
                                {renderRichEditorChuKy(formState.chuky, 'chuky')}
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Dự phòng:</Text>
                                </View>
                                {renderRichEditorDuPhong(formState.duphong, 'duphong')}
                            </View>

                            <View style={styles.row}>
                                <TouchableOpacity style={styles.btnButtons} onPress={handleSubmit}>
                                    <Icon name="content-save-edit-outline" color="#fff" size={18} />
                                    <Text style={styles.btnText}>Cập nhật</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container_modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container_popup: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        width: '96%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 5
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginLeft: 10,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    row: {
        marginTop: 5,
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#2755ab',
        borderRadius: 5,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    richTextContainer: {
        display: "flex",
        flexDirection: "column-reverse",
        width: "95%",
        marginLeft: 8,
        marginBottom: 10
    },
    richTextEditorStyle: {
        borderWidth: 1,
        borderColor: "#ccaf9b",    
        fontSize: 14,
    },    
    richTextToolbarStyle: {
        backgroundColor: "#c6c3b3",
        borderColor: "#c6c3b3",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    closeButton: {
        padding: 2,
        backgroundColor: '#cccccc',
        fontWeight: 'bold',
        color: '#000',
        borderRadius: 3,
    },
});

export default ChuKyBaoDuongModal;