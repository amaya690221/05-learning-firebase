// /src/components/Home.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; //useNavigate追加
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useFirebase } from "../hooks/useFirebase";
import { StudyData } from "../types/studyData";

const Home = () => {
  const {
    loading,
    user,
    email,
    learnings,
    fetchDb,
    calculateTotalTime,
    updateDb,
    entryDb,
    deleteDb,
    handleLogout,
  } = useFirebase();
  const modalEdit = useDisclosure();
  const modalEntry = useDisclosure();
  const modalDelete = useDisclosure();
  const alertLogout = useDisclosure();
  const initialRef = useRef(null);
  const cancelRef = useRef(null);
  const [editLearning, setEditLearning] = useState<StudyData>({
    id: "",
    title: "",
    time: 0,
  });
  const [entryLearning, setEntryLearning] = useState<StudyData>({
    id: "",
    title: "",
    time: 0,
  });
  const [deleteLearning, setDeleteLearning] = useState<StudyData>({
    id: "",
    title: "",
    time: 0,
  });
  const toast = useToast();
  const navigate = useNavigate(); //追加

  useEffect(() => {
    if (user) {
      fetchDb(email);
      console.log("Firestore", email);
    }
  }, [user]);

  const handleUpdate = async () => {
    await updateDb(editLearning);
    fetchDb(email);
    if (!loading) {
      setTimeout(() => {
        modalEdit.onClose();
      }, 500);
    }
  };

  const handleEntry = async () => {
    if (learnings.some((l) => l.title === entryLearning.title)) {
      const existingLearning = learnings.find(
        (l) => l.title === entryLearning.title
      );
      if (existingLearning) {
        existingLearning.time += entryLearning.time;
        await updateDb(existingLearning);
      }
    } else {
      await entryDb(entryLearning);
    }
    fetchDb(email);
    setEntryLearning({ id: "", title: "", time: 0 });
    if (!loading) {
      setTimeout(() => {
        modalEntry.onClose();
      }, 500);
    }
  };

  const handleDelete = async () => {
    await deleteDb(deleteLearning);
    fetchDb(email);
    if (!loading) {
      setTimeout(() => {
        modalDelete.onClose();
      }, 500);
    }
  };

  return (
    <>
      <Flex alignItems="center" justify="center" p={5}>
        <Card size={{ base: "sm", md: "lg" }}>
          <Box textAlign="center" mb={2} mt={10}>
            ようこそ！{email} さん
          </Box>
          <Heading size="md" textAlign="center">
            Learning Records
          </Heading>
          <CardBody>
            <Box textAlign="center">
              学習記録
              {loading && (
                <Box p={10}>
                  <Spinner />
                </Box>
              )}
              <TableContainer>
                <Table variant="simple" size={{ base: "sm", md: "lg" }}>
                  <Thead>
                    <Tr>
                      <Th>学習内容</Th>
                      <Th>時間(分)</Th>
                      <Th></Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {learnings.map((learning, index) => (
                      <Tr key={index}>
                        <Td>{learning.title}</Td>
                        <Td>{learning.time}</Td>
                        <Td>
                          {/* 編集用モーダル */}
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditLearning(learning);
                              modalEdit.onOpen();
                            }}
                          >
                            <FiEdit color="black" />
                          </Button>

                          <Modal
                            initialFocusRef={initialRef}
                            isOpen={modalEdit.isOpen}
                            onClose={modalEdit.onClose}
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
                                    placeholder="学習内容"
                                    name="title"
                                    value={editLearning.title}
                                    onChange={(e) => {
                                      setEditLearning({
                                        ...editLearning,
                                        title: e.target.value,
                                      });
                                    }}
                                  />
                                </FormControl>

                                <FormControl mt={4}>
                                  <FormLabel>学習時間</FormLabel>
                                  <Input
                                    type="number"
                                    placeholder="学習時間"
                                    name="time"
                                    value={editLearning.time}
                                    onChange={(e) => {
                                      setEditLearning({
                                        ...editLearning,
                                        time: Number(e.target.value),
                                      });
                                    }}
                                  />
                                </FormControl>
                                <div>
                                  入力されている学習内容：{editLearning.title}
                                </div>
                                <div>
                                  入力されている学習時間：{editLearning.time}
                                </div>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  isLoading={loading}
                                  loadingText="Loading"
                                  spinnerPlacement="start"
                                  colorScheme="green"
                                  mr={3}
                                  onClick={() => {
                                    if (
                                      editLearning.title !== "" &&
                                      editLearning.time > 0
                                    ) {
                                      handleUpdate();
                                    } else {
                                      toast({
                                        title:
                                          "学習内容と時間を入力してください",
                                        position: "top",
                                        status: "error",
                                        duration: 2000,
                                        isClosable: true,
                                      });
                                    }
                                  }}
                                >
                                  データを更新
                                </Button>
                                <Button
                                  onClick={() => {
                                    modalEdit.onClose();
                                  }}
                                >
                                  Cancel
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Td>
                        <Td>
                          {/* 削除用モーダル */}
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setDeleteLearning(learning);
                              modalDelete.onOpen();
                            }}
                          >
                            <MdDelete color="black" />
                          </Button>
                          <Modal
                            isOpen={modalDelete.isOpen}
                            onClose={modalDelete.onClose}
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>データ削除</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody pb={6}>
                                <Box>
                                  以下のデータを削除します。
                                  <br />
                                  学習内容：{deleteLearning.title}、学習時間:
                                  {deleteLearning.time}
                                </Box>
                              </ModalBody>
                              <ModalFooter>
                                <Button onClick={modalDelete.onClose} mr={3}>
                                  Cancel
                                </Button>
                                <Button
                                  isLoading={loading}
                                  loadingText="Loading"
                                  spinnerPlacement="start"
                                  ref={initialRef}
                                  colorScheme="red"
                                  onClick={handleDelete}
                                >
                                  削除
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>

            <Box p={5}>
              <div>合計学習時間：{calculateTotalTime()}分</div>
            </Box>

            {/* 新規登録モーダル */}
            <Box p={25}>
              <Stack spacing={3}>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={modalEntry.onOpen}
                >
                  新規データ登録
                </Button>
              </Stack>
              <Modal
                initialFocusRef={initialRef}
                isOpen={modalEntry.isOpen}
                onClose={modalEntry.onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>新規データ登録</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <FormControl>
                      <FormLabel>学習内容</FormLabel>
                      <Input
                        ref={initialRef}
                        name="newEntryTitle"
                        placeholder="学習内容"
                        value={entryLearning.title}
                        onChange={(e) => {
                          setEntryLearning({
                            ...entryLearning,
                            title: e.target.value,
                          });
                        }}
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel>学習時間</FormLabel>
                      <Input
                        type="number"
                        name="newEntryTime"
                        placeholder="学習時間"
                        value={entryLearning.time}
                        onChange={(e) => {
                          setEntryLearning({
                            ...entryLearning,
                            time: Number(e.target.value),
                          });
                        }}
                      />
                    </FormControl>
                    <div>入力されている学習内容：{entryLearning.title}</div>
                    <div>入力されている学習時間：{entryLearning.time}</div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      isLoading={loading}
                      loadingText="Loading"
                      spinnerPlacement="start"
                      colorScheme="green"
                      mr={3}
                      onClick={() => {
                        if (
                          entryLearning.title !== "" &&
                          entryLearning.time > 0
                        ) {
                          handleEntry();
                        } else {
                          toast({
                            title: "学習内容と時間を入力してください",
                            position: "top",
                            status: "error",
                            duration: 2000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      登録
                    </Button>
                    <Button
                      onClick={() => {
                        modalEntry.onClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>

            {/*ログアウトアラート*/}
            <Box px={25} mb={4}>
              <Stack spacing={3}>
                <Button
                  width="100%"
                  variant="outline"
                  onClick={alertLogout.onOpen}
                >
                  ログアウト
                </Button>
                <AlertDialog
                  motionPreset="slideInBottom"
                  leastDestructiveRef={cancelRef}
                  onClose={alertLogout.onClose}
                  isOpen={alertLogout.isOpen}
                  isCentered
                >
                  <AlertDialogOverlay />
                  <AlertDialogContent>
                    <AlertDialogHeader>ログアウト</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>ログアウトしますか?</AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={alertLogout.onClose}>
                        Cancel
                      </Button>
                      <Button
                        isLoading={loading}
                        loadingText="Loading"
                        spinnerPlacement="start"
                        colorScheme="red"
                        ml={3}
                        onClick={handleLogout}
                      >
                        ログアウト
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Stack>
            </Box>

            <Box px={25} mb={4}>
              <Stack spacing={3}>
                <Button
                  width="100%"
                  variant="outline"
                  onClick={() => navigate("/updatePassword")} //変更
                >
                  パスワード更新
                </Button>
              </Stack>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
export default Home;
