// /src/components/Edit.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { FiEdit } from "react-icons/fi"
import { StudyData } from '../types/studyData';
import { useFirebase } from '../hooks/useFirebase';

type Props = {
    learning: StudyData
}

const Edit: React.FC<Props> = ({ learning }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { loading, email, updateDb, fetchDb, isDbChanged, setIsDbChanged, learnings } = useFirebase()
    const initialRef = useRef(null)
    const [localLearning, setLocalLearning] = useState(learning)
    const toast = useToast()

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalLearning({
            ...localLearning,
            title: e.target.value
        })
    }

    const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalLearning({
            ...localLearning,
            time: Number(e.target.value)
        })
    }

    const handleUpdate = async () => {
        await updateDb(localLearning);  // 更新
        await fetchDb(email);           // 更新後に再取得
        setIsDbChanged(true);           // 変更フラグをセット
    }

    useEffect(() => {
        if (isDbChanged) {
            console.log('モーダルクローズ時', learnings);  // 正しいデータを確認
            onClose();  // モーダルを閉じる
        }
    }, [isDbChanged, learnings, onClose]);


    return (
        <>
            <Button variant='ghost' onClick={() => {
                setLocalLearning(learning)
                onOpen()
            }}><FiEdit color='black' /></Button>

            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>記録編集</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>学習内容</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder='学習内容'
                                name='title'
                                value={localLearning.title}
                                onChange={handleChangeTitle}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>学習時間</FormLabel>
                            <Input
                                type='number'
                                placeholder='学習時間'
                                name='time'
                                value={localLearning.time}
                                onChange={handleChangeTime}
                            />
                        </FormControl>
                        <div>入力されている学習内容：{localLearning.title}</div>
                        <div>入力されている学習時間：{localLearning.time}</div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            isLoading={loading}
                            loadingText='Loading'
                            spinnerPlacement='start'
                            colorScheme='green'
                            mr={3}
                            onClick={() => {
                                if (localLearning.title !== "" && localLearning.time > 0) {
                                    handleUpdate()
                                }
                                else {
                                    toast({
                                        title: '学習内容と時間を入力してください',
                                        position: 'top',
                                        status: 'error',
                                        duration: 2000,
                                        isClosable: true,
                                    })
                                }

                            }}
                        >
                            データを更新
                        </Button>
                        <Button onClick={() => {
                            onClose()
                        }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Edit;